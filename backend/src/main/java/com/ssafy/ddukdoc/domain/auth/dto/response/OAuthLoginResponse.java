package com.ssafy.ddukdoc.domain.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OAuthLoginResponse {
    private UserInfoResponse user;

    public static OAuthLoginResponse of(UserInfoResponse userInfoResponse) {
        return OAuthLoginResponse.builder()
                .user(userInfoResponse)
                .build();
    }
}

