package com.ssafy.ddukdoc.domain.contract.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BlockchainDeleteResponseDto {
    private String requestor;
    private String signature;
}
