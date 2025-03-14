package com.ssafy.ddukdoc.domain.auth.service.strategy;

import com.ssafy.ddukdoc.domain.auth.dto.OAuthUserInfo;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import com.ssafy.ddukdoc.global.infra.oauth.KakaoOAuthClient;
import com.ssafy.ddukdoc.global.infra.oauth.dto.KakaoTokenResponse;
import com.ssafy.ddukdoc.global.infra.oauth.dto.KakaoUserResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class KakaoOAuthStrategy implements OAuthStrategy {
    private final KakaoOAuthClient kakaoOAuthClient;

    @Override
    public OAuthUserInfo getUserInfo(String code) {
        try {
            KakaoTokenResponse tokenResponse = kakaoOAuthClient.getToken(code);

            KakaoUserResponse userResponse = kakaoOAuthClient.getUserInfo(tokenResponse.getAccessToken());

            return OAuthUserInfo.builder()
                    .id(userResponse.getId().toString())
                    .email(userResponse.getKakaoAccount().getEmail())
                    .nickname(userResponse.getKakaoAccount().getProfile().getNickname())
                    .build();
        } catch (IOException e) {
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
        }
    }
}
