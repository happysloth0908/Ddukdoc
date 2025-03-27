package com.ssafy.ddukdoc.domain.contract.entity;

import com.ssafy.ddukdoc.global.common.entity.BaseEntity;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_records")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class BlockchainRecord extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(name = "transaction_hash", nullable = false)
    private String transactionHash;

    @Column(name = "block_number")
    private Long blockNumber;

    @Column(name = "network_name", length = 50, nullable = false)
    private String networkName;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "validation_status", length = 20, nullable = false)
    private String validationStatus;
}