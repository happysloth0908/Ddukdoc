package com.ssafy.ddukdoc.domain.contract.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class BlockchainDocumentResponseDto {
    private String docName;
    private String docUri;
    private String docHash;
    private String timestamp;

    @JsonCreator
    public static BlockchainDocumentResponseDto of(
            @JsonProperty("docName") String docName,
            @JsonProperty("docUri") String docUri,
            @JsonProperty("docHash") String docHash,
            @JsonProperty("timestamp") String timestamp
    ) {
        return BlockchainDocumentResponseDto.builder()
                .docName(docName)
                .docUri(docUri)
                .docHash(docHash)
                .timestamp(timestamp)
                .build();
    }

    public static BlockchainDocumentResponseDto of(
            String docName,
            String docUri,
            String docHash
    ) {
        return BlockchainDocumentResponseDto.builder()
                .docName(docName)
                .docUri(docUri)
                .docHash(docHash)
                .build();
    }
}