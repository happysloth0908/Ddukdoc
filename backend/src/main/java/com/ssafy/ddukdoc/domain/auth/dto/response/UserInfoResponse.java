package com.ssafy.ddukdoc.domain.auth.dto.response;

import com.ssafy.ddukdoc.domain.user.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserInfoResponse {
    @Schema(example = "1")
    private String id;
    @Schema(example = "홍길동")
    private String name;
    @Schema(example = "user@example.com")
    private String email;
    @Schema(example = "KAKAO")
    private String socialProvider;
    @Schema(example = "false")
    private Boolean isNew;
    @Schema(example = "GENERAL")
    private String userType;

    public static UserInfoResponse of(User user, Boolean isNew) {
        return UserInfoResponse.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .socialProvider(user.getSocialProvider().getName())
                .isNew(isNew)
                .userType(user.getUserType().getName())
                .build();
    }
}
