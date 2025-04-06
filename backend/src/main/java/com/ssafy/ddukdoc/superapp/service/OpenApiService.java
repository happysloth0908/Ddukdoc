package com.ssafy.ddukdoc.superapp.service;

import com.ssafy.ddukdoc.domain.contract.dto.response.BlockchainDocumentResponseDto;
import com.ssafy.ddukdoc.global.common.util.HashUtil;
import com.ssafy.ddukdoc.global.common.util.blockchain.BlockchainUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OpenApiService {

    private final BlockchainUtil blockchainUtil;
    private final HashUtil hashUtil;
    private final FileValidationService fileValidationService;

    /**
     * SUPER APP 위변조 검증
     * @param file 검증할 파일 (PDF, WORD, PNG)
     */
    public void validationFile(MultipartFile file) {

        try{
            // 빈 파일인지 확인
            if(file == null || file.isEmpty()){
                throw new CustomException(ErrorCode.MATERIAL_UPLOAD_ERROR);
            }

            // 메타데이터에서 docName 추출
            String docName = fileValidationService.extractDocName(file);

            // docName으로 블록체인 Hash 조회
            BlockchainDocumentResponseDto blockchainDto = blockchainUtil.getDocumentByName(docName);

            String fileHash = "0x" + hashUtil.generateSHA256Hash(file.getBytes());
        } catch (IOException e) {
            log.error("파일 검증 오류: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.VALDIATION_ERROR, "reason", e.getCause());
        }
    }
}
