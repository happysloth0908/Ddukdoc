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
            if (KEK_STRING == null || KEK_STRING.length() < 32) {
                throw new CustomException(ErrorCode.INVALID_KEK, "kek", "KEK는 32바이트(256비트)여야 합니다.");
            }
            //KEK
            SecretKey kek = new SecretKeySpec(KEK_STRING.getBytes(StandardCharsets.UTF_8), "AES");

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
        return encryptedDek + "//" + encryptedData;
    }

}
