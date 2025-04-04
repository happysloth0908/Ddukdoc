package com.ssafy.ddukdoc.global.common.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class S3Util {
    private final AmazonS3 amazonS3;
    private final FileAESUtil fileAesUtil;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    //multipartFile 암호화 후 S3에 업로드
    public String uploadEncryptedFile(MultipartFile multipartFile, String dirName){
        try{
            //MultipartFile을 File 객체로 변환 후 S3에 업로드
            File originalFile = convert(multipartFile)
                    .orElseThrow(()-> new CustomException(ErrorCode.FILE_CONVERT_ERROR));
            // 파일 암호화
            Map<String, Object> encryptionResult = fileAesUtil.encryptFile(originalFile);
            File encryptedFile = (File) encryptionResult.get("encryptedFile");
            String encryptedDek = (String) encryptionResult.get("encryptedDek");
            String iv = (String) encryptionResult.get("iv");

            // 암호화된 파일 업로드
            String uploadUrl = uploadEncryptedFile(encryptedFile, dirName,encryptedDek,iv);

            // 로컬 임시 파일 삭제
            if (!originalFile.delete()) {
                String name = originalFile.getName();
                throw new CustomException(ErrorCode.FILE_DELETE_ERROR,"OriginalFileName",name);
            }
            if(!encryptedFile.delete()){
                String name = encryptedFile.getName();
                throw new CustomException(ErrorCode.FILE_DELETE_ERROR,"encryptedFileFileName",name);
            }


            return uploadUrl;
        }catch(Exception e){
            log.error("파일 암호화 업로드 중 오류 발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR,"dirName",dirName);
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
            File decryptedFile = fileAesUtil.decryptFile(encryptedTempFile, encryptedDek, iv);

            //임시 암호화 파일 삭제
            if(encryptedTempFile.delete()){
                String name = encryptedTempFile.getName();
                throw new CustomException(ErrorCode.FILE_DELETE_ERROR,"filename",name);
            }
            // 복호화된 파일이 존재하는지 확인
            if (!decryptedFile.exists()) {
                throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "file",
                        "복호화된 파일이 존재하지 않습니다: " + decryptedFile.getAbsolutePath());
            }

            return decryptedFile;
        } catch (AmazonS3Exception e) {
            e.printStackTrace();
            // S3 자체 에러 처리
            throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "S3 오류: ", e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            // 파일 저장/복사 관련 I/O 에러
            throw new CustomException(ErrorCode.FILE_CONVERT_ERROR, "파일 처리 중 오류 발생: ", e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            // 그 외 알 수 없는 예외 처리
            throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "알 수 없는 오류: ", e.getMessage());
        }
    }
    // 암호화 안하고 s3 업로드
    public String uploadFile(MultipartFile multipartFile, String dirName){
        try {
            File uploadFile = convert(multipartFile)
                    .orElseThrow(() -> new CustomException(ErrorCode.FILE_CONVERT_ERROR));

            return upload(uploadFile, dirName);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR,"dirName",dirName);
        }
    }
    //암호화된 File을 S3에 업로드
    private String uploadEncryptedFile(File encryptedFile, String dirName, String encryptedDek,String iv){
        String fileName = "eftoj1/" + dirName + "/" + UUID.randomUUID() + "-encrypted-" + encryptedFile.getName();

        //메타데이터에 암호화된 dek, iv 저장
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.addUserMetadata("encrypted-dek", encryptedDek);
        metadata.addUserMetadata("iv", iv);

        //S3에 암호화된 파일 업로드
        amazonS3.putObject(new PutObjectRequest(bucket, fileName, encryptedFile)
                .withMetadata(metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        return amazonS3.getUrl(bucket, fileName).toString();
    }
    //일반 파일을 S3에 업로드
    private String upload(File uploadFile, String dirName){
        String fileName = "eftoj1/"+dirName +"/"+ UUID.randomUUID() + "-"+uploadFile.getName();

        //s3에 파일 업로드
        amazonS3.putObject(new PutObjectRequest(bucket,fileName,uploadFile)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        if(uploadFile.delete()){
            String name = uploadFile.getName();

            throw new CustomException(ErrorCode.FILE_DELETE_ERROR,"FileName",name);
        }

        return amazonS3.getUrl(bucket,fileName).toString();
    }

    //MultiFile을 파일객체로 변환
    private Optional<File> convert(MultipartFile file) throws IOException{
        if (file == null || file.isEmpty()) {
            log.warn("파일이 비어 있습니다.");
            return Optional.empty();
        }

        // 안전한 파일 이름으로 변환 (공백 제거, 특수문자 제거 등)
        String originalFilename = file.getOriginalFilename();
        String safeFilename = originalFilename != null
                ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_")
                : "unknown_" + UUID.randomUUID().toString();
        File convertFile = new File(System.getProperty("java.io.tmpdir")+"/",safeFilename);

        if(convertFile.exists()){
            if(convertFile.delete()){
                String name = convertFile.getName();
                throw new CustomException(ErrorCode.FILE_DELETE_ERROR,"fileName",name);
            }
        }
        if(convertFile.createNewFile()){
            try(FileOutputStream fos = new FileOutputStream(convertFile)){
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }
    // Service 호출 파일 키 추출 후 파일 다운로드 및 복호화
    public byte[] downloadAndDecryptFileToBytes(String s3Path) {
        String fileKey;
        File decryptedFile = null;

        try {
            // S3 URL에서 파일 키 추출
            if (s3Path.contains("/eftoj1/")) {
                fileKey = "eftoj1/" + s3Path.split("/eftoj1/")[1];
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
            if(decryptedFile.delete()){
                String name = decryptedFile.getName();
                throw new CustomException(ErrorCode.FILE_DELETE_ERROR,"fileName",name);
            }

            return fileContent;
        } catch (Exception e) {
            // 예외 발생 시 임시 파일 정리
            if (decryptedFile != null && decryptedFile.exists()) {
                if(decryptedFile.delete()){
                    String name = decryptedFile.getName();
                    throw new CustomException(ErrorCode.FILE_DELETE_ERROR,"filename",name);
                }
            }
            e.printStackTrace();
            throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "file", "파일 다운로드 및 복호화 중 오류: " + e.getMessage());
        }
    }

    // S3에 업로드 된 파일 삭제
    public void deleteFileFromS3(String s3Path){
        try{
            String fileKey;

            // S3 URL에서 파일 키 추출
            if (s3Path.contains("/eftoj1/")) {
                fileKey = "eftoj1/" + s3Path.split("/eftoj1/")[1];
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
