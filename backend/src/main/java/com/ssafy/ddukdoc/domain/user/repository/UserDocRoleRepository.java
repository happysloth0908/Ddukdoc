package com.ssafy.ddukdoc.domain.user.repository;

import com.ssafy.ddukdoc.domain.user.entity.UserDocRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDocRoleRepository extends JpaRepository<UserDocRole,Integer> {
}
