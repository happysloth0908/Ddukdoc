package com.ssafy.ddukdoc.domain.material.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MaterialDownloadResponseDto {
    @Schema(example = "차용증 기타자료")
    private String fileTitle;
    @Schema(description = "ZIP 파일의 바이너리 콘텐츠", type = "string", format = "binary")
    private byte[] zipBytes;

    public static MaterialDownloadResponseDto of(Document document, byte[] zipContent){
        return MaterialDownloadResponseDto.builder()
                .fileTitle(document.getTitle().replaceAll("\\s+", "_"))
                .zipBytes(zipContent)
                .build();
    }
}
