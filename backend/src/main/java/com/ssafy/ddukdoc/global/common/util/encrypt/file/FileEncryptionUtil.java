package com.ssafy.ddukdoc.global.common.util.encrypt.file;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.SecureRandom;

@Component
public class FileEncryptionUtil {

    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;

    public byte[] generateIV() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }

    public String getFileExtension(String fileName) {
        String originalName = fileName.replace(".enc", "");
        int lastDotIndex = originalName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return originalName.substring(lastDotIndex);
        }
        // 기본 확장자가 없는 경우
        return ".tmp";
    }

    public File encryptFileWithDek(File file, SecretKey dek, byte[] iv) throws Exception {
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

    public File decryptFileWithDek(File encryptedFile, SecretKey dek, byte[] iv) throws IOException {
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
}
