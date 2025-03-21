package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignatureResponseDto {
    private String creatorSignature;
    private String recipientSignature;

    public static SignatureResponseDto of(String creatorSignature, String recipientSignature) {
        return SignatureResponseDto.builder()
                .creatorSignature(creatorSignature)
                .recipientSignature(recipientSignature)
                .build();
    }
}