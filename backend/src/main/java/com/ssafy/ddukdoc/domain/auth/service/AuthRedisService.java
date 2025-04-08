package com.ssafy.ddukdoc.domain.auth.service;

import com.ssafy.ddukdoc.global.common.constants.SecurityConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthRedisService {
    private final StringRedisTemplate redisTemplate;

    // RefreshToken 저장
    public void saveRefreshToken(String userId, String refreshToken) {
        String key = getRefreshTokenKey(userId);
        redisTemplate.opsForValue().set(
                key,
                refreshToken,
                SecurityConstants.REFRESH_TOKEN_VALIDITY_SECONDS,
                TimeUnit.SECONDS
        );
    }

    // RefreshToken 조회
    public String getRefreshToken(String userId) {
        return redisTemplate.opsForValue().get(getRefreshTokenKey(userId));
    }

    // RefreshToken 삭제
    public void deleteRefreshToken(String userId) {
        redisTemplate.delete(getRefreshTokenKey(userId));
    }

    private String getRefreshTokenKey(String userId) {
        return "refresh_token:" + userId;
    }

}
