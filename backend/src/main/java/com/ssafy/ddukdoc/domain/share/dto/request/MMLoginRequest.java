package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMLoginRequest {
    @Schema(example = "gyubin@sim.com")
    private String id;
    @Schema(example = "passWord")
    private String password;
}
