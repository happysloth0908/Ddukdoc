package com.ssafy.ddukdoc.domain.template.entity;

import com.ssafy.ddukdoc.global.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "templates")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class Template extends BaseEntity {
    @Column(length = 10, unique = true)
    private String code;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 50, nullable = false)
    private String category;

    @Column(name = "signature_type", length = 20, nullable = false)
    private String signatureType;

    @Column(columnDefinition = "TEXT")
    private String description;
}
