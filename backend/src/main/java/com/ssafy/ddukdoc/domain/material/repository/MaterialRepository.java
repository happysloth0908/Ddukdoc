package com.ssafy.ddukdoc.domain.material.repository;

import com.ssafy.ddukdoc.domain.material.entity.DocumentEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<DocumentEvidence, Integer> {
}
