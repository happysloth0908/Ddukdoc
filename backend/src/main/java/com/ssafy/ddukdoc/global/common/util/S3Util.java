package com.ssafy.ddukdoc.global.common.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class S3Util {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadFile(MultipartFile multipartFile, String dirName){
        try {
            File uploadFile = convert(multipartFile)
                    .orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File 변환 실패"));

            return upload(uploadFile, dirName);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR,"dirName",dirName);
        }
    }

    private String upload(File uploadFile, String dirName){
        String fileName = "eftoj1/"+dirName +"/"+ UUID.randomUUID() + "-"+uploadFile.getName();

        String uploadImageUrl = putS3(uploadFile,fileName);

        // 로컬에 생성한 파일 삭제
        uploadFile.delete();
        return uploadImageUrl;
    }

    private String putS3(File uploadFile, String fileName){
        amazonS3.putObject(new PutObjectRequest(bucket,fileName,uploadFile)
                .withCannedAcl(CannedAccessControlList.PublicRead));
        return amazonS3.getUrl(bucket,fileName).toString();
    }


    //파일 변환
    private Optional<File> convert(MultipartFile file) throws IOException{
        if (file == null || file.isEmpty()) {
            System.err.println("파일이 비어 있습니다.");
            return Optional.empty();
        }

        // 안전한 파일 이름으로 변환 (공백 제거, 특수문자 제거 등)
        String originalFilename = file.getOriginalFilename();
        String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
        File convertFile = new File(System.getProperty("java.io.tmpdir")+"/",safeFilename);

        if(convertFile.exists()){
            convertFile.delete();
        }
        if(convertFile.createNewFile()){
            try(FileOutputStream fos = new FileOutputStream(convertFile)){
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }
}
