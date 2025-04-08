package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMTeamRequest {
    @Schema(example = "sd324ajflksdjf")
    @NotBlank(message = "userId는 필수입니다.")
    private String userId;
    @Schema(example = "123dajflk34sdjf")
    @NotBlank(message = "token은 필수입니다.")
    private String token;

    public static MMTeamRequest of(String userId, String token) {
        return MMTeamRequest.builder()
                .userId(userId)
                .token(token)
                .build();
    }
}
