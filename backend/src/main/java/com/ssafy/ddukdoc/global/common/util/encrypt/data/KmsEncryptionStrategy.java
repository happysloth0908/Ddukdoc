package com.ssafy.ddukdoc.global.common.util.encrypt.data;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.kms.KmsClient;
import software.amazon.awssdk.services.kms.model.DataKeySpec;
import software.amazon.awssdk.services.kms.model.DecryptRequest;
import software.amazon.awssdk.services.kms.model.GenerateDataKeyRequest;
import software.amazon.awssdk.services.kms.model.GenerateDataKeyResponse;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static com.ssafy.ddukdoc.global.common.util.encrypt.AESConstants.GCM_TAG_LENGTH;
import static com.ssafy.ddukdoc.global.common.util.encrypt.AESConstants.IV_LENGTH;

@Component
@Primary
@Slf4j
@RequiredArgsConstructor
public class KmsEncryptionStrategy implements EncryptionStrategy {

    @Value("${cloud.aws.kms.key}")
    private String keyId;

    private final KmsClient kmsClient;

    @Override
    public String encrypt(String data) {
        try {
            // 1. KMS를 통해 데이터 암호화 키(DEK) 생성
            GenerateDataKeyRequest dataKeyRequest = GenerateDataKeyRequest.builder()
                    .keyId(keyId)
                    .keySpec(DataKeySpec.AES_256)
                    .build();

            GenerateDataKeyResponse dataKeyResponse = kmsClient.generateDataKey(dataKeyRequest);

            // 2. 평문 DEK (암호화에 사용)
            byte[] plaintextKey = dataKeyResponse.plaintext().asByteArray();

            // 3. KMS로 암호화된 DEK (저장용)
            byte[] encryptedKey = dataKeyResponse.ciphertextBlob().asByteArray();

            // 4. DEK로 데이터 암호화
            byte[] iv = generateIV();
            byte[] encryptedData = encryptDataWithDek(data.getBytes(StandardCharsets.UTF_8), plaintextKey, iv);

            // 5. 결과 형식: Base64(암호화된 DEK) + ":" + Base64(IV + 암호화된 데이터)
            String encryptedKeyBase64 = Base64.getEncoder().encodeToString(encryptedKey);

            // IV와 암호화된 데이터 결합
            byte[] combined = new byte[IV_LENGTH + encryptedData.length];
            System.arraycopy(iv, 0, combined, 0, IV_LENGTH);
            System.arraycopy(encryptedData, 0, combined, IV_LENGTH, encryptedData.length);

            String encryptedDataWithIVBase64 = Base64.getEncoder().encodeToString(combined);

            return encryptedKeyBase64 + ":" + encryptedDataWithIVBase64;

        } catch (Exception e) {
            log.error("KMS 암호화 실패: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR, e.getMessage());
        }
    }

    @Override
    public String decrypt(String encryptedInput) {
        try {
            // 1. 입력 분리: 암호화된 DEK와 암호화된 데이터
            String[] parts = encryptedInput.split(":");
            if (parts.length != 2) {
                throw new CustomException(ErrorCode.DECRYPTION_ERROR, "잘못된 암호화 형식");
            }

            String encryptedKeyBase64 = parts[0];
            String encryptedDataWithIVBase64 = parts[1];

            // 2. Base64 디코딩
            byte[] encryptedKey = Base64.getDecoder().decode(encryptedKeyBase64);
            byte[] combined = Base64.getDecoder().decode(encryptedDataWithIVBase64);

            // 3. IV와 암호화된 데이터 분리
            if (combined.length <= IV_LENGTH) {
                throw new CustomException(ErrorCode.DECRYPTION_ERROR, "잘못된 데이터 형식");
            }

            byte[] iv = new byte[IV_LENGTH];
            byte[] encryptedData = new byte[combined.length - IV_LENGTH];

            System.arraycopy(combined, 0, iv, 0, IV_LENGTH);
            System.arraycopy(combined, IV_LENGTH, encryptedData, 0, encryptedData.length);

            // 4. KMS를 사용하여 DEK 복호화
            DecryptRequest decryptRequest = DecryptRequest.builder()
                    .ciphertextBlob(SdkBytes.fromByteArray(encryptedKey))
                    .build();

            byte[] plaintextKey = kmsClient.decrypt(decryptRequest).plaintext().asByteArray();

            // 5. 복호화된 DEK로 데이터 복호화
            byte[] decryptedData = decryptDataWithDek(encryptedData, plaintextKey, iv);

            return new String(decryptedData, StandardCharsets.UTF_8);

        } catch (Exception e) {
            log.error("KMS 복호화 실패: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.DECRYPTION_ERROR, e.getMessage());
        }
    }

    // DEK로 데이터 암호화 메서드
    private byte[] encryptDataWithDek(byte[] data, byte[] dekBytes, byte[] iv) throws Exception {
        SecretKey dek = new SecretKeySpec(dekBytes, "AES");

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);

        cipher.init(Cipher.ENCRYPT_MODE, dek, gcmSpec);
        return cipher.doFinal(data);
    }

    // DEK로 데이터 복호화 메서드
    private byte[] decryptDataWithDek(byte[] encryptedData, byte[] dekBytes, byte[] iv) throws Exception {
        SecretKey dek = new SecretKeySpec(dekBytes, "AES");

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);

        cipher.init(Cipher.DECRYPT_MODE, dek, gcmSpec);
        return cipher.doFinal(encryptedData);
    }
}
