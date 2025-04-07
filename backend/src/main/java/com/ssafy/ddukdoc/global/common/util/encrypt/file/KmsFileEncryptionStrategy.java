package com.ssafy.ddukdoc.global.common.util.encrypt.file;

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

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@Primary
@RequiredArgsConstructor
public class KmsFileEncryptionStrategy implements FileEncryptionStrategy {

    private final FileEncryptionUtil fileEncryptionUtil;
    private final KmsClient kmsClient;

    @Value("${cloud.aws.kms.key}")
    private String keyId;

    /**
     * 파일 봉투 암호화
     *
     * @param file 암호화할 파일
     * @return 암호화 결과 (암호화된 파일, KMS로 암호화된 DEK, IV)
     */
    @Override
    public Map<String, Object> encryptFile(File file) {
        if (file == null || !file.exists() || !file.isFile()) {
            log.error("암호화할 파일이 존재하지 않거나 파일이 아닙니다: {}", file);
            throw new CustomException(ErrorCode.FILE_NOT_FOUND, "file", "파일이 존재하지 않거나 파일이 아닙니다");
        }

        try {
            // 1. KMS를 통해 데이터 암호화 키(DEK) 생성
            GenerateDataKeyRequest dataKeyRequest = GenerateDataKeyRequest.builder()
                    .keyId(keyId)
                    .keySpec(DataKeySpec.AES_256)
                    .build();

            GenerateDataKeyResponse dataKeyResponse = kmsClient.generateDataKey(dataKeyRequest);

            // 2. 평문 DEK (암호화에 사용)
            byte[] plaintextKey = dataKeyResponse.plaintext().asByteArray();
            SecretKey dek = new SecretKeySpec(plaintextKey, "AES");

            // 3. KMS로 암호화된 DEK (저장용)
            byte[] encryptedKey = dataKeyResponse.ciphertextBlob().asByteArray();

            // 4. IV 생성
            byte[] iv = fileEncryptionUtil.generateIV();

            // 5. 파일 암호화
            File encryptedFile = fileEncryptionUtil.encryptFileWithDek(file, dek, iv);

            Map<String, Object> result = new HashMap<>();
            result.put("encryptedFile", encryptedFile);
            result.put("encryptedDek", Base64.getEncoder().encodeToString(encryptedKey));
            result.put("iv", Base64.getEncoder().encodeToString(iv));

            return result;

        } catch (Exception e) {
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR, "파일 암호화 실패 : " + e.getMessage());
        }
    }


    /**
     * 파일 봉투 복호화
     *
     * @param encryptedFile       암호화된 파일
     * @param encodedEncryptedDek KMS로 암호화된 DEK (Base64 인코딩)
     * @param encodedIv           IV (Base64 인코딩)
     * @return 복호화된 파일
     */
    @Override
    public File decryptFile(File encryptedFile, String encodedEncryptedDek, String encodedIv) {
        if (encryptedFile == null || !encryptedFile.exists() || !encryptedFile.isFile()) {
            log.error("복호화할 파일이 존재하지 않거나 파일이 아닙니다: {}", encryptedFile);
            throw new CustomException(ErrorCode.FILE_NOT_FOUND, "file", "파일이 존재하지 않거나 파일이 아닙니다");
        }

        try {
            // 1. Base64 디코딩
            byte[] encryptedDek = Base64.getDecoder().decode(encodedEncryptedDek);
            byte[] iv = Base64.getDecoder().decode(encodedIv);

            // 2. KMS를 사용하여 DEK 복호화
            DecryptRequest decryptRequest = DecryptRequest.builder()
                    .ciphertextBlob(SdkBytes.fromByteArray(encryptedDek))
                    .build();

            byte[] plaintextKey = kmsClient.decrypt(decryptRequest).plaintext().asByteArray();
            SecretKey dek = new SecretKeySpec(plaintextKey, "AES");

            // 3. 파일 복호화
            return fileEncryptionUtil.decryptFileWithDek(encryptedFile, dek, iv);

        } catch (Exception e) {
            log.error("파일 복호화 실패: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.DECRYPTION_ERROR, "파일 복호화 실패: " + e.getMessage());
        }
    }
}
