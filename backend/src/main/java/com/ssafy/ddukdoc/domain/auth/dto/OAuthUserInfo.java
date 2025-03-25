package com.ssafy.ddukdoc.domain.auth.dto;

import com.ssafy.ddukdoc.global.infra.oauth.dto.kakao.KakaoUserResponse;
import com.ssafy.ddukdoc.global.infra.oauth.dto.ssafy.SsafyUserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class OAuthUserInfo {
    private String id;
    private String email;
    private String nickname;

    public static OAuthUserInfo of (KakaoUserResponse userResponse) {
        return OAuthUserInfo.builder()
                .id(userResponse.getId().toString())
                .email(userResponse.getKakaoAccount().getEmail())
                .nickname(userResponse.getKakaoAccount().getProfile().getNickname())
                .build();
    }

    public static OAuthUserInfo of (SsafyUserResponse userResponse) {
        return OAuthUserInfo.builder()
                .id(userResponse.getUserId())
                .email(userResponse.getEmail())
                .nickname(userResponse.getName())
                .build();
    }
}

