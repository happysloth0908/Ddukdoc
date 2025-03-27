package com.ssafy.ddukdoc.domain.auth.service.strategy;

import com.ssafy.ddukdoc.domain.auth.dto.OAuthUserInfo;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import com.ssafy.ddukdoc.global.infra.oauth.SsafyOAuthClient;
import com.ssafy.ddukdoc.global.infra.oauth.dto.ssafy.SsafyTokenResponse;
import com.ssafy.ddukdoc.global.infra.oauth.dto.ssafy.SsafyUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class SsafyOAuthStrategy implements OAuthStrategy {
    private final SsafyOAuthClient ssafyOAuthClient;

    @Override
    public OAuthUserInfo getUserInfo(String code) {
        try {
            SsafyTokenResponse tokenResponse = ssafyOAuthClient.getToken(code);

            SsafyUserResponse userResponse = ssafyOAuthClient.getUserInfo(tokenResponse.getAccessToken());

            return OAuthUserInfo.of(userResponse);

        } catch (IOException e) {
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR, "provider", "ssafy")
                    .addParameter("code", code)
                    .addParameter("message", e.getMessage());
        }
    }
}
