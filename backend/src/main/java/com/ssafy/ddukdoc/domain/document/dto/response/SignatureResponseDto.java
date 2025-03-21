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

    public static SignatureResponseDto of(Signature signature, Document document){
        Integer signatureUserId = signature.getUser().getId();
        String creatorSignature = null;
        String recipientSignature = null;

        if(document.getCreator() != null && document.getCreator().getId().equals(signatureUserId)){
            creatorSignature = signature.getIpfsHash();
        }

        if(document.getRecipient() != null && document.getRecipient().getId().equals(signatureUserId)){
            recipientSignature = signature.getIpfsHash();
        }

        return SignatureResponseDto.builder()
                .creatorSignature(creatorSignature)
                .recipientSignature(recipientSignature)
                .build();
    }
}