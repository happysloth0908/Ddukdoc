package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMUserRequest {
    @Schema(example = "sd324ajflksdjf")
    @NotBlank(message = "token은 필수입니다.")
    private String token;
    @Schema(example = "심규빈")
    @NotBlank(message = "keyword는 필수입니다.")
    private String keyword;
}
