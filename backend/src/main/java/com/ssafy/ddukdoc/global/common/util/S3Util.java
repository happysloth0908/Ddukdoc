package com.ssafy.ddukdoc.global.common.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.ssafy.ddukdoc.global.common.util.encrypt.file.FileEncryptionStrategy;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class S3Util {
    private final AmazonS3 amazonS3;
    private final FileEncryptionStrategy fileAes;

    public static final String PATH_PREFIX = "eftoj1/";
    public static final String PATH_SPLIT = "/eftoj1/";

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    //multipartFile 암호화 후 S3에 업로드
//    public String uploadEncryptedFile(MultipartFile multipartFile, String dirName) {
//        File originalFile = null;
//        File encryptedFile = null;
//
//        try {
//            //MultipartFile을 File 객체로 변환 후 S3에 업로드
//            originalFile = convert(multipartFile)
//                    .orElseThrow(() -> new CustomException(ErrorCode.FILE_CONVERT_ERROR));
//            // 파일 암호화
//            Map<String, Object> encryptionResult = fileAes.encryptFile(originalFile);
//            encryptedFile = (File) encryptionResult.get("encryptedFile");
//            String encryptedDek = (String) encryptionResult.get("encryptedDek");
//            String iv = (String) encryptionResult.get("iv");
//
//            log.debug("File encrypted: {}, original size: {}, encrypted size: {}",
//                    encryptedFile.getName(), originalFile.length(), encryptedFile.length());
//
//            // 암호화된 파일 업로드
//            String uploadUrl = uploadEncryptedFile(encryptedFile, dirName, encryptedDek, iv);
//
//            return uploadUrl;
//        } catch (Exception e) {
//            log.error("파일 암호화 업로드 중 오류 발생: {}", e.getMessage(), e);
//            throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR, "dirName", dirName);
//        } finally {
//
//            // 안전한 파일 삭제 로직
//            deleteFileQuietly(originalFile);
//            deleteFileQuietly(encryptedFile);
////            // 로컬 임시 파일 삭제
////            if (!originalFile.delete()) {
////                String name = originalFile.getName();
////                throw new CustomException(ErrorCode.FILE_DELETE_ERROR, "OriginalFileName", name);
////            }
////            if (!encryptedFile.delete()) {
////                String name = encryptedFile.getName();
////                throw new CustomException(ErrorCode.FILE_DELETE_ERROR, "encryptedFileFileName", name);
////            }
//        }
//    }
    public String uploadEncryptedFile(MultipartFile multipartFile, String dirName) {
        File originalFile = null;
        File encryptedFile = null;

        try {
            // 동시성 제어를 위한 잠금
            synchronized (this) {
                // MultipartFile을 File로 변환
                originalFile = convert(multipartFile)
                        .orElseThrow(() -> new CustomException(ErrorCode.FILE_CONVERT_ERROR));

                // 파일 암호화
                Map<String, Object> encryptionResult = fileAes.encryptFile(originalFile);
                encryptedFile = (File) encryptionResult.get("encryptedFile");
                String encryptedDek = (String) encryptionResult.get("encryptedDek");
                String iv = (String) encryptionResult.get("iv");

                // 상세 로깅
                log.info("원본 파일 정보:");
                log.info("파일명: {}", originalFile.getName());
                log.info("원본 파일 크기: {} bytes", originalFile.length());

                log.info("암호화된 파일 정보:");
                log.info("파일명: {}", encryptedFile.getName());
                log.info("암호화된 파일 크기: {} bytes", encryptedFile.length());
                log.info("암호화된 DEK: {}", encryptedDek);
                log.info("IV: {}", iv);

                // 암호화된 파일 업로드 (개선된 메서드)
                String uploadUrl = uploadEncryptedFileWithMD5(encryptedFile, dirName, encryptedDek, iv);

                return uploadUrl;
            }
        } catch (Exception e) {
            log.error("파일 암호화 업로드 중 오류 발생", e);
            throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR, "dirName", dirName);
        } finally {
            // 안전한 파일 삭제
            deleteFileQuietly(originalFile);
            deleteFileQuietly(encryptedFile);
        }
    }

    private String uploadEncryptedFileWithMD5(File encryptedFile, String dirName, String encryptedDek, String iv) {
        String fileName = PATH_PREFIX + dirName + "/" + UUID.randomUUID() + "-encrypted-" + encryptedFile.getName();

        try {
            log.info("=== 파일 업로드 시작 ===");
            log.info("업로드 디렉토리: {}", dirName);
            log.info("생성된 파일명: {}", fileName);

            // 파일 데이터를 바이트 배열로 읽기
            log.info("파일 읽기 시작");
            log.info("원본 암호화 파일 경로: {}", encryptedFile.getAbsolutePath());
            log.info("원본 암호화 파일 존재 여부: {}", encryptedFile.exists());
            log.info("원본 암호화 파일 크기: {} bytes", encryptedFile.length());

            byte[] fileData = Files.readAllBytes(encryptedFile.toPath());
            log.info("파일 읽기 완료");
            log.info("읽은 파일 데이터 크기: {} bytes", fileData.length);

            // 로그에 데이터 특성 추가
            log.info("파일 데이터 첫 10바이트 (16진수): {}",
                    bytesToHex(Arrays.copyOfRange(fileData, 0, Math.min(10, fileData.length))));

            // 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.addUserMetadata("encrypted-dek", encryptedDek);
            metadata.addUserMetadata("iv", iv);
            log.info("메타데이터 추가: DEK 및 IV");

            // 콘텐츠 길이 및 MD5 해시 명시적 설정
            metadata.setContentLength(fileData.length);
            log.info("콘텐츠 길이 설정: {} bytes", fileData.length);

            // MD5 해시 계산 및 설정
            byte[] md5Bytes = DigestUtils.md5(fileData);
            String base64Md5 = Base64.getEncoder().encodeToString(md5Bytes);
            metadata.setContentMD5(base64Md5);

            log.info("MD5 해시 계산");
            log.info("계산된 MD5 해시 (Base64): {}", base64Md5);
            log.info("MD5 해시 바이트 (16진수): {}", bytesToHex(md5Bytes));

            // InputStream을 사용하여 업로드
            try (InputStream inputStream = new ByteArrayInputStream(fileData)) {
                    PutObjectRequest putObjectRequest = new PutObjectRequest(
                            bucket,
                            fileName,
                            inputStream,
                            metadata
                    ).withCannedAcl(CannedAccessControlList.PublicRead);

                log.info("S3 업로드 준비");
                log.info("버킷 이름: {}", bucket);

                // 재시도 로직 추가
                int maxRetries = 3;
                for (int attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        log.info("S3 업로드 시도 (시도 {})", attempt);
                        long startTime = System.currentTimeMillis();

                        amazonS3.putObject(putObjectRequest);

                        long endTime = System.currentTimeMillis();
                        log.info("S3 업로드 성공");
                        log.info("업로드 소요 시간: {} ms", (endTime - startTime));

                        String uploadedUrl = amazonS3.getUrl(bucket, fileName).toString();
                        log.info("업로드된 파일 URL: {}", uploadedUrl);

                        log.info("=== 파일 업로드 완료 ===");
                        return uploadedUrl;
                    } catch (AmazonS3Exception e) {
                        log.error("S3 업로드 실패 (시도 {})", attempt);
                        log.error("예외 메시지: {}", e.getMessage());
                        log.error("에러 코드: {}", e.getErrorCode());
                        log.error("요청 ID: {}", e.getRequestId());

                        if (attempt == maxRetries) {
                            throw e;
                        }
                        log.warn("{}초 대기 후 재시도", attempt);
                        Thread.sleep(1000 * attempt);
                    }
                }
            }
        } catch (Exception e) {
            log.error("=== 파일 업로드 중 심각한 오류 발생 ===");
            log.error("오류 메시지: {}", e.getMessage());
            log.error("예외 클래스: {}", e.getClass().getName());

            // 추가 디버깅 정보
            if (e instanceof AmazonS3Exception) {
                AmazonS3Exception s3e = (AmazonS3Exception) e;
                log.error("S3 에러 코드: {}", s3e.getErrorCode());
                log.error("S3 요청 ID: {}", s3e.getRequestId());
            }

            throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR, "fileName", fileName);
        }

        throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR, "fileName", fileName);
    }

    // 바이트 배열을 16진수 문자열로 변환하는 유틸리티 메서드 추가
    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    // 파일 삭제 유틸리티 메서드 추가
    private void deleteFileQuietly(File file) {
        if (file != null && file.exists()) {
            try {
                if (!file.delete()) {
                    log.warn("임시 파일 삭제 실패: {}", file.getAbsolutePath());
                }
            } catch (Exception e) {
                log.error("임시 파일 삭제 중 예외 발생: {}", e.getMessage(), e);
                throw new CustomException(ErrorCode.FILE_DELETE_ERROR);
            }
        }
    }
    //S3에서 암호화된 파일 다운로드 및 복호화
    public File downloadAndDecryptFile(String fileKey) {
        try {
            //S3에서 파일 및 메타데이터 가져오기
            S3Object s3Object = amazonS3.getObject(bucket, fileKey);
            ObjectMetadata metadata = s3Object.getObjectMetadata();

            //메타데이터에서 암호화 정보 추출
            String encryptedDek = metadata.getUserMetadata().get("encrypted-dek");
            String iv = metadata.getUserMetadata().get("iv");

            if (encryptedDek == null || iv == null) {
                throw new CustomException(ErrorCode.FILE_METADATA_ERROR, "metadata", "암호화 정보를 찾을 수 없습니다");
            }

            //암호화된 파일 임시 저장
            File encryptedTempFile = File.createTempFile("encrypted-", ".tmp");

            //S3 객체의 내용을 임시 파일로 복사
            try (FileOutputStream fos = new FileOutputStream(encryptedTempFile)) {
                byte[] buffer = new byte[8192];
                int bytesRead;

                try (InputStream is = s3Object.getObjectContent()) {
                    while ((bytesRead = is.read(buffer)) != -1) {
                        fos.write(buffer, 0, bytesRead);
                    }
                }
            }

            //파일 복호화
            File decryptedFile = fileAes.decryptFile(encryptedTempFile, encryptedDek, iv);

            //임시 암호화 파일 삭제
            if (!encryptedTempFile.delete()) {
                String name = encryptedTempFile.getName();
                throw new CustomException(ErrorCode.FILE_DELETE_ERROR, "filename", name);
            }
            // 복호화된 파일이 존재하는지 확인
            if (!decryptedFile.exists()) {
                throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "file",
                        "복호화된 파일이 존재하지 않습니다: " + decryptedFile.getAbsolutePath());
            }

            return decryptedFile;
        } catch (AmazonS3Exception e) {
            log.error("S3 파일 다운로드 오류: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "S3 오류: ", e.getMessage());
        } catch (IOException e) {
            log.error("파일 I/O 처리 오류: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.FILE_CONVERT_ERROR, "파일 처리 중 오류 발생: ", e.getMessage());
        } catch (Exception e) {
            log.error("파일 처리 중 예상치 못한 오류: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "알 수 없는 오류: ", e.getMessage());
        }
    }

    //MultiFile을 파일객체로 변환
    private Optional<File> convert(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            log.warn("파일이 비어 있습니다.");
            return Optional.empty();
        }

        // 안전한 파일 이름으로 변환 (공백 제거, 특수문자 제거 등)
        String originalFilename = file.getOriginalFilename();
        String safeFilename = originalFilename != null
                ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_")
                : "unknown_" + UUID.randomUUID().toString();

        // 타임스탬프와 UUID를 결합하여 고유성 보장
        String uniqueFileName = System.currentTimeMillis() +
                "_" +
                UUID.randomUUID() +
                "_" +
                safeFilename;

        // 시스템의 임시 디렉토리 대신 명시적으로 지정된 디렉토리 사용
        File tempDir = new File(System.getProperty("java.io.tmpdir"), "file-uploads");
        if (!tempDir.exists()) {
            if (!tempDir.mkdirs()) {
                log.error("임시 디렉토리 생성 실패");
                throw new IOException("임시 디렉토리를 생성할 수 없습니다.");
            }
        }

        File convertFile = new File(tempDir, uniqueFileName);

        try {
            // 파일 쓰기 시 동기화 처리
            synchronized (this) {
                if (convertFile.exists()) {
                    log.warn("동일한 이름의 파일 존재: {}", convertFile.getAbsolutePath());
                    convertFile = new File(tempDir,
                            System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + safeFilename
                    );
                }

                if (!convertFile.createNewFile()) {
                    log.error("임시 파일 생성 실패");
                    return Optional.empty();
                }

                // 파일 쓰기
                try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                    fos.write(file.getBytes());
                    fos.flush();
                }
            }

            log.info("파일 변환 성공: {}, 크기: {} bytes", convertFile.getName(), convertFile.length());
            return Optional.of(convertFile);
        } catch (IOException e) {
            log.error("파일 변환 중 오류 발생 {}", e.getMessage(),e);
            throw new CustomException(ErrorCode.FILE_CONVERT_ERROR);
        }
    }

    // Service 호출 파일 키 추출 후 파일 다운로드 및 복호화
    public byte[] downloadAndDecryptFileToBytes(String s3Path) {
        String fileKey;
        File decryptedFile = null;

        try {
            // S3 URL에서 파일 키 추출
            if (s3Path.contains(PATH_SPLIT)) {
                fileKey = PATH_PREFIX + s3Path.split(PATH_SPLIT)[1];
            } else {
                throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "file", "잘못된 파일 경로 형식입니다: " + s3Path);
            }

            // 파일 다운로드 및 복호화
            decryptedFile = downloadAndDecryptFile(fileKey);

            // 파일이 존재하는지 확인
            if (!decryptedFile.exists()) {
                throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "file",
                        "복호화된 파일이 존재하지 않습니다: " + decryptedFile.getAbsolutePath());
            }

            // 파일 내용을 바이트 배열로 변환
            byte[] fileContent = java.nio.file.Files.readAllBytes(decryptedFile.toPath());

            // 임시 파일 삭제
            if (!decryptedFile.delete()) {
                String name = decryptedFile.getName();
                throw new CustomException(ErrorCode.FILE_DELETE_ERROR, "fileName", name);
            }

            return fileContent;
        } catch (Exception e) {
            // 예외 발생 시 임시 파일 정리
            if (decryptedFile != null && decryptedFile.exists()) {
                if (!decryptedFile.delete()) {
                    String name = decryptedFile.getName();
                    throw new CustomException(ErrorCode.FILE_DELETE_ERROR, "filename", name);
                }
            }
            log.error("파일 다운로드 및 복호화 중 오류 발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "file", "파일 다운로드 및 복호화 중 오류: " + e.getMessage());
        }
    }

    // S3에 업로드 된 파일 삭제
    public void deleteFileFromS3(String s3Path) {
        try {
            String fileKey;

            // S3 URL에서 파일 키 추출
            if (s3Path.contains(PATH_SPLIT)) {
                fileKey = PATH_PREFIX + s3Path.split(PATH_SPLIT)[1];
            } else {
                log.warn("잘못된 파일 경로 형식: {}", s3Path);
                throw new CustomException(ErrorCode.FILE_PATH_ERROR, "filePath", s3Path);
            }

            // S3에서 파일 삭제
            amazonS3.deleteObject(bucket, fileKey);
            log.info("파일 삭제 성공: {}", fileKey);

        } catch (AmazonS3Exception e) {
            log.error("S3 파일 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.FILE_DELETE_ERROR, "filePath", s3Path);
        } catch (Exception e) {
            log.error("파일 삭제 중 예상치 못한 오류 발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.FILE_DELETE_ERROR, "filePath", s3Path);
        }

    }
}
