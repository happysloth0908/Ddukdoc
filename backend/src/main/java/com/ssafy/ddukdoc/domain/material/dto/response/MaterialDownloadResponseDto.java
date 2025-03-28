package com.ssafy.ddukdoc.domain.material.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MaterialDownloadResponseDto {
    private String fileTitle;
    private byte[] zipBytes;

    public static MaterialDownloadResponseDto of(Document document, byte[] zipContent){
        return MaterialDownloadResponseDto.builder()
                .fileTitle(document.getTitle().replaceAll("\\s+", "_"))
                .zipBytes(zipContent)
                .build();
    }
}
