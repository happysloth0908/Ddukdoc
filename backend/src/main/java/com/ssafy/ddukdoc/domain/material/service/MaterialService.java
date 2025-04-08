package com.ssafy.ddukdoc.domain.material.service;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.domain.material.dto.response.MaterialDetailResponseDto;
import com.ssafy.ddukdoc.domain.material.dto.response.MaterialDownloadResponseDto;
import com.ssafy.ddukdoc.domain.material.dto.response.MaterialListResponseDto;
import com.ssafy.ddukdoc.domain.material.entity.DocumentEvidence;
import com.ssafy.ddukdoc.domain.material.repository.MaterialRepository;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.common.util.FileValidationUtil;
import com.ssafy.ddukdoc.global.common.util.S3Util;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MaterialService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final FileValidationUtil fileValidationUtil;
    private final S3Util s3Util;

    public static final String DOCUMENT_ID = "documentId";
    public static final String USER_ID = "userId";
    public static final String MATERIAL_ID = "materialId";

    @Transactional
    public void uploadMaterial(Integer userId, Integer documentId, String title, MultipartFile file) {

        // Document 조회, 엔티티를 id로 조회 했을때 없으면 예외 발생
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // User 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID, USER_ID, userId));

        // 파일 검증
        String fileExtension = fileValidationUtil.isValidFileExtension(file);

        // S3에 파일 업로드 (암호화)
        String fileUrl = s3Util.uploadEncryptedFile(file, "material");

        // 엔티티 저장
        DocumentEvidence documentEvidence = DocumentEvidence.builder()
                .document(document)
                .user(user)
                .title(title)
                .filePath(fileUrl)
                .mimeType(fileExtension)
                .build();

        materialRepository.save(documentEvidence);
    }


    public List<MaterialListResponseDto> getMaterialList(Integer userId, Integer documentId) {

        // 문서 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // 사용자 검증
        if (!(document.getCreator().getId().equals(userId) ||
                (document.getRecipient() != null && document.getRecipient().getId().equals(userId)))) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, USER_ID, userId)
                    .addParameter(DOCUMENT_ID, documentId);
        }

        // 문서 내 등록된 추가자료 모두 조회
        List<DocumentEvidence> documentEvidenceList = materialRepository.findAllByDocument_Id(documentId);

        return documentEvidenceList.stream()
                .map(MaterialListResponseDto::of)
                .collect(Collectors.toList());
    }

    public MaterialDetailResponseDto getMaterialDetail(Integer userId, Integer documentId, Integer materialId) {

        // 문서 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // 사용자 검증
        if (!(document.getCreator().getId().equals(userId) ||
                (document.getRecipient() != null && document.getRecipient().getId().equals(userId)))) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, USER_ID, userId)
                    .addParameter(DOCUMENT_ID, documentId);
        }

        // 추가자료 검증
        DocumentEvidence material = materialRepository.findById(materialId)
                .orElseThrow(() -> new CustomException(ErrorCode.MATERIAL_NOT_FOUND, MATERIAL_ID, materialId));

        // 이미지만 상세 조회 가능
        if (!fileValidationUtil.isImageExtension(material.getMimeType())) {
            throw new CustomException(ErrorCode.MATERIAL_NOT_IMAGE, "fileFormat", material.getMimeType())
                    .addParameter(MATERIAL_ID, materialId)
                    .addParameter(DOCUMENT_ID, documentId);
        }


        // S3에서 파일 다운로드 및 복호화
        byte[] fileBytes = s3Util.downloadAndDecryptFileToBytes(material.getFilePath());

        return MaterialDetailResponseDto.of(material, fileBytes);
    }

    @Transactional
    public void deleteMaterial(Integer userId, Integer documentId, Integer materialId) {

        // 문서 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // 사용자 검증
        if (!(document.getCreator().getId().equals(userId) ||
                (document.getRecipient() != null && document.getRecipient().getId().equals(userId)))) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, USER_ID, userId)
                    .addParameter(DOCUMENT_ID, documentId);
        }

        // 추가자료 검증
        DocumentEvidence material = materialRepository.findById(materialId)
                .orElseThrow(() -> new CustomException(ErrorCode.MATERIAL_NOT_FOUND, MATERIAL_ID, materialId));

        // 추가자료 생성자 검증
        if (!material.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, USER_ID, userId)
                    .addParameter(DOCUMENT_ID, documentId)
                    .addParameter(MATERIAL_ID, materialId);
        }

        // S3에서 파일 삭제
        s3Util.deleteFileFromS3(material.getFilePath());

        // 추가자료 삭제
        materialRepository.delete(material);
    }

    public MaterialDownloadResponseDto downloadMaterial(Integer userId, Integer documentId) {

        // 문서 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // 사용자 접근 권한 확인 (문서 생성자 또는 수신자만 다운로드 가능)
        if (!(document.getCreator().getId().equals(userId) || document.getRecipient().getId().equals(userId))) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, USER_ID, userId)
                    .addParameter(DOCUMENT_ID, documentId);
        }

        // 추가자료 목록 조회
        List<DocumentEvidence> documentEvidenceList = materialRepository.findAllByDocument_Id(documentId);
        if (documentEvidenceList.isEmpty()) {
            throw new CustomException(ErrorCode.MATERIAL_DOWNLOAD_EMPTY, DOCUMENT_ID, documentId);
        }

        // Zip 파일 생성
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
        try (ZipOutputStream zipStream = new ZipOutputStream(byteStream)) {
            for (DocumentEvidence evidence : documentEvidenceList) {
                try {
                    // S3에서 파일 자료 복호화 및 다운로드
                    byte[] fileContent = s3Util.downloadAndDecryptFileToBytes(evidence.getFilePath());

                    // Zip 파일 엔트리 생성
                    ZipEntry zipEntry = new ZipEntry(evidence.getTitle() + "." + evidence.getMimeType());
                    zipStream.putNextEntry(zipEntry);
                    zipStream.write(fileContent);
                    zipStream.closeEntry();
                } catch (IOException e) {
                    log.error("자료 파일 처리 실패 - 증빙 제목: {}. 에러: {}", evidence.getTitle(), e.getMessage(), e);
                    throw new CustomException(ErrorCode.MATERIAL_DOWNLOAD_ERROR, DOCUMENT_ID, documentId)
                            .addParameter(MATERIAL_ID, evidence.getId());
                }
            }
            zipStream.finish();
        } catch (IOException e) {
            log.error("ZIP 파일 생성 실패 - documentId: {}. 에러: {}", documentId, e.getMessage(), e);
            throw new CustomException(ErrorCode.MATERIAL_ZIP_CONVERT_ERROR, DOCUMENT_ID, documentId)
                    .addParameter("예외 메세지", e.getMessage());
        }
        return MaterialDownloadResponseDto.of(document, byteStream.toByteArray());
    }

}
