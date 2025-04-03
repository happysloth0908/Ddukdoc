package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMUserRequest {
    @Schema(example = "sd324ajflksdjf")
    private String token;
    @Schema(example = "심규빈")
    private String keyword;
}
