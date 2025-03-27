package com.ssafy.ddukdoc.domain.contract.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ContractReturnRequestDto {
    @NotBlank(message = "returnReason은 필수값입니다.")
    private String returnReason;
}
