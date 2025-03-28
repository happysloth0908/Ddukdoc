package com.ssafy.ddukdoc.domain.document.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignatureResponseDto {
    @Schema(example = "(바이트)asdjflasdfdfkadsjflasdkfjasdfasdf...")
    private String creatorSignature;
    @Schema(example = "(바이트)asdjflksdfdsfadsjflasdkfjasdfasdf...")
    private String recipientSignature;

    public static SignatureResponseDto of(String creatorSignature, String recipientSignature) {
        return SignatureResponseDto.builder()
                .creatorSignature(creatorSignature)
                .recipientSignature(recipientSignature)
                .build();
    }
}