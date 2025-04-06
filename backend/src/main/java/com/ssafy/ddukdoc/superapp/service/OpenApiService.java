package com.ssafy.ddukdoc.superapp.service;

import com.ssafy.ddukdoc.global.common.util.blockchain.BlockchainUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import com.ssafy.ddukdoc.superapp.dto.response.FileRegisterResultDto;
import com.ssafy.ddukdoc.superapp.util.MetadataAddUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OpenApiService {

    private final BlockchainUtil blockchainUtil;
    private final MetadataAddUtil metadataAddUtil;
    // 지원하는 파일 확장자 목록
    private static final Set<String> SUPPORTED_EXTENSIONS = new HashSet<>(
            Arrays.asList("pdf","png", "docx","doc")
    );
    @Transactional
    public FileRegisterResultDto registerFile(MultipartFile file) {
        // 파일 이름 및 데이터 가져오기
        String filename = file.getOriginalFilename();

        // 파일 확장자 확인
        String extension = getFileExtension(filename);
        if (!SUPPORTED_EXTENSIONS.contains(extension)) {
            throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT, "허용되지 않는 확장자입니다", extension);
        }

        // 메타데이터에 docName 추가
        Map<String,Object> dataWithMetadata = metadataAddUtil.processDocument(file);

        String docName = (String)dataWithMetadata.get("docName");
        byte[] pdfData = (byte[])dataWithMetadata.get("byteData");

        try {
            // 블록체인에 해시값과 docName 저장
            blockchainUtil.saveDocumentInBlockchain(pdfData,null, docName);
        } catch (Exception e) {
            log.error("블록체인 저장 오류: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.BLOCKCHAIN_SAVE_ERROR, "블록체인에 저장 중 오류가 발생했습니다", e.getMessage());
        }

        // 응답 생성
        return FileRegisterResultDto.of(filename,pdfData,null);
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT, "file_name", filename);
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
