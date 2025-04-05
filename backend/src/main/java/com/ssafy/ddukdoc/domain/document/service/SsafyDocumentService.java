package com.ssafy.ddukdoc.domain.document.service;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import com.ssafy.ddukdoc.domain.contract.repository.SignatureRepository;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;
import com.ssafy.ddukdoc.domain.document.dto.request.SsafyDocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.request.SsafyDocumentUpdateRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentDownloadResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentFieldResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.SsafyDocumentDetailResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.SsafyDocumentResponseDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.document.repository.DocumentFieldValueRepository;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.global.common.CustomPage;
import com.ssafy.ddukdoc.global.common.util.AESUtil;
import com.ssafy.ddukdoc.global.common.util.MultipartFileUtils;
import com.ssafy.ddukdoc.global.common.util.S3Util;
import com.ssafy.ddukdoc.global.common.util.blockchain.BlockchainUtil;
import com.ssafy.ddukdoc.global.common.util.pdfgenerator.PdfGeneratorUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SsafyDocumentService {

    private static final int SSSAFY_ROLE_ID = 6;
    private final DocumentRepository documentRepository;
    private final SignatureRepository signatureRepository;
    private final DocumentFieldValueRepository documentFieldValueRepository;
    private final AESUtil aesUtil;
    private final S3Util s3Util;
    private final PdfGeneratorUtil pdfGeneratorUtil;
    private final BlockchainUtil blockchainUtil;

    public CustomPage<SsafyDocumentResponseDto> getDocsList(Integer userId, SsafyDocumentSearchRequestDto ssafyDocumentSearchRequestDto, Pageable pageable) {
        Page<Document> documentList = documentRepository.findSsafyDocumentList(
                ssafyDocumentSearchRequestDto.getTemplateCode(),
                ssafyDocumentSearchRequestDto.getKeyword(),
                ssafyDocumentSearchRequestDto.getCreatedAt(),
                userId,
                pageable
        );
        return new CustomPage<>(documentList.map(SsafyDocumentResponseDto::of));
    }

    public SsafyDocumentDetailResponseDto getSsafyDocumentDetail(Integer userId, Integer documentId) {

        // Document 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // User 검증
        if (!document.getCreator().getId().equals(userId)) {
            throw new CustomException(ErrorCode.CREATOR_NOT_MATCH, "userId", userId)
                    .addParameter("documentId", documentId);
        }

        // 서명 조회
        Signature signature = signatureRepository.findByDocumentIdAndUserId(documentId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.SIGNATURE_FILE_NOT_FOUND, "documentId", documentId)
                        .addParameter("userId", userId));

        byte[] fileBytes = s3Util.downloadAndDecryptFileToBytes(signature.getFilePath());
        String fileContent = Base64.getEncoder().encodeToString(fileBytes);

        // 문서 필드 값 조회
        List<DocumentFieldResponseDto> fieldValues = getDecryptData(documentFieldValueRepository.findAllByDocumentIdOrderByFieldDisplayOrder(documentId));

        return SsafyDocumentDetailResponseDto.of(document, fieldValues, fileContent);
    }

    // 문서 데이터 복호화
    public List<DocumentFieldResponseDto> getDecryptData(List<DocumentFieldValue> fieldValues) {
        List<DocumentFieldResponseDto> decryptedData = fieldValues.stream()
                .map(value -> {
                    // 암호화된 필드 값 복호화
                    String decryptedValue = aesUtil.decrypt(value.getFieldValue());
                    // DocumentFieldResponseDto 객체로 변환
                    return DocumentFieldResponseDto.of(value, decryptedValue);
                })
                .collect(Collectors.toList());

        return decryptedData;
    }

    public DocumentDownloadResponseDto downloadSsafyDocument(Integer userId, Integer documentId){

        // Document 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // User 검증 (생성자만 다운 가능)
        if (!document.getCreator().getId().equals(userId)) {
            throw new CustomException(ErrorCode.CREATOR_NOT_MATCH, "userId", userId)
                    .addParameter("documentId", documentId);
        }

        // S3에서 파일 다운로드
        byte[] content = s3Util.downloadAndDecryptFileToBytes(document.getFilePath());
        return DocumentDownloadResponseDto.of(document, content);
    }

    @Transactional
    public void updateSsafyDocument(Integer userId, Integer documentId, SsafyDocumentUpdateRequestDto updateRequestDto, MultipartFile multipartFile){

        // Document 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // User 검증 (생성자)
        if (!document.getCreator().getId().equals(userId)) {
            throw new CustomException(ErrorCode.CREATOR_NOT_MATCH, "userId", userId)
                    .addParameter("documentId", documentId);
        }

        // 1. 문서 제목 업데이트
        document.updateTitle(updateRequestDto.getTitle());
        
        // 2. 필드 값 업데이트 (DB에서 필드정보들을 불러와서 id로 매칭 후 값 업데이트)
        List<DocumentFieldValue> currentFieldValues = documentFieldValueRepository.findAllByDocumentIdOrderByFieldDisplayOrder(documentId);
        for(DocumentFieldDto fieldDto : updateRequestDto.getData()){
            DocumentFieldValue fieldValue = currentFieldValues.stream()
                    .filter(fv -> fv.getField().getId().equals(fieldDto.getFieldId()))
                    .findFirst()
                    .orElseThrow(()-> new CustomException(ErrorCode.TEMPLATE_FIELD_NOT_FOUND, "fieldId", fieldDto.getFieldId())
                            .addParameter("fieldName", fieldDto.getName())
                            .addParameter("documentId", documentId)
                            .addParameter("userId", userId));

            String encryptedValue = aesUtil.encrypt(fieldDto.getFieldValue());
            fieldValue.updateFieldValue(encryptedValue);
        }

        // 3. 서명 업데이트 및 서명 맵 생성
        updateSignature(document, userId, multipartFile);
        Map<Integer,byte[]> signature = new HashMap<>();
        try {
            signature.put(SSSAFY_ROLE_ID,multipartFile.getBytes());
        } catch (IOException e) {
            throw new CustomException(ErrorCode.SIGNATURE_FILE_NOT_FOUND, "documentId", documentId);
        }


        // 4. 업데이트 된 내용으로 PDF 생성 및 저장
        Map<String, Object> result = pdfGeneratorUtil.generatePdfNoData(
                TemplateCode.fromString(document.getTemplate().getCode()),
                updateRequestDto.getData(),
                signature
        );


        byte[] pdfData = (byte[])result.get("pdfData");
        String docName = (String)result.get("docName");

        // 5. 문서 해시 생성 및 블록체인 저장
        blockchainUtil.saveDocumentInBlockchain(pdfData,TemplateCode.fromString(document.getTemplate().getCode()),docName);

        // 6. 암호화된 PDF S3 저장
        String newPdfPath = saveEncryptedPdf(pdfData, document);
        
        // 7. S3에서 기존 PDF 삭제
        s3Util.deleteFileFromS3(document.getFilePath());

        // 8. Document FilePath 업데이트
        document.updateFilePath(newPdfPath);
    }

    /**
     * 서명 업데이트 메소드 (기존 서명 삭제 후 재암호화)
     * @param document 문서 엔티티
     * @param userId 사용자 아이디
     * @param signatureFile 서명파일
     */
    private void updateSignature(Document document, Integer userId, MultipartFile signatureFile) {
        if(signatureFile != null && !signatureFile.isEmpty()){
            Signature signature = signatureRepository.findByDocumentIdAndUserId(document.getId(), userId)
                    .orElseThrow(() -> new CustomException(ErrorCode.SIGNATURE_FILE_NOT_FOUND, "documentId", document.getId())
                            .addParameter("userId", userId));

            // 기존 서명 S3에서 삭제
            s3Util.deleteFileFromS3(signature.getFilePath());

            // 서명파일 암호화 하여 S3에 업로드 및 서명 업데이트
            String dirName = "signature/"+document.getId()+"/"+userId;
            String newPath = s3Util.uploadEncryptedFile(signatureFile, dirName);
            signature.updateFilePath(newPath);
            signatureRepository.save(signature);
        }
    }

    /**
     * PDF 암호화 메서드
     * @param pdfData 생성된 PDF Data
     * @param document document 엔티티
     * @return 암호화된 S3 file Path
     */
    private String saveEncryptedPdf(byte[] pdfData, Document document) {

        MultipartFile multipartFile = MultipartFileUtils.createMultipartFile(
                "document.pdf",
                "document.pdf",
                "application/pdf",
                pdfData
        );

        // PDF 파일을 암호화하여 S3에 업로드
        return s3Util.uploadEncryptedFile(multipartFile, "documents/" + document.getId());
    }
}
