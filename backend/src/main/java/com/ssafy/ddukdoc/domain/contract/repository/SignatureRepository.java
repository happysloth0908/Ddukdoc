package com.ssafy.ddukdoc.domain.contract.repository;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SignatureRepository extends JpaRepository<Signature,Integer> {

}
