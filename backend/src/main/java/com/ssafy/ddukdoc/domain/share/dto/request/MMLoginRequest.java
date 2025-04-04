package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMLoginRequest {
    @Schema(example = "gyubin@sim.com")
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "이메일 형식이 아닙니다.")
    private String id;
    @Schema(example = "passWord")
    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;
}
