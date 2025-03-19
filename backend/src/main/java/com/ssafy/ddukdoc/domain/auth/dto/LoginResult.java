package com.ssafy.ddukdoc.domain.auth.dto;

import com.ssafy.ddukdoc.domain.auth.dto.response.OAuthLoginResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResult {
    private OAuthLoginResponse response;
    private String accessToken;
    private String refreshToken;

    public static LoginResult of(OAuthLoginResponse response, String accessToken, String refreshToken) {
        return LoginResult.builder()
                .response(response)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}

