package com.ssafy.ddukdoc.domain.document.entity;

import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "documents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class Document extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private Template template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    private Integer pin;

    @Column(nullable = false)
    private String title;

    @Column(length = 20, nullable = false)
    private String status;

    @Column(name = "ipfs_hash")
    private String ipfsHash;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "return_reason")
    private String returnReason;
}
