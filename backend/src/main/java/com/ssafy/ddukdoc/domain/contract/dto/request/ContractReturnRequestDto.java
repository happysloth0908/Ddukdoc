package com.ssafy.ddukdoc.domain.contract.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ContractReturnRequestDto {
    private String returnReason;
}
