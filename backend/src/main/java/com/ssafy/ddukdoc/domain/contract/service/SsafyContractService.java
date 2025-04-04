package com.ssafy.ddukdoc.domain.contract.service;

import com.ssafy.ddukdoc.domain.contract.dto.BlockchainSaveResult;
import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import com.ssafy.ddukdoc.domain.contract.repository.SignatureRepository;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.document.repository.DocumentFieldValueRepository;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.domain.template.entity.Role;
import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import com.ssafy.ddukdoc.domain.template.repository.RoleRepository;
import com.ssafy.ddukdoc.domain.template.repository.TemplateFieldRepository;
import com.ssafy.ddukdoc.domain.template.repository.TemplateRepository;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.entity.UserDocRole;
import com.ssafy.ddukdoc.domain.user.repository.UserDocRoleRepository;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.common.util.AESUtil;
import com.ssafy.ddukdoc.global.common.util.MultipartFileUtils;
import com.ssafy.ddukdoc.global.common.util.S3Util;
import com.ssafy.ddukdoc.global.common.util.blockchain.BlockchainUtil;
import com.ssafy.ddukdoc.global.common.util.pdfgenerator.PdfGeneratorUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SsafyContractService {
    private final TemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final TemplateFieldRepository templateFieldRepository;
    private final DocumentRepository documentRepository;
    private final DocumentFieldValueRepository documentFieldValueRepository;
    private final S3Util s3Util;
    private final SignatureRepository signatureRepository;
    private final RoleRepository roleRepository;
    private final UserDocRoleRepository userDocRoleRepository;
    private final AESUtil aesUtil;
    private final PdfGeneratorUtil pdfGeneratorUtil;
    private final BlockchainUtil blockchainUtil;

    public List<TemplateFieldResponseDto> getTemplateFields(String  codeStr){

        TemplateCode templateCode = TemplateCode.fromString(codeStr);

        Template template = templateRepository.findByCode(templateCode.name())
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND, "templateCode", templateCode));
        List<TemplateField> fields = templateFieldRepository.findByTemplateIdOrderByDisplayOrderAsc(template.getId());

        List<TemplateFieldResponseDto> fieldResponses = fields.stream()
                .map(TemplateFieldResponseDto::of).collect(Collectors.toList());

        return fieldResponses;
    }
    @Transactional public Integer saveDoc(String codeStr, DocumentSaveRequestDto requestDto, Integer userId, MultipartFile signatureFile, List<MultipartFile> proofDocuments){
        TemplateCode templateCode = TemplateCode.fromString(codeStr);

        // 서명 유효성 검사
        if (signatureFile == null || signatureFile.isEmpty()) {
            throw new CustomException(ErrorCode.SIGNATURE_FILE_NOT_FOUND);
        }

        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID));

        // 템플릿 조회
        Template template = templateRepository.findByCode(templateCode.name())
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND, "templateCode", templateCode.name()));

        //Document 엔티티 생성 및 저장
        Document document = requestDto.toEntity(user,template,templateCode);
        Document saveDocument = documentRepository.save(document);

        // DocumentFieldValue 엔티티들 생성 및 저장
        saveSenderInfo(requestDto, saveDocument, user);

        switch (templateCode){
            case S5:  //서명없이 저장
                return saveDocument.getId();
            case S2: case S3:  //서명 + 증빙서류 필요
                return saveDocumentWithSignatureAndExtra(document,saveDocument,user, requestDto, templateCode,signatureFile,proofDocuments);
            default:  // 서명만 필요
                return saveDocumentWithSignature(document,saveDocument,user, requestDto, templateCode,signatureFile);
        }
    }

    private Integer saveDocumentWithSignatureAndExtra(Document document, Document saveDocument, User user, DocumentSaveRequestDto requestDto, TemplateCode templateCode,MultipartFile signatureFile, List<MultipartFile> proofDocuments) {
        return 1;
    }

    private Integer saveDocumentWithSignature(Document document, Document saveDocument, User user, DocumentSaveRequestDto requestDto, TemplateCode templateCode,MultipartFile signatureFile) {
        try{
            //서명 파일 저장
            saveSignature(document,user.getId(),signatureFile);

            //user 역할 저장
            saveUserDocRole(saveDocument,user,requestDto.getRoleId());

            // 파일 생성 시 필요한 서명 맵 생성
            Map<Integer,byte[]> signature = new HashMap<>();
            signature.put(requestDto.getRoleId(),signatureFile.getBytes());;

            // 문서 pdf 생성
            byte[] pdfData = pdfGeneratorUtil.generatePdfNoData(
                    templateCode,
                    requestDto.getData(),
                    signature
            );

            // 문서 해시 생성 및 블록체인 저장
            BlockchainSaveResult resultDto = blockchainUtil.saveDocumentInBlockchain(pdfData,TemplateCode.fromString(document.getTemplate().getCode()));

            // 문서 S3에 저장
            byte[] pdfWithHash = pdfGeneratorUtil.addPdfMetadata(pdfData,resultDto);


            // 암호화된 PDF 저장
            String pdfPath = saveEncryptedPdf(pdfWithHash, document);

            //문서 상태 변경
            updateDocumentStatus(document, pdfPath);
            return saveDocument.getId();

        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_CONVERT_ERROR,"reason","서명 변환 시 오류 발생");
        }
    }


    private void saveUserDocRole(Document document, User user, int roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(()-> new CustomException(ErrorCode.INVALID_INPUT_VALUE,"role_id",roleId));

        UserDocRole userDocRole = UserDocRole.builder()
                .user(user)
                .document(document)
                .role(role)
                .build();

        userDocRoleRepository.save(userDocRole);
    }
    //서명 파일을 암호화하여 S3에 저장
    private void saveSignature(Document document, Integer userId, MultipartFile signatureFile) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID, "userId", userId));

        // 사용자 권한 확인
        if (!document.getCreator().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, "userId", userId);
        }

        String dirName = "signature/"+document.getId()+"/"+userId;
        String s3Path = s3Util.uploadEncryptedFile(signatureFile,dirName);


        // dto로 받는게 아니라서, 바로 builder 패턴 적용
        Signature signature = Signature.builder()
                .user(user)
                .document(document)
                .filePath(s3Path)
                .build();

        signatureRepository.save(signature);
    }
    private void saveSenderInfo(DocumentSaveRequestDto requestDto, Document document, User user) {
        List<DocumentFieldValue> fieldValues = requestDto.getData().stream()
                .map(fieldValueDto -> {
                    TemplateField field = templateFieldRepository.findById(fieldValueDto.getFieldId())
                            .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_FIELD_NOT_FOUND,
                                    "template_field_id", fieldValueDto.getFieldId()));

                    // 필드 값을 암호화하여 저장
                    String encryptedValue = aesUtil.encrypt(fieldValueDto.getFieldValue());

                    return fieldValueDto.toEntity(document, field, user,encryptedValue);

                })
                .collect(Collectors.toList());

        documentFieldValueRepository.saveAll(fieldValues);
    }

    //암호화된 pdf s3에 저장
    private String saveEncryptedPdf(byte[] pdfData, Document document) {

        MultipartFile multipartFile = MultipartFileUtils.createMultipartFile(
                "document.pdf",
                "document.pdf",
                "application/pdf",
                pdfData
        );

        // PDF 파일을 암호화하여 S3에 업로드
        String pdfPath = s3Util.uploadEncryptedFile(multipartFile, "contract/" + document.getId());

        return pdfPath;
    }

    // 문서 상태 변경 메서드
    private void updateDocumentStatus(Document document, String pdfPath) {
        document.updateFilePath(pdfPath);
        documentRepository.save(document);
    }

}
