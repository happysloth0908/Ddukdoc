package com.ssafy.ddukdoc.domain.document.repository;

import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Query("SELECT new com.ssafy.ddukdoc.domain.document.dto.response.DocumentListDto( " +
            "d.id, t.id, t.code, t.name, d.title, d.status, " +
            "c.id, c.name, r.id, r.name, d.createdAt, d.updatedAt, d.returnReason) " +
            "FROM Document d " +
            "JOIN Template t ON d.template.id = t.id " +
            "JOIN User c ON d.creator.id = c.id " +
            "JOIN User r ON d.recipient.id = r.id " +
            "WHERE (:templateCode IS NULL OR t.code = :templateCode) " +
            "AND (:keyword IS NULL OR d.title LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:status IS NULL OR UPPER(d.status) = UPPER(:status)) " +
            "AND (:createdAt IS NULL OR FUNCTION('DATE', d.createdAt) = FUNCTION('DATE', :createdAt)) " +
            "AND ( (:sendReceiveStatus = 2 AND d.creator.id = :userId) " +
            "      OR (:sendReceiveStatus = 1 AND d.recipient.id = :userId) )")
    Page<DocumentListDto> findDocumentListByUserId(
            @Param("sendReceiveStatus") Integer sendReceiveStatus,
            @Param("templateCode") String templateCode,
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("createdAt") LocalDateTime createdAt,
            @Param("userId") Integer userId,
            Pageable pageable
    );

}
