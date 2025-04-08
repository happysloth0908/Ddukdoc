package com.ssafy.ddukdoc.domain.share.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MMUserResponse {

    private List<MMUser> users;

    public static MMUserResponse of(List<MMUser> users) {
        return MMUserResponse.builder()
                .users(users)
                .build();
    }

    @Getter
    @Builder
    public static class MMUser {
        @Schema(example = "couzd7pcqfno8rjzx6n3yuc97a")
        private String id;
        @Schema(example = "skb0516")
        private String username;
        @Schema(example = "심규빈[대전_1반_B108]팀원")
        private String nickname;

        public static MMUser of (String id, String username, String nickname) {
            return MMUser.builder()
                    .id(id)
                    .username(username)
                    .nickname(nickname)
                    .build();
        }
    }
}
