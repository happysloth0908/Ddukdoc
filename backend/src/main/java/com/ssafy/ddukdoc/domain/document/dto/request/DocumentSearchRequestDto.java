package com.ssafy.ddukdoc.domain.document.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
public class DocumentSearchRequestDto {

    @NotNull(message = "sendReceiveStatus는 필수입니다.")
    @Schema(example = "1")
    private Integer sendReceiveStatus;

    @Pattern(regexp = "^[A-Z]\\d$", message = "templateCode는 알파벳 대문자 한 글자와 숫자 한 자리 형식이어야 합니다.")
    @Schema(example = "G1")
    private String templateCode;

    @Size(max = 50, message = "keyword는 최대 50자까지 가능합니다.")
    @Schema(example = "검색어")
    private String keyword;

    @Schema(example = "WAITING")
    private String status;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(example = "2021-07-01T00:00:00")
    private LocalDateTime createdAt;
}
