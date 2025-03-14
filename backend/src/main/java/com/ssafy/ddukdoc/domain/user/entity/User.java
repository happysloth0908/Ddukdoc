package com.ssafy.ddukdoc.domain.user.entity;

import com.ssafy.ddukdoc.domain.user.entity.constants.Provider;
import com.ssafy.ddukdoc.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class User extends BaseEntity {
    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(name = "user_type", length = 20, nullable = false)
    private String userType;

    @Column(name = "social_provider", length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    private Provider socialProvider;

    @Column(name = "social_key", length = 100, nullable = false)
    private String socialKey;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}