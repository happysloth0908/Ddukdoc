package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DocumentDownloadResponseDto {
    @Schema(example = "차용증 문서")
    private String documentTitle;
    @Schema(description = "PDF 문서의 바이너리 콘텐츠", type = "string", format = "binary")
    private byte[] documentContent;

    public static DocumentDownloadResponseDto of(Document document, byte[] content){
        return DocumentDownloadResponseDto.builder()
                .documentTitle(document.getTitle().replaceAll("\\s+", "_"))
                .documentContent(content)
                .build();
    }
}
