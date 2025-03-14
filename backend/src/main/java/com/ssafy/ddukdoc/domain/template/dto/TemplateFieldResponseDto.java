package com.ssafy.ddukdoc.domain.template.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TemplateFieldResponseDto {
    private Integer fieldId;
    private Integer roleId;
    private String name;
    private String type;
    private String fieldLabel;
    private Boolean isRequired;
    private Integer order;
    private String group;
    private Integer maxLength;
    private String description;
    private String placeHolder;
}
