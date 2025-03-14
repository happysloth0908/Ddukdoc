package com.ssafy.ddukdoc.domain.auth.dto.response;

import com.ssafy.ddukdoc.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserInfoResponse {
    private String id;
    private String name;
    private String email;
    private String socialProvider;
    private Boolean isNew;
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
