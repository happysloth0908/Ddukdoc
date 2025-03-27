package com.ssafy.ddukdoc.domain.material.repository;

import com.ssafy.ddukdoc.domain.material.entity.DocumentEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<DocumentEvidence, Integer> {
    List<DocumentEvidence> findAllByDocument_Id(Integer documentId);
}
