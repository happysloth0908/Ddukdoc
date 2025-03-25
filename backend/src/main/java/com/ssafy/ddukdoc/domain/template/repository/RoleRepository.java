package com.ssafy.ddukdoc.domain.template.repository;

import com.ssafy.ddukdoc.domain.template.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role,Integer> {
}
