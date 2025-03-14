package com.ssafy.ddukdoc.global.common.util;

import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
@Component
public class AESUtil {
    @Value("${encryption.aes.key}")
    private static String SECRET_KEY;

    @Value("${encryption.aes.iv}")
    private static String IV;

    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";

    public static String encrypt(String plainText) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);

        // AES 키 및 IV 설정
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(IV.getBytes(StandardCharsets.UTF_8));

        // 암호화 모드 설정
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);

        // 문자열을 AES로 암호화
        byte[] encrypted = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

        // Base64로 인코딩하여 반환
        return Base64.getEncoder().encodeToString(encrypted);
    }
}
