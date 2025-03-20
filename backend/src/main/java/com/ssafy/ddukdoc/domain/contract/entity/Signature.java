package com.ssafy.ddukdoc.domain.contract.entity;

import com.ssafy.ddukdoc.global.common.entity.BaseEntity;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "signatures")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class Signature extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(name = "ipfs_hash", nullable = false)
    private String ipfsHash;
}