package com.ssafy.ddukdoc.domain.contract.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class BlockchainSaveResult {
    byte[] pdfData;
    String transactionHash;
    String documentHash;
    String documentName;
    Map<String,Object> blockchainResponse;

}
