package com.ssafy.ddukdoc.domain.share.service;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.domain.share.constants.MMConstants;
import com.ssafy.ddukdoc.domain.share.dto.request.*;
import com.ssafy.ddukdoc.domain.share.dto.response.MMChannelResponse;
import com.ssafy.ddukdoc.domain.share.dto.response.MMLoginResponse;
import com.ssafy.ddukdoc.domain.share.dto.response.MMTeamResponse;
import com.ssafy.ddukdoc.domain.share.dto.response.MMUserResponse;
import com.ssafy.ddukdoc.global.common.util.S3Util;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;


@Slf4j
@Service
@RequiredArgsConstructor
public class ShareService {

    private final DocumentRepository documentRepository;
    private final WebClient webClient;
    private final S3Util s3Util;

    public MMLoginResponse mattermostLogin(MMLoginRequest loginRequest) {
        try {
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("login_id", loginRequest.getId());
            requestBody.put("password", loginRequest.getPassword());

            String uri = UriComponentsBuilder.fromUriString(MMConstants.API_URL)
                    .path(MMConstants.LOGIN_URL)
                    .build()
                    .toUriString();

            ResponseEntity<Map<String, Object>> response = webClient.post()
                    .uri(uri)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {
                    })
                    .block();

            if (response == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답이 없습니다.");
            }

            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답 본문이 없습니다.");
            }

            // 응답 헤더에서 토큰 추출
            String token = response.getHeaders().getFirst("Token");
            if (token == null) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 로그인 토큰을 받아올 수 없습니다.");
            }

            // 응답 본문에서 사용자 ID 추출
            String userId = (String) responseBody.get("id");
            if (userId == null) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 사용자 ID를 받아올 수 없습니다.");
            }

            return MMLoginResponse.of(userId, token);

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 로그인 정보가 올바르지 않습니다.");
            }
            log.error("MatterMost 로그인 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public MMTeamResponse mattermostTeam(MMTeamRequest teamRequest) {
        try {
            String uri = UriComponentsBuilder.fromUriString(MMConstants.API_URL)
                    .path("/users")
                    .path("/{userId}")
                    .path("/teams")
                    .buildAndExpand(teamRequest.getUserId())
                    .toUriString();

            ResponseEntity<List<Map<String, Object>>> response = webClient.get()
                    .uri(uri)
                    .header(MMConstants.AUTH, MMConstants.TOKEN + teamRequest.getToken())
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    })
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

            return MMTeamResponse.of(teamRequest.getUserId(), teamRequest.getToken(), teams);

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 로그인 정보가 올바르지 않습니다.");
            }
            log.error("MatterMost 로그인 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public MMChannelResponse mattermostChannel(MMChannelRequest channelRequest) {
        try {

            String uri = UriComponentsBuilder.fromUriString(MMConstants.API_URL)
                    .path("/users")
                    .path("/{userId}")
                    .path("/teams")
                    .path("/{teamId}")
                    .path("/channels")
                    .buildAndExpand(channelRequest.getUserId(), channelRequest.getTeamId())
                    .toUriString();

            ResponseEntity<List<Map<String, Object>>> response = webClient.get()
                    .uri(uri)
                    .header(MMConstants.AUTH, MMConstants.TOKEN + channelRequest.getToken())
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    })
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

                    channels.add(MMChannelResponse.MMChannel.of(id, type, displayName));
                }
            }

            return MMChannelResponse.of(channelRequest, channels);

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 인증 정보가 올바르지 않습니다.");
            }
            log.error("MatterMost 채널 조회 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public void mattermostMessageToChannel(MMMessageToChannelRequest messageRequest) {
        try {
            // 1. 문서 찾기
            Document docById = documentRepository.findById(messageRequest.getDocumentId())
                    .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND));

            // 2. S3에서 파일 다운로드
            byte[] pdfBytes = s3Util.downloadAndDecryptFileToBytes(docById.getFilePath());

            // 3. MM에 파일 업로드
            // MultipartBodyBuilder를 사용하여 파일 업로드
            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
            bodyBuilder.part("files", new ByteArrayResource(pdfBytes) {
                @Override
                public String getFilename() {
                    // 파일 이름에 .pdf 확장자가 없으면 추가
                    String fileName = docById.getTitle();
                    if (!fileName.toLowerCase().endsWith(".pdf")) {
                        fileName = fileName + ".pdf";
                    }
                    return fileName;
                }
            });

            String uri = UriComponentsBuilder.fromUriString(MMConstants.API_URL)
                    .path("/files")
                    .queryParam("channel_id", messageRequest.getChannelId())
                    .build()
                    .toUriString();

            ResponseEntity<Map<String, Object>> fileUploadResponse = webClient.post()
                    .uri(uri)
                    .header(MMConstants.AUTH, MMConstants.TOKEN + messageRequest.getToken())
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {
                    })
                    .block();

            if (fileUploadResponse == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 파일 업로드 응답이 없습니다.");
            }

            Map<String, Object> responseBody = fileUploadResponse.getBody();
            if (responseBody == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 파일 업로드 응답 본문이 없습니다.");
            }

            // 업로드된 파일의 ID 추출
            Object fileInfosObj = responseBody.get("file_infos");
            List<?> fileInfosList = fileInfosObj instanceof List<?> ? (List<?>) fileInfosObj : null;

            if (fileInfosList == null || fileInfosList.isEmpty()) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 파일 업로드에 실패했습니다.");
            }

            // 첫 번째 파일 정보에서 ID 추출
            Object fileInfo = fileInfosList.get(0);
            if (!(fileInfo instanceof Map)) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "파일 정보 형식이 올바르지 않습니다.");
            }

            String fileId = (String) ((Map<?, ?>) fileInfo).get("id");
            if (fileId == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "파일 ID를 찾을 수 없습니다.");
            }

            // 4. MM에 메시지 보내기
            Map<String, Object> messageBody = new HashMap<>();
            messageBody.put("channel_id", messageRequest.getChannelId());
            messageBody.put("message", messageRequest.getMessage());

            List<String> fileIds = new ArrayList<>();
            fileIds.add(fileId);
            messageBody.put("file_ids", fileIds);

            ResponseEntity<Map<String, Object>> messageResponse = webClient.post()
                    .uri(MMConstants.API_URL + "/posts")
                    .header(MMConstants.AUTH, MMConstants.TOKEN + messageRequest.getToken())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(messageBody)
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {
                    })
                    .block();

            if (messageResponse == null || messageResponse.getBody() == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 메시지 전송 응답이 없습니다.");
            }

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 인증 정보가 올바르지 않습니다.");
            }
            log.error("MatterMost 메시지 전송 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public MMUserResponse mattermostUser(MMUserRequest userRequest) {
        try {
            String uri = UriComponentsBuilder.fromUriString(MMConstants.API_URL)
                    .path(MMConstants.SEARCH_USER_URL)
                    .queryParam("name", userRequest.getKeyword())
                    .build()
                    .toUriString();

            ResponseEntity<Map<String, Object>> response = webClient.get()
                    .uri(uri)
                    .header(MMConstants.AUTH, MMConstants.TOKEN + userRequest.getToken())
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {
                    })
                    .block();

            if (response == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답이 없습니다.");
            }

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답 본문이 없습니다.");
            }

            Object usersObj = responseBody.get("users");
            List<?> usersList = usersObj instanceof List<?> ? (List<?>) usersObj : null;

            if (usersList == null) {
                return MMUserResponse.of(new ArrayList<>());
            }

            List<MMUserResponse.MMUser> users = new ArrayList<>();

            // users 목록 안전하게 추출
            for (Object userObj : usersList) {
                if (userObj instanceof Map<?, ?> user) {

                    // 필요한 필드 추출 (null 체크 추가)
                    String id = user.get("id") instanceof String ? (String) user.get("id") : "";
                    String username = user.get("username") instanceof String ? (String) user.get("username") : "";
                    String nickname = user.get("nickname") instanceof String ? (String) user.get("nickname") : "";

                    users.add(MMUserResponse.MMUser.of(id, username, nickname));
                }
            }

            return MMUserResponse.of(users);

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost 인증 정보가 올바르지 않습니다.");
            }
            log.error("MatterMost 사용자 검색 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public void mattermostMessageToUser(MMMessageToUserRequest messageRequest) {
        String uri = UriComponentsBuilder.fromUriString(MMConstants.API_URL)
                .path(MMConstants.CREATE_DIRECT_URL)
                .build()
                .toUriString();

        String userToken = messageRequest.getToken();

        String[] requestBody = new String[]{messageRequest.getUserId(), messageRequest.getReceiverId()};

        ResponseEntity<Map<String, Object>> response = webClient.post()
                .uri(uri)
                .header(MMConstants.AUTH, MMConstants.TOKEN + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {
                })
                .block();

        if (response == null) {
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답이 없습니다.");
        }

        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null) {
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "msg", "MatterMost 서버 응답 본문이 없습니다.");
        }

        String channelId = (String) responseBody.get("id");

        if (channelId == null) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "msg", "MatterMost DM 채널 ID를 받아올 수 없습니다.");
        }

        mattermostMessageToChannel(MMMessageToChannelRequest.of(channelId, messageRequest));
    }
}
