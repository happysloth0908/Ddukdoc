package com.ssafy.ddukdoc.domain.contract.repository;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SignatureRepository extends JpaRepository<Signature, Integer> {

    Optional<Signature> findByDocumentId(Integer documentId); // 문서 ID로 서명 조회
    List<Signature> findAllByDocumentId(Integer documentId);
}
