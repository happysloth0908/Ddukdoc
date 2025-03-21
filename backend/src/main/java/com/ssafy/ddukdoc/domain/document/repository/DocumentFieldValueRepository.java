package com.ssafy.ddukdoc.domain.document.repository;

import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentFieldValueRepository extends JpaRepository<DocumentFieldValue, Integer> {

}
