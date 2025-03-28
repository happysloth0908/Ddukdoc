package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DocumentFieldResponseDto {
    private Integer fieldId;
    private Integer roleId;
    private String fieldName;
    private Boolean isRequired;
    private String type;
    private Integer order;
    private String group;
    private String fieldValue;

    public static DocumentFieldResponseDto of(DocumentFieldValue documentFieldValue,String decryptedValue){
        return DocumentFieldResponseDto.builder()
                .fieldId(documentFieldValue.getField().getId())
                .roleId(documentFieldValue.getField().getRole().getId())
                .fieldName(documentFieldValue.getField().getName())
                .isRequired(documentFieldValue.getField().getIsRequired())
                .type(documentFieldValue.getField().getType())
                .order(documentFieldValue.getField().getDisplayOrder())
                .group(documentFieldValue.getField().getFieldGroup())
                .fieldValue(decryptedValue)
                .build();
    }
}
