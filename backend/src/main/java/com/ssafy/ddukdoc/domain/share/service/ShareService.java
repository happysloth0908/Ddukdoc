package com.ssafy.ddukdoc.domain.share.service;

import com.ssafy.ddukdoc.domain.share.constants.MMConstants;
import com.ssafy.ddukdoc.domain.share.dto.request.MMChannelRequest;
import com.ssafy.ddukdoc.domain.share.dto.request.MMLoginRequest;
import com.ssafy.ddukdoc.domain.share.dto.request.MMTeamRequest;
import com.ssafy.ddukdoc.domain.share.dto.response.MMChannelResponse;
import com.ssafy.ddukdoc.domain.share.dto.response.MMLoginResponse;
import com.ssafy.ddukdoc.domain.share.dto.response.MMTeamResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
public class ShareService {

    private final WebClient webClient;

    public MMLoginResponse mattermostLogin(MMLoginRequest loginRequest) {
        try {
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("login_id", loginRequest.getId());
            requestBody.put("password", loginRequest.getPassword());

            ResponseEntity<Map<String, Object>> response = webClient.post()
                    .uri(MMConstants.MATTERMOST_API_URL + MMConstants.MM_LOGIN_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {
                    })
                    .block();

            if (response == null || response.getBody() == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답이 없습니다.");
            }

            // 응답 헤더에서 토큰 추출
            String token = response.getHeaders().getFirst("Token");
            if (token == null) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 로그인 토큰을 받아올 수 없습니다.");
            }

            // 응답 본문에서 사용자 ID 추출
            String userId = (String) response.getBody().get("id");
            if (userId == null) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 사용자 ID를 받아올 수 없습니다.");
            }

            return MMLoginResponse.of(userId, token);

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 로그인 정보가 올바르지 않습니다.");
            }
            log.error("MatterMost 로그인 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }
    }

    public MMTeamResponse mattermostTeam(MMTeamRequest teamRequest) {
        try {
            ResponseEntity<List<Map<String, Object>>> response = webClient.get()
                    .uri(MMConstants.MATTERMOST_API_URL + "/users/" + teamRequest.getUserId() + "/teams")
                    .header("Authorization", "Token " + teamRequest.getToken())
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();

            if (response == null || response.getBody() == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답이 없습니다.");
            }

            List<Map<String, Object>> teamsList = response.getBody();
            List<MMTeamResponse.MMTeam> teams = new ArrayList<>();

            for (Map<String, Object> team : teamsList) {
                String teamId = (String) team.get("id");
                String displayName = (String) team.get("display_name");
                teams.add(MMTeamResponse.MMTeam.of(teamId, displayName));
            }

            return MMTeamResponse.of(teamRequest.getUserId(), teamRequest.getToken() ,teams);

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 로그인 정보가 올바르지 않습니다.");
            }
            log.error("MatterMost 로그인 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }
    }

    public MMChannelResponse mattermostChannel(MMChannelRequest channelRequest) {
        try {
            ResponseEntity<List<Map<String, Object>>> response = webClient.get()
                    .uri(MMConstants.MATTERMOST_API_URL + "/users/" + channelRequest.getUserId() +
                            "/teams/" + channelRequest.getTeamId() + "/channels")
                    .header("Authorization", "Token " + channelRequest.getToken())
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();

            if (response == null || response.getBody() == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답이 없습니다.");
            }

            List<Map<String, Object>> channelsList = response.getBody();
            List<MMChannelResponse.MMChannel> channels = new ArrayList<>();

            // type이 P 또는 O인 채널만 필터링
            for (Map<String, Object> channel : channelsList) {
                String type = (String) channel.get("type");
                if ("P".equals(type) || "O".equals(type)) {
                    String id = (String) channel.get("id");
                    String displayName = (String) channel.get("display_name");

                    channels.add(MMChannelResponse.MMChannel.builder()
                            .id(id)
                            .type(type)
                            .displayName(displayName)
                            .build());
                }
            }

            return MMChannelResponse.builder()
                    .userId(channelRequest.getUserId())
                    .token(channelRequest.getToken())
                    .teamId(channelRequest.getTeamId())
                    .channels(channels)
                    .build();

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 인증 정보가 올바르지 않습니다.");
            }
            log.error("MatterMost 채널 조회 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }
    }
}
