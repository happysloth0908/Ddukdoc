package com.ssafy.ddukdoc.domain.contract.repository;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SignatureRepository extends JpaRepository<Signature, Integer> {
    // 문서 ID로 서명 조회
    Optional<Signature> findByDocumentId(Integer documentId);
}
