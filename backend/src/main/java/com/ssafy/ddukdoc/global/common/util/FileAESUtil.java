package com.ssafy.ddukdoc.global.common.util;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class FileAESUtil {
    private final AESUtil aesUtil;

    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;

    private byte[] generateIV() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }

    public Map<String,Object> encryptFile(File file){
        try{
            //DEK 생성
            SecretKey dek = aesUtil.generateDek();

            //IV 생성
            byte[] iv = generateIV();

            //파일 암호화
            File encryptedFile = encryptFileWithDek(file,dek,iv);

            //DEK 암호화
            String encryptedDek = aesUtil.encryptDek(dek);

            Map<String, Object> result = new HashMap<>();
            result.put("encryptedFile", encryptedFile);
            result.put("encryptedDek",encryptedDek);
            result.put("iv", Base64.getEncoder().encodeToString(iv));

            return result;
        }catch(Exception e){
            throw new CustomException(ErrorCode.ENCRYPTION_ERROR,"reason","파일 암호화 실패 : "+e.getMessage());
        }
    }

    //DEK 사용하여 파일 암호화
    private File encryptFileWithDek(File file, SecretKey dek, byte[] iv) throws Exception{
        File encryptedFile = new File(file.getParent(),file.getName()+".enc");

        try(FileInputStream fis = new FileInputStream(file);
            FileOutputStream fos = new FileOutputStream(encryptedFile)){

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH,iv);
            cipher.init(Cipher.ENCRYPT_MODE,dek,gcmSpec);

            // 버퍼 크기 8KB 설정
            byte[] buffer = new byte[8192];
            byte[] encryptedBuffer;
            int bytesRead;

            fos.write(iv);

            while((bytesRead = fis.read(buffer)) != -1){
                encryptedBuffer = cipher.update(buffer,0,bytesRead);
                if(encryptedBuffer != null){
                    fos.write(encryptedBuffer);
                }
            }

            //암호화 완료
            encryptedBuffer = cipher.doFinal();
            if(encryptedBuffer != null){
                fos.write(encryptedBuffer);
            }

            return encryptedFile;
        }

    }


}
