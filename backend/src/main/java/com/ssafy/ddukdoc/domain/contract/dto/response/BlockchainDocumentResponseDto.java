package com.ssafy.ddukdoc.domain.contract.dto.response;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class BlockchainDocumentResponseDto {
    private String docUri;
    private String docHash;
    private String timestamp;
}
