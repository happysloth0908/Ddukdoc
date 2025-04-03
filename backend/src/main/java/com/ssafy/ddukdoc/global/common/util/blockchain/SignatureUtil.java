package com.ssafy.ddukdoc.global.common.util.blockchain;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.util.LinkedHashMap;
import java.util.Map;

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
    public String createSignature(String requestor, String name, String docUri, String docHash, String privateKey) throws Exception {
        // 서명할 데이터 객체 생성
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("requestor", requestor);
        data.put("name", name);
        data.put("docUri", docUri);
        data.put("docHash", docHash);

        // 데이터를 JSON 문자열로 변환
        String jsonData = objectMapper.writeValueAsString(data);

        // Web3j 자격 증명 생성
        Credentials credentials = Credentials.create(privateKey);
        ECKeyPair keyPair = credentials.getEcKeyPair();

        // 메시지 해시 생성 및 서명
        byte[] messageHash = Sign.getEthereumMessageHash(jsonData.getBytes());
        Sign.SignatureData signatureData = Sign.signMessage(messageHash, keyPair, false);

        // 서명 데이터를 16진수 문자열로 변환
        String r = Numeric.toHexString(signatureData.getR());
        String s = Numeric.toHexString(signatureData.getS());
        String v = Numeric.toHexString(signatureData.getV());
        // 0x 접두사 + r(64자) + s(64자) + v(2자)
        return "0x" + r.substring(2) + s.substring(2) + v.substring(2);
    }

    /**
     * 서명이 포함된 문서 요청 객체를 생성합니다.
     *
     * @param requestor 요청자 주소
     * @param name 문서 이름
     * @param docHash 문서 해시
     * @param privateKey 개인키
     * @return 서명이 포함된 요청 객체
     * @throws Exception JSON 변환 또는 서명 생성 중 오류 발생 시
     */
    public Map<String, Object> createSignedRequest(String requestor, String name,String docUri, String docHash, String privateKey) throws Exception {
        String signature = createSignature(requestor, name, docUri, docHash, privateKey);

        return Map.of(
                "requestor", requestor,
                "name", name,
                "docUri", docUri,
                "docHash", docHash,
                "signature", signature
        );
    }
}
