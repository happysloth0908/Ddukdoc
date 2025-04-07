package com.ssafy.ddukdoc.global.common.util.blockchain;

import com.ssafy.ddukdoc.domain.contract.dto.BlockchainSaveResult;
import com.ssafy.ddukdoc.domain.contract.dto.request.BlockChainStoreRequestDto;
import com.ssafy.ddukdoc.domain.contract.dto.response.BlockchainDocumentResponseDto;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.global.common.util.HashUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;


@Slf4j
@Component
@RequiredArgsConstructor
public class BlockchainUtil {
    private final RestTemplate blockchainRestTemplate;
    //private final RestTemplate restTemplate = new RestTemplate();
    @Value("${blockchain.baseurl}")
    private String baseUrl;
    @Value("${blockchain.contractAddress}")
    private String contractAddress;

    @Value("${blockchain.address}")
    private String requestor;

    @Value("${blockchain.private-key}")
    private String privateKey;
    private final SignatureUtil signatureUtil;
    private final HashUtil hashUtil;

    /**
     * 문서 저장 API 호출 (PUT)
     *
     * @param requestData 서명이 포함된 요청 데이터
     * @return API 응답 결과
     */
    public Map<String, Object> storeDocument(BlockChainStoreRequestDto requestData) {
        String url = baseUrl + contractAddress + "/documents";

        log.debug("블록체인 API 호출 URL: {}", url);
        log.debug("요청 데이터: {}", requestData);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<BlockChainStoreRequestDto> requestEntity = new HttpEntity<>(requestData, headers);
        ResponseEntity<Map> response = blockchainRestTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                Map.class
        );
        return response.getBody();
    }

    public BlockchainDocumentResponseDto getDocumentByName(String documentName) {
        String url = baseUrl + contractAddress + "/documents/" + documentName;

        log.debug("문서 조회 URL: {}", url);

        try {
            ResponseEntity<Map> response = blockchainRestTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    Map.class
            );

            Map<String, Object> body = response.getBody();

            return BlockchainDocumentResponseDto.of(
                    documentName,
                    body.get("docUri") != null ? body.get("docUri").toString() : "",
                    body.get("docHash") != null ? body.get("docHash").toString() : "",
                    body.get("timestamp") != null ? body.get("timestamp").toString() : "0"
            );

        } catch (Exception e) {
            // 에러 처리 로직
            throw new CustomException(ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR, "reason", e.getCause());
        }
    }

    public List<BlockchainDocumentResponseDto> getAllDocuments() {
        String url = baseUrl + contractAddress + "/documents";

        try {
            ResponseEntity<List<Map<String, Object>>> response = blockchainRestTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    }
            );

            log.debug("전체 문서 응답: {}", response.getBody());

            return response.getBody().stream()
                    .map(doc -> {
                        log.debug("개별 문서 데이터: {}", doc);

                        // 로깅을 추가하여 키 값 확인
                        log.debug("Doc keys: {}", doc.keySet());
                        log.debug("Doc '0' value: {}", doc.get("0"));
                        log.debug("Doc 'name' value: {}", doc.get("name"));

                        // 키 조회 순서 변경
                        String name = findStringValue(doc, new String[]{"0", "name"});
                        String uri = findStringValue(doc, new String[]{"1", "uri", "docUri"});
                        String hash = findStringValue(doc, new String[]{"2", "hash", "docHash"});

                        return BlockchainDocumentResponseDto.of(
                                name != null ? name : "UNKNOWN",
                                uri != null ? uri : "",
                                hash != null ? hash : ""
                        );
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("문서 조회 중 오류 발생", e);
            throw new CustomException(
                    ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR,
                    "문서 조회 중 오류 발생: " + e.getMessage(),
                    e
            );
        }
    }

    // 다양한 키로 값을 찾는 헬퍼 메서드 추가
    private String findStringValue(Map<String, Object> map, String[] keys) {
        for (String key : keys) {
            Object value = map.get(key);
            if (value != null) {
                return value.toString();
            }
        }
        return null;
    }

    public void saveDocumentInBlockchain(byte[] pdfData, TemplateCode templateCode,String docName) {
        try {
            String hash = hashUtil.generateSHA256Hash(pdfData);
            String docHashWithPrefix = "0x" + hash; // 0x 접두사 추가

            // 서명 생성
            String signature = signatureUtil.createSignature(requestor, docName, "", docHashWithPrefix, privateKey);

            // 블록체인 객체 생성
            BlockChainStoreRequestDto storeData = new BlockChainStoreRequestDto(requestor, docName, "", docHashWithPrefix, signature);

            // 블록체인 API 호출
            Map<String, Object> blockchainResponse = storeDocument(storeData);
            // 블록체인 트랜잭션 ID 추출
            String transactionHash = (String) blockchainResponse.get("transactionHash");

        } catch (Exception e) {
            throw new CustomException(ErrorCode.BLOCKCHAIN_SIGNATURE_ERROR, "reason", e.getMessage());
        }

    }

    // 문서 삭제 메서드도 유사하게 수정
    public boolean deleteDocument(String documentName) {
        String url = baseUrl + contractAddress + "/documents/" + documentName;

        try {
            // 삭제를 위한 서명 생성
            String signature = signatureUtil.createSignatureForDelete(requestor, documentName, privateKey);

            // 삭제 요청 DTO 생성
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("requestor", requestor);
            requestBody.put("signature", signature);

            // HTTP 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 요청 엔티티 생성
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

            // DELETE 요청 전송
            ResponseEntity<Map> response = blockchainRestTemplate.exchange(
                    url,
                    HttpMethod.DELETE,
                    requestEntity,
                    Map.class
            );

            // 응답 처리
            log.info("문서 삭제 성공: {}", documentName);
            return true;
        } catch (Exception e) {
            log.error("문서 삭제 중 오류 발생: {}", documentName, e);
            throw new CustomException(
                    ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR,
                    "문서 삭제 중 오류 발생",
                    e
            );
        }
    }


}
