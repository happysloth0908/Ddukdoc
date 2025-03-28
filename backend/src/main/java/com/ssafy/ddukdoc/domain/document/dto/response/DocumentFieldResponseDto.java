package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DocumentFieldResponseDto {
    @Schema(example = "1")
    private Integer fieldId;
    @Schema(example = "2")
    private Integer roleId;
    @Schema(example = "loan_purpose")
    private String fieldName;
    @Schema(example = "true")
    private Boolean isRequired;
    @Schema(example = "VARCHAR(200)")
    private String type;
    @Schema(example = "1")
    private Integer order;
    @Schema(example = "기본정보")
    private String group;
    @Schema(example = "사업 운영 자금")
    private String fieldValue;

    public static DocumentFieldResponseDto of(DocumentFieldValue documentFieldValue){
        return DocumentFieldResponseDto.builder()
                .fieldId(documentFieldValue.getField().getId())
                .roleId(documentFieldValue.getField().getRole().getId())
                .fieldName(documentFieldValue.getField().getName())
                .isRequired(documentFieldValue.getField().getIsRequired())
                .type(documentFieldValue.getField().getType())
                .order(documentFieldValue.getField().getDisplayOrder())
                .group(documentFieldValue.getField().getFieldGroup())
                .fieldValue(documentFieldValue.getFieldValue())
                .build();
    }
}
