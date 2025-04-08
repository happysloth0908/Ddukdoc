package com.ssafy.ddukdoc.global.common.util.blockchain;

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


@Slf4j
@Component
@RequiredArgsConstructor
public class BlockchainUtil {

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
    private final RestTemplate blockchainRestTemplate;

    public static final String DOC_URI = "docUri";
    public static final String DOC_HASH = "docHash";

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
        ResponseEntity<Map<String, Object>> response = blockchainRestTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {
                }
        );
        Map<String, Object> body = response.getBody();

        if (body == null) {
            throw new CustomException(ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR, "문서 저장 응답 본문이 비어있습니다");
        }
        return body;
    }

    public BlockchainDocumentResponseDto getDocumentByName(String documentName) {
        String url = baseUrl + contractAddress + "/documents/" + documentName;

        log.debug("문서 조회 URL: {}", url);

        try {
            ResponseEntity<Map<String, Object>> response = blockchainRestTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    }
            );

            Map<String, Object> body = response.getBody();

            if (body == null) {
                throw new CustomException(ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR, "문서 응답 본문이 비어있습니다");
            }

            return BlockchainDocumentResponseDto.of(
                    documentName,
                    body.get(DOC_URI) != null ? body.get(DOC_URI).toString() : "",
                    body.get(DOC_HASH) != null ? body.get(DOC_HASH).toString() : "",
                    body.get("timestamp") != null ? body.get("timestamp").toString() : "0"
            );

        } catch (Exception e) {
            // 에러 처리 로직
            throw new CustomException(ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR, e.getMessage());
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

            List<Map<String, Object>> responseBody = response.getBody();

            if (responseBody == null) {
                throw new CustomException(ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR, "문서 응답 본문이 비어있습니다");
            }

            log.debug("전체 문서 응답: {}", responseBody);

            return responseBody.stream()
                    .map(doc -> {
                        log.debug("개별 문서 데이터: {}", doc);

                        // 로깅을 추가하여 키 값 확인
                        log.debug("Doc keys: {}", doc.keySet());
                        log.debug("Doc '0' value: {}", doc.get("0"));
                        log.debug("Doc 'name' value: {}", doc.get("name"));

                        // 키 조회 순서 변경
                        String name = findStringValue(doc, new String[]{"0", "name"});
                        String uri = findStringValue(doc, new String[]{"1", "uri", DOC_URI});
                        String hash = findStringValue(doc, new String[]{"2", "hash", DOC_HASH});

                        return BlockchainDocumentResponseDto.of(
                                name != null ? name : "UNKNOWN",
                                uri != null ? uri : "",
                                hash != null ? hash : ""
                        );
                    })
                    .toList();
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

    public void saveDocumentInBlockchain(byte[] pdfData, TemplateCode templateCode, String docName) {
        try {
            if (pdfData == null || pdfData.length == 0) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "pdfData", "빈 데이터");
            }

            if (docName == null || docName.isEmpty()) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "docName", "문서명 누락");
            }
            log.debug("saveDocumentInBlockchain 시작 - 데이터: {}, 템플릿: {}, 문서명: {}", pdfData.length, templateCode, docName);
            String hash = hashUtil.generateSHA256Hash(pdfData);
            String docHashWithPrefix = "0x" + hash; // 0x 접두사 추가
            log.debug("해시 생성 완료: {}", docHashWithPrefix);
            // 서명 생성 전 파라미터 확인
            log.debug("서명 생성 파라미터 - requestor: {}, docName: {}, privateKey: {}",
                    requestor,
                    docName,
                    privateKey != null ? "유효함" : "null");
            // 서명 생성
            String signature = signatureUtil.createSignature(requestor, docName, "", docHashWithPrefix, privateKey);
            log.debug("서명 생성 완료: {}", signature);

            // 블록체인 객체 생성
            BlockChainStoreRequestDto storeData = new BlockChainStoreRequestDto(requestor, docName, "", docHashWithPrefix, signature);
            log.debug("블록체인 요청 데이터 생성 완료: {}", storeData);

            // 블록체인 API 호출
            Map<String, Object> blockchainResponse = storeDocument(storeData);
            log.debug("블록체인 응답: {}", blockchainResponse);

            // 블록체인 트랜잭션 ID 추출
            String transactionHash = (String) blockchainResponse.get("transactionHash");
            log.debug("트랜잭션 해시: {}", transactionHash);

        } catch (Exception e) {
            log.error("블록체인 저장 중 오류 발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.BLOCKCHAIN_SAVE_ERROR, "reason", e.getMessage());
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
            blockchainRestTemplate.exchange(
                    url,
                    HttpMethod.DELETE,
                    requestEntity,
                    Map.class
            );

            // 응답 처리
            log.debug("문서 삭제 성공: {}", documentName);
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
