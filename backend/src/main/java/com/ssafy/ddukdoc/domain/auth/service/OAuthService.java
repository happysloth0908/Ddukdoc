package com.ssafy.ddukdoc.domain.auth.service;

import com.ssafy.ddukdoc.domain.auth.dto.LoginResult;
import com.ssafy.ddukdoc.domain.auth.dto.OAuthUserInfo;
import com.ssafy.ddukdoc.domain.auth.dto.response.OAuthLoginResponse;
import com.ssafy.ddukdoc.domain.auth.dto.response.UserInfoResponse;
import com.ssafy.ddukdoc.domain.auth.service.strategy.OAuthStrategy;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.entity.constants.Provider;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import com.ssafy.ddukdoc.global.security.jwt.JwtTokenProvider;
import com.ssafy.ddukdoc.global.security.jwt.TokenValidationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OAuthService {
    private final Map<Provider, OAuthStrategy> oAuthStrategyMap;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthRedisService authRedisService;

    public LoginResult handleOAuthLogin(Provider provider, String code) {

        // 1. 전략 가져오기
        OAuthStrategy strategy = oAuthStrategyMap.get(provider);
        if (strategy == null) {
            throw new CustomException(ErrorCode.INVALID_OAUTH_PROVIDER);
        }

        try {
            // 2. 소셜 로그인으로 유저 정보 받아오기
            OAuthUserInfo userInfoFromOAuth = strategy.getUserInfo(code);
            log.debug("Received user info from provider - id: {}, email: {}",
                    userInfoFromOAuth.getId(), userInfoFromOAuth.getEmail());

            // 3. 기존 회원인지 확인
            Optional<User> existingUser = userRepository.findBySocialProviderAndSocialKey(
                    provider,
                    userInfoFromOAuth.getId()
            );

            Boolean isNew = existingUser.isEmpty();
            User user = existingUser.orElseGet(() -> createUser(userInfoFromOAuth, provider));
            String userId = user.getId().toString();

            String accessToken = jwtTokenProvider.createAccessToken(userId);
            String refreshToken = jwtTokenProvider.createRefreshToken(userId);

            // Redis에 RefreshToken 저장
            authRedisService.saveRefreshToken(userId, refreshToken);

            UserInfoResponse userInfoResponse = UserInfoResponse.of(user, isNew);
            OAuthLoginResponse oAuthLoginResponse = OAuthLoginResponse.of(userInfoResponse);

            return LoginResult.of(oAuthLoginResponse, accessToken, refreshToken);

        } catch (Exception e) {
            log.error("Failed to process OAuth login for provider: {} message: {}", provider, e.getMessage());
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
        }
    }

    private User createUser(OAuthUserInfo userInfo, Provider provider) {
        User newUser = User.builder()
                .name(userInfo.getNickname())
                .socialProvider(provider)
                .socialKey(userInfo.getId())
                .build();

        return userRepository.save(newUser);
    }

    public String refreshToken(String refreshToken) {
        // 1. Refresh 토큰 유효성 검증
        TokenValidationResult validationResult = jwtTokenProvider.validateToken(refreshToken);
        if (!validationResult.isValid()) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 2. Redis에 저장된 Refresh 토큰과 비교
        String userId = jwtTokenProvider.getUserId(refreshToken).toString();
        String savedRefreshToken = authRedisService.getRefreshToken(userId);

        if (savedRefreshToken == null || !savedRefreshToken.equals(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 3. 새로운 Access 토큰 발급

        return jwtTokenProvider.createAccessToken(userId);
    }
}

