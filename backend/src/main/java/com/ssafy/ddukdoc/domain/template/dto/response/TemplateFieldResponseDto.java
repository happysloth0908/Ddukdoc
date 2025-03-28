package com.ssafy.ddukdoc.domain.template.dto.response;

import com.ssafy.ddukdoc.domain.template.entity.Role;
import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TemplateFieldResponseDto {
    @Schema(example = "1")
    private Integer fieldId;
    @Schema(example = "2")
    private Integer roleId;
    @Schema(example = "interest_payment_date")
    private String name;
    @Schema(example = "INT")
    private String type;
    @Schema(example = "이자 지급일 (매월)")
    private String fieldLabel;
    @Schema(example = "true")
    private Boolean isRequired;
    @Schema(example = "1")
    private Integer order;
    @Schema(example = "입금정보")
    private String group;
    @Schema(example = "null")
    private Integer maxLength;
    @Schema(example = "매월 몇 일에 지급하는지")
    private String description;
    @Schema(example = "예: 25")
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
