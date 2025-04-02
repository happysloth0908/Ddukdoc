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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class BlockchainUtil {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://sto.ssafy.io/v1/tokens/";
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
        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                Map.class
        );
        return response.getBody();
    }

    /**
     * 문서 이름으로 블록체인에서 문서 조회
     *
     * @param documentName 조회할 문서 이름
     * @return 문서 정보 또는 null (문서가 없는 경우)
     */
    public BlockchainDocumentResponseDto getDocumentByName(String documentName) {
        String url = baseUrl + contractAddress + "/documents"+ documentName;

        log.debug("문서 조회 URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<BlockchainDocumentResponseDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    BlockchainDocumentResponseDto.class
            );

            log.debug("문서 조회 응답: {}", response.getBody());
            return response.getBody();
        } catch (Exception e) {
            log.error("문서 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR,"reason",e.getCause());
        }
    }

    public BlockchainSaveResult saveDocumentInBlockchain(byte[] pdfData, TemplateCode templateCode) {
        try {
            String hash = hashUtil.generateSHA256Hash(pdfData);
            String docHashWithPrefix = "0x" + hash; // 0x 접두사 추가

            // 문서 이름 생성
            String docName = generateUniqueDocName(templateCode);
            log.debug("문서 이름 : {}", docName);

            // 서명 생성
            String signature = signatureUtil.createSignature(requestor, docName, "", docHashWithPrefix, privateKey);

            // 블록체인 객체 생성
            BlockChainStoreRequestDto storeData = new BlockChainStoreRequestDto(requestor, docName, "", docHashWithPrefix, signature);

            // 블록체인 API 호출
            Map<String, Object> blockchainResponse = storeDocument(storeData);
            // 블록체인 트랜잭션 ID 추출
            String transactionHash = (String) blockchainResponse.get("transactionHash");

            return new BlockchainSaveResult(pdfData, transactionHash, docHashWithPrefix, docName, blockchainResponse);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.BLOCKCHAIN_SIGNATURE_ERROR, "reason", e.getMessage());
        }

    }

    /**
     * 유니크한 문서 이름을 생성합니다.
     *
     * @param templateCode 템플릿 코드
     * @return 유니크한 문서 이름
     */
    private String generateUniqueDocName(TemplateCode templateCode) {
        // UUID + 템플릿 코드 + 타임스탬프 조합으로 유니크한 이름 생성
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String timestamp = String.valueOf(System.currentTimeMillis());
        return templateCode.name() + "_" + uuid + "_" + timestamp;
    }
}
