package com.ssafy.ddukdoc.domain.template.dto;

import com.ssafy.ddukdoc.domain.template.entity.Role;
import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Getter
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

    public static TemplateFieldResponseDto of(TemplateField templateField){
        return  TemplateFieldResponseDto.builder()
                .fieldId(templateField.getId())
                .roleId(templateField.getRole().getId())
                .name(templateField.getName())
                .type(templateField.getType())
                .fieldLabel(templateField.getFieldLabel())
                .isRequired(templateField.getIsRequired())
                .order(templateField.getDisplayOrder())
                .group(templateField.getFieldGroup())
                .maxLength(templateField.getMaxLength())
                .description(templateField.getDescription())
                .placeHolder(templateField.getPlaceholder())
                .build();
    }

    public TemplateField toEntity(Template template, Role role){
        return TemplateField.builder()
                .template(template) // 필요한 Template 객체 전달
                .role(role) // 필요한 Role 객체 전달
                .name(this.name)
                .type(this.type)
                .fieldLabel(this.fieldLabel)
                .isRequired(this.isRequired)
                .displayOrder(this.order)
                .fieldGroup(this.group)
                .maxLength(this.maxLength)
                .description(this.description)
                .placeholder(this.placeHolder)
                .build();
    }
}
