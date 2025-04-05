package com.ssafy.ddukdoc.domain.contract.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BlockchainDocumentResponseDto {
    private String docUri;
    private String docHash;
    private String timestamp;
}
