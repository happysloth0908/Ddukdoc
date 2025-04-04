package com.ssafy.ddukdoc.domain.share.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMLoginResponse {
    @Schema(example = "sd324ajflksdjf")
    private String userId;
    @Schema(example = "123dajflk34sdjf")
    private String token;

    public static MMLoginResponse of(String userId, String token) {
        return MMLoginResponse.builder()
                .userId(userId)
                .token(token)
                .build();
    }
}
