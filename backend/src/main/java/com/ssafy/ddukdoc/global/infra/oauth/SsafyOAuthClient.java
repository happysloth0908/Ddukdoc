package com.ssafy.ddukdoc.global.infra.oauth;

import com.ssafy.ddukdoc.global.infra.oauth.constants.SsafyOAuthConstants;
import com.ssafy.ddukdoc.global.infra.oauth.dto.ssafy.SsafyTokenResponse;
import com.ssafy.ddukdoc.global.infra.oauth.dto.ssafy.SsafyUserResponse;
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
public class SsafyOAuthClient {
    private final WebClient webClient;

    @Value("${oauth.ssafy.client-id}")
    private String clientId;

    @Value("${oauth.ssafy.client-secret}")
    private String clientSecret;

    @Value("${oauth.ssafy.redirect-uri}")
    private String redirectUri;

    public SsafyTokenResponse getToken(String code) throws IOException {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(SsafyOAuthConstants.Parameters.GRANT_TYPE, SsafyOAuthConstants.GrantTypes.AUTHORIZATION_CODE);
        formData.add(SsafyOAuthConstants.Parameters.CLIENT_ID, clientId);
        formData.add(SsafyOAuthConstants.Parameters.CLIENT_SECRET, clientSecret);
        formData.add(SsafyOAuthConstants.Parameters.REDIRECT_URI, redirectUri);
        formData.add(SsafyOAuthConstants.Parameters.CODE, code);

        return webClient.post()
                .uri(SsafyOAuthConstants.Urls.TOKEN)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(SsafyTokenResponse.class)
                .block();
    }

    public SsafyUserResponse getUserInfo(String accessToken) {
        return webClient.get()
                .uri(SsafyOAuthConstants.Urls.USER_INFO)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(SsafyUserResponse.class)
                .block(); // 동기 방식으로 사용
    }
}
