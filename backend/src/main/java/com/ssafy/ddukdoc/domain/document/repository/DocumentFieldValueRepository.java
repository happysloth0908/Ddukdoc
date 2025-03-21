package com.ssafy.ddukdoc.domain.document.repository;

import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentFieldValueRepository extends JpaRepository<DocumentFieldValue, Integer> {

    // 문서 ID로 모든 필드 값 조회 (JOIN FETCH 사용해서 N+1 방지)
    @Query("SELECT dfv FROM DocumentFieldValue dfv " +
            "JOIN FETCH dfv.field tf " +  // TemplateField를 참조
            "WHERE dfv.document.id = :documentId " +
            "ORDER BY tf.displayOrder")
    List<DocumentFieldValue> findAllByDocumentIdOrderByFieldDisplayOrder(@Param("documentId") Integer documentId);
}
