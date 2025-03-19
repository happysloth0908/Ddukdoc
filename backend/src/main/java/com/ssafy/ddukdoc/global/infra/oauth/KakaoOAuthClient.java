package com.ssafy.ddukdoc.global.infra.oauth;

import com.ssafy.ddukdoc.global.infra.oauth.constants.KakaoOAuthConstants;
import com.ssafy.ddukdoc.global.infra.oauth.dto.KakaoTokenResponse;
import com.ssafy.ddukdoc.global.infra.oauth.dto.KakaoUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class KakaoOAuthClient {
    private final WebClient webClient;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.redirect-uri}")
    private String redirectUri;

    public KakaoTokenResponse getToken(String code) throws IOException {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(KakaoOAuthConstants.Parameters.GRANT_TYPE, KakaoOAuthConstants.GrantTypes.AUTHORIZATION_CODE);
        formData.add(KakaoOAuthConstants.Parameters.CLIENT_ID, clientId);
        formData.add(KakaoOAuthConstants.Parameters.REDIRECT_URI, redirectUri);
        formData.add(KakaoOAuthConstants.Parameters.CODE, code);

        return webClient.post()
                .uri(KakaoOAuthConstants.Urls.TOKEN)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(KakaoTokenResponse.class)
                .block();
    }

    public KakaoUserResponse getUserInfo(String accessToken) {
        return webClient.get()
                .uri(KakaoOAuthConstants.Urls.USER_INFO)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(KakaoUserResponse.class)
                .block(); // 동기 방식으로 사용
    }
}

