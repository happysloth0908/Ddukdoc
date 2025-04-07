package com.ssafy.ddukdoc.domain.share.controller;

import com.ssafy.ddukdoc.domain.share.dto.request.*;
import com.ssafy.ddukdoc.domain.share.dto.response.MMChannelResponse;
import com.ssafy.ddukdoc.domain.share.dto.response.MMLoginResponse;
import com.ssafy.ddukdoc.domain.share.dto.response.MMTeamResponse;
import com.ssafy.ddukdoc.domain.share.dto.response.MMUserResponse;
import com.ssafy.ddukdoc.domain.share.service.ShareService;
import com.ssafy.ddukdoc.global.aop.SSAFYAccess;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/share")
@Tag(name = "공유하기", description = "공유(MatterMost 등)관련 로그인, 팀 조회 등 각종 API")
public class ShareController {

    private final ShareService shareService;

    @PostMapping("/mm/login")
    @SSAFYAccess
    @Operation(summary = "MM 로그인", description = "id와 password를 통해 SSAFY MatterMost에 로그인합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE, ErrorCode.INTERNAL_SERVER_ERROR, ErrorCode.EXTERNAL_API_ERROR})
    public ResponseEntity<CommonResponse<MMLoginResponse>> mattermostLogin(
            @Valid @RequestBody MMLoginRequest loginRequest) {

        return CommonResponse.ok(shareService.mattermostLogin(loginRequest));
    }

    @PostMapping("/mm/team")
    @SSAFYAccess
    @Operation(summary = "MM 팀 목록 조회", description = "userId와 token을 통해 SSAFY MatterMost의 팀 목록을 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE, ErrorCode.INTERNAL_SERVER_ERROR, ErrorCode.EXTERNAL_API_ERROR})
    public ResponseEntity<CommonResponse<MMTeamResponse>> mattermostTeam(
            @Valid @RequestBody MMTeamRequest teamRequest) {

        return CommonResponse.ok(shareService.mattermostTeam(teamRequest));
    }


    @PostMapping("/mm/login-and-team")
    @SSAFYAccess
    @Operation(summary = "MM 로그인 및 팀 목록 조회", description = "id와 password를 통해 SSAFY MatterMost에 로그인하고, 팀 목록을 조회하여 반환합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE, ErrorCode.INTERNAL_SERVER_ERROR, ErrorCode.EXTERNAL_API_ERROR})
    public ResponseEntity<CommonResponse<MMTeamResponse>> mattermostLoginAndTeam(
            @Valid @RequestBody MMLoginRequest loginRequest) {

        MMLoginResponse mmLoginResponse = shareService.mattermostLogin(loginRequest);
        MMTeamRequest teamRequest = MMTeamRequest.of(mmLoginResponse.getUserId(), mmLoginResponse.getToken());

        return CommonResponse.ok(shareService.mattermostTeam(teamRequest));
    }

    @PostMapping("/mm/channel")
    @SSAFYAccess
    @Operation(summary = "MM 채널 목록 조회", description = "team_id를 통해 SSAFY MatterMost의 채널 목록을 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE, ErrorCode.INTERNAL_SERVER_ERROR, ErrorCode.EXTERNAL_API_ERROR})
    public ResponseEntity<CommonResponse<MMChannelResponse>> mattermostChannel(
            @Valid @RequestBody MMChannelRequest channelRequest) {

        return CommonResponse.ok(shareService.mattermostChannel(channelRequest));
    }

    @PostMapping("/mm/user")
    @SSAFYAccess
    @Operation(summary = "MM 사용자 목록 조회", description = "검색어를 통해 SSAFY MatterMost의 사용자 목록을 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE, ErrorCode.INTERNAL_SERVER_ERROR, ErrorCode.EXTERNAL_API_ERROR})
    public ResponseEntity<CommonResponse<MMUserResponse>> mattermostUser(
            @Valid @RequestBody MMUserRequest userRequest) {

        return CommonResponse.ok(shareService.mattermostUser(userRequest));
    }

    @PostMapping("/mm/message-channel")
    @SSAFYAccess
    @Operation(summary = "채널에 MM 메시지 전송", description = "SSAFY MatterMost 채널에 메시지를 전송합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE, ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.INTERNAL_SERVER_ERROR, ErrorCode.EXTERNAL_API_ERROR})
    public ResponseEntity<CommonResponse<Void>> mattermostMessageWithFileToChannel(
            @Valid @RequestBody MMMessageToChannelRequest messageRequest) {

        shareService.mattermostMessageToChannel(messageRequest);
        return CommonResponse.ok();
    }

    @PostMapping("/mm/message-user")
    @SSAFYAccess
    @Operation(summary = "사용자에게 MM 메시지 전송", description = "SSAFY MatterMost 사용자에 메시지를 전송합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE, ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.INTERNAL_SERVER_ERROR, ErrorCode.EXTERNAL_API_ERROR})
    public ResponseEntity<CommonResponse<Void>> mattermostMessageWithFileToUser(
            @Valid @RequestBody MMMessageToUserRequest messageRequest) {

        shareService.mattermostMessageToUser(messageRequest);
        return CommonResponse.ok();
    }
}
