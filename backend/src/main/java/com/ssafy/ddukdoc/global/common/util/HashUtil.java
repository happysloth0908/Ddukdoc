package com.ssafy.ddukdoc.global.common.util;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import org.springframework.stereotype.Component;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class HashUtil {
    /**
     * SHA-256 해시를 생성하는 유틸리티 메서드
     */
    public String generateSHA256Hash(byte[] data){
        try{
            // MessageDigest 인스턴스를 SHA-256 알고리즘으로 생성
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // 생성된 SHA-256 해시값
            byte[] hashBytes = digest.digest(data);

            // 생성된 바이트 배열 해시값을 16진수 문자열로 변환
            return bytesToHex(hashBytes);
        }catch (NoSuchAlgorithmException e){
            throw new CustomException(ErrorCode.INVALID_ENCRYPTION_ALGORITHM);
        }
    }

    /**
     * 바이트 배열을 16진수 문자열로 반환
     * @param bytes 변환할 바이트 배열
     * @return 16진수 문자열
     */
    private String bytesToHex(byte[] bytes){
        StringBuilder hexString = new StringBuilder();


        // 각 바이트를 순회하며 16진수로 변환
        for(byte b : bytes){
            // 바이트를 16진수로 변환
            // 0xff & b: 바이트의 부호 없는 정수 값을 얻기 위해 비트 AND 연산
            String hex = Integer.toHexString(0xff & b);

            // 한 자리 16진수의 경우 앞에 0 추가 (2자리로 만들기 위함)
            if(hex.length()==1){
                hexString.append('0');
            }
            hexString.append(hex);
        }

        // 최종 16진수 문자열 반환
        return hexString.toString();
    }
}
