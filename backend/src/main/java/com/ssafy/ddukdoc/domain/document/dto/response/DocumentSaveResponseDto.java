package com.ssafy.ddukdoc.domain.document.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DocumentSaveResponseDto {
    private Integer pinCode;
    private Integer documentId;

    public static DocumentSaveResponseDto of(int pinCode, int documentId){
        return DocumentSaveResponseDto.builder()
                .pinCode(pinCode)
                .documentId(documentId)
                .build();
    }
}
