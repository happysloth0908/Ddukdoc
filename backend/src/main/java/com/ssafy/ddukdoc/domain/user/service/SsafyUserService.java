package com.ssafy.ddukdoc.domain.user.service;

import com.ssafy.ddukdoc.domain.user.dto.response.SsafyUserInfoResponse;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SsafyUserService {

    private final UserRepository userRepository;
    private final WebClient webClient;

    @Value("${ssafy.open-api.key}")
    private String ssafyApiKey;

    public SsafyUserInfoResponse getUserInfo(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID));

        String socialKey = user.getSocialKey();

        try {
            String uri = UriComponentsBuilder.fromUriString("https://project.ssafy.com/ssafy/open-api/v1/users/")
                    .path("/{socialKey}")
                    .queryParam("apiKey", ssafyApiKey)
                    .buildAndExpand(socialKey)
                    .toUriString();

            ResponseEntity<Map<String, Object>> response = webClient.get()
                    .uri(uri)
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {
                    })
                    .block();

            if (response == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "Ssafy 사용자 정보 요청 응답 없습니다.")
                        .addParameter("userId", userId);
            }

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "Ssafy 사용자 정보 요청 본문이 없습니다.")
                        .addParameter("userId", userId);
            }

            Object teamsObj = responseBody.get("teams");
            List<?> teamList = teamsObj instanceof List<?> ? (List<?>) teamsObj : null;

            String email = user.getEmail();
            String region = responseBody.get("entRegn").toString();
            String retireYn = responseBody.get("retireYn").toString();
            String category = "";
            String projectName = "";
            if (teamList != null && !teamList.isEmpty()) {
                int listLastIndex = teamList.size() - 1;
                Object teamInfo = teamList.get(listLastIndex);
                Map<?, ?> teamMap = teamInfo instanceof Map<?, ?> ? (Map<?, ?>) teamInfo : null;
                if (teamMap != null) {
                    category = teamMap.get("category").toString();
                    projectName = teamMap.get("projectName").toString();
                }
            }

            return SsafyUserInfoResponse.of(user.getName(), email, region, retireYn, category, projectName);
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "Ssafy 사용자 요청 정보가 올바르지 않습니다.")
                        .addParameter("userId", userId);
            }
            log.error("Ssafy 사용자 검색 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}