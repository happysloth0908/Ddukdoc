package com.ssafy.ddukdoc.superapp.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileRegisterResultDto {

    @Schema(description = "파일명", example = "doc_1234abcd")
    private String fileName;

    @Schema(description = "파일 바이트 데이터(인코딩 x)")
    private byte[] fileContent;

    @Schema(description = "파일 바이트 데이터 (Base64 인코딩)")
    private String fileData;

    public static FileRegisterResultDto of(String fileName,byte[] fileContent, String fileData){
        return FileRegisterResultDto.builder()
                .fileName(fileName)
                .fileContent(fileContent)
                .fileData(fileData)
                .build();
    }
}