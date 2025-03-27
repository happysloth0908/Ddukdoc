package com.ssafy.ddukdoc.domain.document.entity;

import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "document_field_values")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class DocumentFieldValue extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id")
    private TemplateField field;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filled_by")
    private User filledBy;

    @Column(name = "field_value", columnDefinition = "TEXT")
    private String fieldValue;
}
