package com.ssafy.ddukdoc.global.common.util;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileAESUtil {
    private final AESUtil aesUtil;

    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;
    private static final int BUFFER_SIZE = 8192; // 8KB

    private byte[] generateIV() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }

    /**
     * 파일 암호화
     *
     * @param file 암호화할 파일
     * @return 암호화 결과 (암호화된 파일, 암호화된 DEK, IV)
     */
    public Map<String, Object> encryptFile(File file) {
        if (file == null || !file.exists() || !file.isFile()) {
            log.error("암호화할 파일이 존재하지 않거나 파일이 아닙니다: {}", file);
            throw new CustomException(ErrorCode.FILE_NOT_FOUND, "file", "파일이 존재하지 않거나 파일이 아닙니다");
        }
        try {
            //DEK 생성
            SecretKey dek = aesUtil.generateDek();

            //IV 생성
            byte[] iv = generateIV();

            //파일 암호화
            File encryptedFile = encryptFileWithDek(file, dek, iv);

            //DEK 암호화
            String encryptedDek = aesUtil.encryptDek(dek);

            Map<String, Object> result = new HashMap<>();
            result.put("encryptedFile", encryptedFile);
            result.put("encryptedDek", encryptedDek);
            result.put("iv", Base64.getEncoder().encodeToString(iv));

            return result;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR, "파일 암호화 실패 : " + e.getMessage());
        }
    }

    //DEK 사용하여 파일 암호화
    private File encryptFileWithDek(File file, SecretKey dek, byte[] iv) throws Exception {
        File encryptedFile = new File(file.getParent(), file.getName() + ".enc");

        try (FileInputStream fis = new FileInputStream(file);
             FileOutputStream fos = new FileOutputStream(encryptedFile)) {

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, dek, gcmSpec);

            // 버퍼 크기 8KB 설정
            byte[] buffer = new byte[8192];
            int bytesRead;

            //IV를 파일 시작 부분에 저장
            fos.write(iv);

            while ((bytesRead = fis.read(buffer)) != -1) {
                byte[] encryptedBuffer = cipher.update(buffer, 0, bytesRead);
                if (encryptedBuffer != null) {
                    fos.write(encryptedBuffer);
                }
            }

            //암호화 완료
            byte[] encryptedBuffer = cipher.doFinal();
            if (encryptedBuffer != null) {
                fos.write(encryptedBuffer);
            }

            return encryptedFile;
        }

    }


    // 암호화된 파일과 암호화 정보를 이용하여 파일 복호화
    public File decryptFile(File encryptedFile, String encryptedDek, String base64IV) {
        if (encryptedFile == null || !encryptedFile.exists() || !encryptedFile.isFile()) {
            log.error("복호화할 파일이 존재하지 않거나 파일이 아닙니다: {}", encryptedFile);
            throw new CustomException(ErrorCode.FILE_NOT_FOUND, "file", "파일이 존재하지 않거나 파일이 아닙니다");
        }
        try {
            //DEK 복호화
            SecretKey dek = aesUtil.decryptDek(encryptedDek);

            //IV 디코딩
            byte[] iv = Base64.getDecoder().decode(base64IV);

            // 파일 복호화 - IV는 메타데이터에서 가져온 것 사용
            return decryptFileWithDek(encryptedFile, dek, iv);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR, "파일 복호화 실패 : " + e.getMessage());
        }
    }

    //DEK로 파일 복호화
    private File decryptFileWithDek(File encryptedFile, SecretKey dek, byte[] iv) throws IOException {
        // 임시 디렉토리에 고유한 이름으로 복호화된 파일 생성
        File decryptedFile = File.createTempFile("decrypted-", getFileExtension(encryptedFile.getName()));
        try {
            // 암호화된 파일 전체 읽기
            byte[] encryptedBytes = java.nio.file.Files.readAllBytes(encryptedFile.toPath());

            // 암호화된 내용만 추출 (IV 부분 제외)
            if (encryptedBytes.length <= IV_LENGTH) {
                throw new CustomException(ErrorCode.FILE_SIZE_ERROR);
            }

            // 첫 12바이트가 파일에 저장된 IV
            byte[] fileIv = new byte[IV_LENGTH];
            System.arraycopy(encryptedBytes, 0, fileIv, 0, IV_LENGTH);

            // 파일의 IV와 메타데이터 IV 비교 (디버깅용)
            boolean ivsMatch = java.util.Arrays.equals(fileIv, iv);


            // IV 제거 후 암호화된 데이터만 추출
            byte[] encryptedContent = new byte[encryptedBytes.length - IV_LENGTH];
            System.arraycopy(encryptedBytes, IV_LENGTH, encryptedContent, 0, encryptedContent.length);

            // Cipher 초기화 및 복호화 (메타데이터의 IV 사용)
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, dek, gcmSpec);

            byte[] decryptedBytes = cipher.doFinal(encryptedContent);

            // 복호화된 데이터를 파일에 쓰기
            try (FileOutputStream fos = new FileOutputStream(decryptedFile)) {
                fos.write(decryptedBytes);
                fos.flush();
            }


            // 파일이 제대로 생성되었는지 확인
            if (!decryptedFile.exists() || decryptedFile.length() == 0) {
                throw new Exception("복호화된 파일이 생성되지 않았거나 비어 있습니다.");
            }

            return decryptedFile;

        } catch (Exception e) {
            // 에러 발생 시 임시 파일 정리
            if (decryptedFile.exists() && !decryptedFile.delete()) {
                throw new CustomException(ErrorCode.FILE_DELETE_FAILED, "file", decryptedFile.getAbsolutePath());
            }
            throw new CustomException(ErrorCode.FILE_DECRYPTION_ERROR, e.getMessage());
        }
    }

    // 파일 확장자 추출 메서드
    private String getFileExtension(String fileName) {
        String originalName = fileName.replace(".enc", "");
        int lastDotIndex = originalName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return originalName.substring(lastDotIndex);
        }
        // 기본 확장자가 없는 경우
        return ".tmp";
    }
}
