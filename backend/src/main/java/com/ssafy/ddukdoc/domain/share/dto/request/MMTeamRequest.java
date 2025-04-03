package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMTeamRequest {
    @Schema(example = "sd324ajflksdjf")
    private String userId;
    @Schema(example = "123dajflk34sdjf")
    private String token;

    public static MMTeamRequest of(String userId, String token) {
        return MMTeamRequest.builder()
                .userId(userId)
                .token(token)
                .build();
    }
}
