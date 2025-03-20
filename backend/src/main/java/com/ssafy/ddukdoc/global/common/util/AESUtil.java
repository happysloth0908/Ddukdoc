package com.ssafy.ddukdoc.global.common.util;

import com.ssafy.ddukdoc.global.error.exception.CustomException;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class AESUtil {
    @Value("${encryption.kek}")
    private String KEK_STRING;

    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;

    //랜덤 IV 생성
    private byte[] generateIV() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }
    //DEK 생성
    public SecretKey generateDek() {
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(256);
            return keyGen.generateKey();
        }catch (NoSuchAlgorithmException e) {
            throw new CustomException(ErrorCode.GENERATED_DEK, "reason", "DEK 생성 실패");
        }
    }

    //데이터 암호화 메서드
    public String encryptData(String data, SecretKey dek){
        try {
            // 데이터 암호화
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            byte[] iv = generateIV();
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);

            cipher.init(Cipher.ENCRYPT_MODE, dek, gcmSpec);
            byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // IV + 암호화된 데이터
            byte[] combined = new byte[IV_LENGTH + encryptedData.length];
            System.arraycopy(iv, 0, combined, 0, IV_LENGTH);
            System.arraycopy(encryptedData, 0, combined, IV_LENGTH, encryptedData.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR, "reason", e.getMessage());
        }
    }

    //KEK로 DEK 암호화
    public String encryptDek(SecretKey dek){
        try{
            byte[] kekBytes = Base64.getDecoder().decode(KEK_STRING);

            if (kekBytes.length != 32) {
                throw new CustomException(ErrorCode.INVALID_KEK, "kek", "KEK는 32바이트(256비트)여야 합니다.");
            }
            //KEK
            SecretKey kek = new SecretKeySpec(kekBytes, "AES");

            //DEK 암호화
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            byte[] iv = generateIV();
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);

            cipher.init(Cipher.ENCRYPT_MODE, kek, gcmSpec);
            byte[] encryptedDek = cipher.doFinal(dek.getEncoded());

            // IV + 암호화된 DEK 합치기
            byte[] combined = new byte[IV_LENGTH + encryptedDek.length];
            System.arraycopy(iv, 0, combined, 0, IV_LENGTH);
            System.arraycopy(encryptedDek, 0, combined, IV_LENGTH, encryptedDek.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR, "reason", e.getMessage());
        }
    }

    //암호화 호출 메서드
    public String encrypt(String data){
        // dek 생성
        SecretKey dek = generateDek();
        //data 암호화
        String encryptedData = encryptData(data, dek);
        //dek 암호화
        String encryptedDek = encryptDek(dek);
        // 암호화된 dek + // + 암호화된 data
        return encryptedDek + ":" + encryptedData;
    }

    //KEK로 DEK 복호화
    public SecretKey decryptDek(String encryptedDek){
        try{
            byte[] kekBytes = Base64.getDecoder().decode(KEK_STRING);

            if (kekBytes.length != 32) {
                throw new CustomException(ErrorCode.INVALID_KEK, "kek", "KEK는 32바이트(256비트)여야 합니다.");
            }

            //디코딩된 바이트로 kek 키 생성
            SecretKey kek = new SecretKeySpec(kekBytes, "AES");

            //Base64 디코딩
            byte[] decoded = Base64.getDecoder().decode(encryptedDek);
            System.out.println("[DEBUG] 디코딩된 데이터 길이: " + decoded.length);
            byte[] iv = new byte[IV_LENGTH];
            byte[] encryptedBytes = new byte[decoded.length - IV_LENGTH];

            //IV와 암호화된 DEK 분리
            System.arraycopy(decoded, 0, iv, 0, IV_LENGTH);
            System.arraycopy(decoded, IV_LENGTH, encryptedBytes, 0, encryptedBytes.length);

            System.out.println("[DEBUG] DEK 복호화 중...");

            //KEK로 암호화된 DEK 복호화
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);

            cipher.init(Cipher.DECRYPT_MODE,kek,gcmSpec);
            byte[] dekBytes = cipher.doFinal(encryptedBytes);

            System.out.println("[DEBUG] DEK 복호화 완료!");

            
            return new SecretKeySpec(dekBytes,"AES");
        }catch (Exception e){
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR,"reason","DEK 복호화 실패 : "+e.getMessage());
        }
    }

    //DEK로 암호화된 data 복호화
    public String decryptData(String encryptedData, SecretKey dek){
        try{
            System.out.println("[DEBUG] 암호화된 데이터(Base64): " + encryptedData);

            //Base64 리코딩
            byte[] decoded = Base64.getDecoder().decode(encryptedData);
            System.out.println("[DEBUG] 디코딩된 데이터 길이: " + decoded.length);

            byte[] iv = new byte[IV_LENGTH];
            byte[] encryptedBytes = new byte[decoded.length - IV_LENGTH];

            //IV와 암호화된 데이터 분리
            System.arraycopy(decoded, 0, iv, 0, IV_LENGTH);
            System.arraycopy(decoded, IV_LENGTH, encryptedBytes, 0, encryptedBytes.length);

            System.out.println("[DEBUG] IV: " + Base64.getEncoder().encodeToString(iv));
            System.out.println("[DEBUG] 암호화된 메시지 길이: " + encryptedBytes.length);

            System.out.println("[DEBUG] 데이터 복호화 중!");

            //DEK로 데이터 복호화
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);


            cipher.init(Cipher.DECRYPT_MODE, dek, gcmSpec);
            byte[] decryptedData = cipher.doFinal(encryptedBytes);
            System.out.println("[DEBUG] 데이터 복호화 완료!");

            return new String(decryptedData, StandardCharsets.UTF_8);

        }catch (Exception e){
            throw new CustomException(ErrorCode.DECRYPTION_ERROR, "reason", "데이터 복호화 실패: " + e.getMessage());
        }
    }

    //호출 복호화 메서드
    public String decrypt(String encryptedInput){
        try{
            System.out.println("[DEBUG] 복호화 요청 데이터: " + encryptedInput);

            //DEK 와 data 분리 (DEK//data)
            String[] parts = encryptedInput.split(":");
            if(parts.length != 2){
                throw new CustomException(ErrorCode.DECRYPTION_ERROR, "reason", "잘못된 암호화 형식 길이가 작아요");
            }

            String encryptedDek = parts[0];
            String encryptedData = parts[1];


            System.out.println("[DEBUG] 암호화된 DEK 추출 완료: " + encryptedDek);
            System.out.println("[DEBUG] 암호화된 데이터 추출 완료: " + encryptedData);

            //KEK로 DEK 복호화
            SecretKey dek = decryptDek(encryptedDek);

            //DEK로 데이터 복호화
            return decryptData(encryptedData, dek);
        }catch(Exception e){
            throw new CustomException(ErrorCode.DECRYPTION_ERROR, "reason", "복호화 실패: " + e.getMessage());
        }
    }

}
