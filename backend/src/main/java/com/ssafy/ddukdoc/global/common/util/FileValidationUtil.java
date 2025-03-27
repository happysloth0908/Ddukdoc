package com.ssafy.ddukdoc.global.common.util;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.util.Arrays;
import java.util.List;

@Component
public class FileValidationUtil {

    // 허용되는 파일 확장자 목록
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            // 오디오 파일
            "mp3", "wav", "acc", "m4a", "flac",
            // 이미지 파일
            "jpg", "jpeg", "png", "gif", "bmp", "webp",
            "pdf"

    );

    // 최대 파일 크기 (100MB)
    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024L;

    /**
     * 파일 검증
     * @param file 검증할 파일
     * @return String 파일 확장자
     */
    public String isValidFileExtension(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new CustomException(ErrorCode.MATERIAL_UPLOAD_ERROR, "material", file);
        }

        if(file.getSize() > MAX_FILE_SIZE){
            throw new CustomException(ErrorCode.MATERIAL_SIZE_EXCEEDED, "fileSize", file.getSize());
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename).toLowerCase();

        if(!ALLOWED_EXTENSIONS.contains(fileExtension)){
            throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT, "fileExtension", fileExtension);
        }

        return fileExtension;
    }

    /**
     * 파일 확장자 검증
     * @param filename 파일명
     * @return 파일 확장자
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new CustomException(ErrorCode.MATERIAL_UPLOAD_ERROR, "filename", filename);
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}