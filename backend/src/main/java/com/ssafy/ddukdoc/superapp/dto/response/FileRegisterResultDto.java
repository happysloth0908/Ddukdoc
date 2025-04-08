package com.ssafy.ddukdoc.superapp.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import org.bouncycastle.asn1.cms.MetaData;
import org.springframework.http.MediaType;

@Getter
@Builder
public class FileRegisterResultDto {

    @Schema(description = "파일명", example = "doc_1234abcd")
    private String fileName;

    @Schema(description = "파일 바이트 데이터 (Base64 인코딩)")
    private String fileData;

    private MediaType mediaType;

    public static FileRegisterResultDto of(String fileName,MediaType mediaType,String fileData){
        return FileRegisterResultDto.builder()
                .fileName(fileName)
                .mediaType(mediaType)
                .fileData(fileData)
                .build();
    }
}