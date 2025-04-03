package com.ssafy.ddukdoc.domain.share.dto.response;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MMTeamResponse {

    @Schema(example = "ismhz6qc5bbfmrtdqwnacudx5o")
    private String userId;
    @Schema(example = "m8prdnfy67yz5ex57pw.....")
    private String token;
    private List<MMTeam> teams;

    public static MMTeamResponse of(String userId, String token, List<MMTeam> teams) {
        return MMTeamResponse.builder()
                .userId(userId)
                .token(token)
                .teams(teams)
                .build();
    }

    @Getter
    @Builder
    public static class MMTeam {
        @Schema(example = "7rky4c6zntbp5kxtjn4aeeo6ne")
        private String id;
        @Schema(example = "12기 공통 대전1반")
        private String displayName;

        public static MMTeam of(String id, String display_name) {
            return MMTeam.builder()
                    .id(id)
                    .displayName(display_name)
                    .build();
        }
    }
}
