package com.ssafy.ddukdoc.domain.template.entity;

import com.ssafy.ddukdoc.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "template_fields")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class TemplateField extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private Template template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 50, nullable = false)
    private String type;

    @Column(name = "field_label", nullable = false)
    private String fieldLabel;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "field_group", length = 50)
    private String fieldGroup;

    @Column(name = "max_length")
    private Integer maxLength;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "editor_type", length = 20, nullable = false)
    private String editorType;

    @Column()
    private String placeholder;
}

