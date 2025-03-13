package com.ssafy.ddukdoc.domain.template.entity;

import com.ssafy.ddukdoc.global.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "role")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class Role extends BaseEntity {
    @Column(length = 20)
    private String name;
}
