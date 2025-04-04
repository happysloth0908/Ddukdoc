package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SsafyDocumentDetailResponseDto {

    private SsafyDocumentResponseDto docsInfo;
    private List<DocumentFieldResponseDto> field;

    public static SsafyDocumentDetailResponseDto of(Document document,
                                                    List<DocumentFieldResponseDto> fieldValues,
                                                    String signature) {
        return SsafyDocumentDetailResponseDto.builder()
                .docsInfo(SsafyDocumentResponseDto.of(document, signature))
                .field(fieldValues)
                .build();
    }
}
