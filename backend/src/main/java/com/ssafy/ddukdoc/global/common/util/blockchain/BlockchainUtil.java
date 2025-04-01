package com.ssafy.ddukdoc.global.common.util.blockchain;

import com.ssafy.ddukdoc.domain.contract.dto.request.BlockChainStoreRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class BlockchainUtil {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://sto.ssafy.io/v1/tokens/";
    @Value("${blockchain.contractAddress}")
    private String contractAddress;

    /**
     * 문서 저장 API 호출 (PUT)
     *
     * @param requestData 서명이 포함된 요청 데이터
     * @return API 응답 결과
     */
    public Map<String, Object> storeDocument(BlockChainStoreRequestDto requestData) {
        String url = baseUrl + contractAddress + "/documents";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<BlockChainStoreRequestDto> requestEntity = new HttpEntity<>(requestData, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                Map.class
        );

        return response.getBody();
    }
}
