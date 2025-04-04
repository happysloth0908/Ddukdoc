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

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private DocumentStatus status;

    @Column(name = "ipfs_hash")
    private String ipfsHash;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "return_reason")
    private String returnReason;


    /**
     * 문서 상태 변경 메서드
     * @param status 변경할 상태
     */
    public void updateStatus(DocumentStatus status){
        this.status = status;
    }

    /**
     * 수신자 정보 업데이트 메서드
     * @param recipient 수신자 정보
     */
    public void updateRecipient(User recipient){
        this.recipient = recipient;
    }
    /**
     * 문서 경로 변경 메서드
     * @param filePath 변경할 상태
     */
    public void updateFilePath(String filePath) {
        this.filePath = filePath;
    }

    /**
     * 문서 반송 이유 업데이트 메소드
     * @param returnReason 반송 사유
     */
    public void updateReturnReason(String returnReason) {this.returnReason = returnReason;}

    /**
     * 문서 제목 업데이트 메서드
     * @param title 문서 제목
     */
    public void updateTitle(String title) {this.title = title;}

}