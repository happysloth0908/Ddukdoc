package com.ssafy.ddukdoc.domain.contract.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BlockchainDeleteResponseDto {
    private String requestor;
    private String signature;
}
