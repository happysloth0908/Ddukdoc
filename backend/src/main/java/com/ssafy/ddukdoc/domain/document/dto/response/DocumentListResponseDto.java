package com.ssafy.ddukdoc.domain.document.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DocumentListResponseDto {
    private List<DocumentListDto> content;

    // DTO에서 빌더 패턴을 사용하여 변환하는 static 메서드
    public static DocumentListResponseDto of(List<DocumentListDto> content) {
        return DocumentListResponseDto.builder()
                .content(content)
                .build();
    }
}
