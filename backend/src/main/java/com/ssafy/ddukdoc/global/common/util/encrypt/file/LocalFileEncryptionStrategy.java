package com.ssafy.ddukdoc.global.common.util.encrypt.file;

import com.ssafy.ddukdoc.global.common.util.encrypt.data.LocalEncryptionStrategy;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.io.File;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class LocalFileEncryptionStrategy implements FileEncryptionStrategy {

    private final LocalEncryptionStrategy localEncryption;
    private final FileEncryptionUtil fileEncryptionUtil;

    /**
     * 파일 암호화
     *
     * @param file 암호화할 파일
     * @return 암호화 결과 (암호화된 파일, 암호화된 DEK, IV)
     */
    @Override
    public Map<String, Object> encryptFile(File file) {
        if (file == null || !file.exists() || !file.isFile()) {
            log.error("암호화할 파일이 존재하지 않거나 파일이 아닙니다: {}", file);
            throw new CustomException(ErrorCode.FILE_NOT_FOUND, "file", "파일이 존재하지 않거나 파일이 아닙니다");
        }
        try {
            //DEK 생성
            SecretKey dek = localEncryption.generateDek();

            //IV 생성
            byte[] iv = fileEncryptionUtil.generateIV();

            //파일 암호화
            File encryptedFile = fileEncryptionUtil.encryptFileWithDek(file, dek, iv);

            //DEK 암호화
            String encryptedDek = localEncryption.encryptDek(dek);

            Map<String, Object> result = new HashMap<>();
            result.put("encryptedFile", encryptedFile);
            result.put("encryptedDek", encryptedDek);
            result.put("iv", Base64.getEncoder().encodeToString(iv));

            return result;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR, "파일 암호화 실패 : " + e.getMessage());
        }
    }


    // 암호화된 파일과 암호화 정보를 이용하여 파일 복호화
    @Override
    public File decryptFile(File encryptedFile, String encryptedDek, String base64IV) {
        if (encryptedFile == null || !encryptedFile.exists() || !encryptedFile.isFile()) {
            log.error("복호화할 파일이 존재하지 않거나 파일이 아닙니다: {}", encryptedFile);
            throw new CustomException(ErrorCode.FILE_NOT_FOUND, "file", "파일이 존재하지 않거나 파일이 아닙니다");
        }
        try {
            //DEK 복호화
            SecretKey dek = localEncryption.decryptDek(encryptedDek);

            //IV 디코딩
            byte[] iv = Base64.getDecoder().decode(base64IV);

            // 파일 복호화 - IV는 메타데이터에서 가져온 것 사용
            return fileEncryptionUtil.decryptFileWithDek(encryptedFile, dek, iv);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR, "파일 복호화 실패 : " + e.getMessage());
        }
    }
}
