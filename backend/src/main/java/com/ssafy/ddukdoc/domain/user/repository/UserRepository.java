package com.ssafy.ddukdoc.domain.user.repository;


import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.entity.constants.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findBySocialProviderAndSocialKey(Provider provider, String providerId);

    // 삭제된 사용자를 포함하여 조회
    @Query("SELECT u FROM User u WHERE u.socialProvider = :socialProvider AND u.socialKey = :socialKey")
    Optional<User> findByProviderAndProviderIdIncludeDeleted(
            @Param("socialProvider") Provider provider,
            @Param("socialKey") String providerId);

}
