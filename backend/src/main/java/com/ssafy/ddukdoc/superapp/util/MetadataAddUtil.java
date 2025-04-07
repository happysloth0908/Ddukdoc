package com.ssafy.ddukdoc.superapp.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class MetadataAddUtil {

    private final MetadataProcessorFactory metadataProcessorFactory;

    /**
     * MultipartFile로부터 파일 확장자를 추출합니다.
     * @param file MultipartFile 객체
     * @return 파일 확장자
     */
    public String getFileExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT, "filename", originalFilename);
        }
        return originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
    }

    /**
     * 고유한 문서 이름을 생성합니다.
     * @return UUID 기반 문서 이름
     */
    public String generateDocName() {

        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String timestamp = String.valueOf(System.currentTimeMillis());
        return uuid + "_" + timestamp;
    }

    /**
     * 문서 파일을 처리하여 메타데이터 추가, 해시화, 블록체인 저장을 수행합니다.
     * @param file 문서 파일
     * @return 메타데이터가 추가된 문서 파일 바이트 배열
     */
    public Map<String,Object> processDocument(MultipartFile file) {
        try {
            // 파일 확장자 체크
            String extension = getFileExtension(file);
            if (!metadataProcessorFactory.isSupported(extension)) {
                throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT, "extension", extension);
            }

            // 원본 파일 바이트 배열 가져오기
            byte[] fileData = file.getBytes();

            // 고유 문서명 생성
            String preDocName = generateDocName();
            String docName = preDocName.replace("-", "_") + "_" + System.currentTimeMillis();

            // 메타데이터 추가
            MetadataProcessor processor = metadataProcessorFactory.getProcessor(extension);
            byte[] processedData = processor.addMetadata(fileData, docName);

            Map<String, Object> result = new HashMap<>();
            result.put("byteData",processedData);
            result.put("docName",docName);

            return result;
        } catch (IOException e) {
            log.error("파일 처리 중 I/O 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.BLOCKCHAIN_SAVE_ERROR, "file processing", e.getMessage());
        }
    }
}