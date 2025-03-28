package com.ssafy.ddukdoc.domain.contract.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ContractReturnRequestDto {
    @NotBlank(message = "returnReason은 필수값입니다.")
    @Schema(example = "서명이 누락되었습니다.")
    private String returnReason;
}
