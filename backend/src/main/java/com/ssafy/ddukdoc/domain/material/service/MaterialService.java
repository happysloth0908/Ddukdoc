package com.ssafy.ddukdoc.domain.material.service;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.domain.material.entity.DocumentEvidence;
import com.ssafy.ddukdoc.domain.material.repository.MaterialRepository;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.common.util.FileValidationUtil;
import com.ssafy.ddukdoc.global.common.util.S3Util;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final FileValidationUtil fileValidationUtil;
    private final S3Util s3Util;

    @Transactional
    public void uploadMaterial(Integer userId, Integer documentId, String title, MultipartFile file){

        // Document 조회, 엔티티를 id로 조회 했을때 없으면 예외 발생
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()-> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // User 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID, "userId", userId));

        // 파일 검증
        fileValidationUtil.isValidFileExtension(file);
        
        // S3에 파일 업로드 (암호화)
        String fileUrl = s3Util.uploadEncryptedFile(file, "material");

        // 엔티티 저장
        DocumentEvidence documentEvidence = DocumentEvidence.builder()
                .document(document)
                .user(user)
                .title(title)
                .filePath(fileUrl)
                .mimeType(file.getContentType())
                .build();

        materialRepository.save(documentEvidence);
    }

}
