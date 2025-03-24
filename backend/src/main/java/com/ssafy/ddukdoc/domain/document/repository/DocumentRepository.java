package com.ssafy.ddukdoc.domain.document.repository;

import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

    @Query("SELECT d " +
            "FROM Document d " +
            "JOIN d.template t " +
            "JOIN d.creator c " +
            "JOIN d.recipient r " +
            "WHERE (:templateCode IS NULL OR t.code = :templateCode) " +
            "AND (:keyword IS NULL OR d.title LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:status IS NULL OR UPPER(d.status) = UPPER(:status)) " +
            "AND (:createdAt IS NULL OR FUNCTION('DATE', d.createdAt) = FUNCTION('DATE', :createdAt)) " +
            "AND ( (:sendReceiveStatus = 2 AND d.creator.id = :userId) " +
            "      OR (:sendReceiveStatus = 1 AND d.recipient.id = :userId) ) " +
            "AND d.status != 'DELETED'")
    Page<Document> findDocumentListByUserId(
            @Param("sendReceiveStatus") Integer sendReceiveStatus,
            @Param("templateCode") String templateCode,
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("createdAt") LocalDateTime createdAt,
            @Param("userId") Integer userId,
            Pageable pageable
    );

}