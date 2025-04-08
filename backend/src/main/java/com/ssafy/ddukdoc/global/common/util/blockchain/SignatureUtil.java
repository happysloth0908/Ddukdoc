package com.ssafy.ddukdoc.global.common.util.blockchain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import io.micrometer.common.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
public class SignatureUtil {
    private final ObjectMapper objectMapper = new ObjectMapper();
    /**
     * 문서 데이터에 대한 서명을 생성합니다.
     *
     * @param requestor 요청자 주소
     * @param name 문서 이름
     * @param docUri 문서 URI (빈 문자열로 설정)
     * @param docHash 문서 해시
     * @param privateKey 개인키
     * @return 서명 문자열
     * @throws Exception JSON 변환 또는 서명 생성 중 오류 발생 시
     */
    public String createSignature(String requestor, String name, String docUri, String docHash, String privateKey){
        // 로깅 추가: 입력 파라미터 확인
        log.debug("서명 생성 시작 - requestor: {}, name: {}, docHash: {}",
                requestor,
                name,
                docHash);
        // 서명할 데이터 객체 생성
        Map<String, Object> data = new LinkedHashMap<>();
            data.put("requestor", requestor);
            data.put("name", name);
            data.put("docUri", docUri);
            data.put("docHash", docHash);

        return returnSignature(privateKey,data);
    }

    public String createSignatureForDelete(String requestor, String documentName, String privateKey){
        // 로깅 추가: 입력 파라미터 확인
        log.debug("삭제 서명 생성 시작 - requestor: {}, name: {}",
                requestor,
                documentName);
        // 서명할 데이터 객체 생성 (name과 requestor만 포함)
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("requestor", requestor);
        data.put("name", documentName);

        return returnSignature(privateKey,data);
    }

    private String returnSignature(String privateKey,Map<String,Object> data){
        // 데이터를 JSON 문자열로 변환
        String jsonData = null;
        try {
            log.debug("서명 데이터 검증 시작: {}", data);
            validateInputs(data.get("requestor").toString(), data.get("name").toString(), privateKey);
            jsonData = objectMapper.writeValueAsString(data);
            log.debug("JSON 문자열 생성 완료: {}", jsonData);
        } catch (JsonProcessingException e) {
            log.error("JSON 변환 중 오류 발생: {}", e.getMessage(), e);

            throw new CustomException(ErrorCode.BLOCKCHAIN_SIGNATURE_ERROR)
                    .addParameter("reason",e.getMessage())
                    .addParameter("data",data);
        }

        // Web3j 자격 증명 생성
        log.debug("개인키를 사용한 자격 증명 생성 시작 (개인키 길이: {})",
                privateKey != null ? privateKey.length() : "null");
        try {
        // Web3j 자격 증명 생성
        Credentials credentials = Credentials.create(privateKey);
        ECKeyPair keyPair = credentials.getEcKeyPair();
        log.debug("자격 증명 생성 완료. 주소: {}", credentials.getAddress());

        // 메시지 해시 생성 및 서명
        byte[] messageHash = Sign.getEthereumMessageHash(jsonData.getBytes());
        log.debug("메시지 해시 생성 완료. 길이: {}", messageHash.length);

        Sign.SignatureData signatureData = Sign.signMessage(messageHash, keyPair, false);
        log.debug("서명 생성 완료");

        // 서명 데이터를 16진수 문자열로 변환
        String r = Numeric.toHexString(signatureData.getR());
        String s = Numeric.toHexString(signatureData.getS());
        String v = Numeric.toHexString(signatureData.getV());

        // 최종 서명 조합
        String signature = "0x" + r.substring(2) + s.substring(2) + v.substring(2);
        log.debug("최종 서명 생성 완료: {}", signature);
        // 0x 접두사 + r(64자) + s(64자) + v(2자)
        return signature;
            //return "0x" + r.substring(2) + s.substring(2) + v.substring(2);
        } catch (Exception e) {
            log.error("서명 과정에서 예외 발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.BLOCKCHAIN_SIGNATURE_ERROR, "reason", "서명 생성 중 오류: " + e.getMessage());
        }
    }
    private void validateInputs(String requestor, String name, String privateKey) {
        log.debug("입력값 검증 - requestor: {}, name: {}, privateKey 존재: {}",
                requestor,
                name,
                privateKey != null);
        if (StringUtils.isBlank(requestor)) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "reason","요청자 주소")
                    .addParameter("requestor",requestor);
        }
        if (StringUtils.isBlank(name)) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "reason","이름")
                    .addParameter("name",name);
        }
        if (StringUtils.isBlank(privateKey)) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "reason","개인키");
        }
    }
}
