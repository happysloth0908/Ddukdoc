package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DocumentDownloadResponseDto {
    private String documentTitle;
    private byte[] documentContent;

    public static DocumentDownloadResponseDto of(Document document, byte[] content){
        return DocumentDownloadResponseDto.builder()
                .documentTitle(document.getTitle().replaceAll("\\s+", "_"))
                .documentContent(content)
                .build();
    }
}
