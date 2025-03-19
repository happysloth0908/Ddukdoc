package com.ssafy.ddukdoc.domain.auth.service;

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
    private final long REFRESH_TOKEN_EXPIRATION = 14 * 24 * 60 * 60L; // 14일

    // RefreshToken 저장
    public void saveRefreshToken(String userId, String refreshToken) {
        String key = getRefreshTokenKey(userId);
        redisTemplate.opsForValue().set(
                key,
                refreshToken,
                REFRESH_TOKEN_EXPIRATION,
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

    // RefreshToken 존재 여부 확인
    public boolean hasRefreshToken(String userId) {
        return redisTemplate.hasKey(getRefreshTokenKey(userId));
    }

    private String getRefreshTokenKey(String userId) {
        return "refresh_token:" + userId;
    }

    private String getRedisKey(Integer sushiId) {
        return "sushi:schedule:" + sushiId;
    }

    private Integer extractSushiId(String key) {
        return Integer.parseInt(key.split(":")[2]);
    }
}
