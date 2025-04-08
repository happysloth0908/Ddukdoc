package com.ssafy.ddukdoc.superapp.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MetadataProcessorFactory {

    private final List<MetadataProcessor> processors;

    /**
     * 파일 확장자에 맞는 메타데이터 처리기를 반환합니다.
     * @param extension 파일 확장자
     * @return 해당 확장자를 지원하는 메타데이터 처리기
     */
    public MetadataProcessor getProcessor(String extension) {
        return processors.stream()
                .filter(processor -> processor.supportsExtension(extension))
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT,
                        "extension", extension));
    }

    /**
     * 파일 확장자가 지원되는지 확인합니다.
     * @param extension 파일 확장자
     * @return 지원 여부
     */
    public boolean isSupported(String extension) {
        return processors.stream()
                .anyMatch(processor -> processor.supportsExtension(extension));
    }
}