package com.ssafy.ddukdoc.domain.verification.service;

import com.ssafy.ddukdoc.domain.contract.dto.response.BlockchainDocumentResponseDto;
import com.ssafy.ddukdoc.global.common.util.HashUtil;
import com.ssafy.ddukdoc.global.common.util.blockchain.BlockchainUtil;
import com.ssafy.ddukdoc.global.common.util.pdfgenerator.PdfGeneratorUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VerificationService {

    private final BlockchainUtil blockchainUtil;
    private final PdfGeneratorUtil pdfGeneratorUtil;
    private final HashUtil hashUtil;

    public void documentVerification(MultipartFile pdfFile) {

        try {
            PDDocument document = PDDocument.load(pdfFile.getInputStream());
            PDDocumentInformation info = document.getDocumentInformation();

            // PDF 파일에 docName 있는지 확인
            String docName = info.getCustomMetadataValue("docName");
            if (docName == null || docName.trim().isEmpty()) {
                document.close();
                throw new CustomException(ErrorCode.FILE_METADATA_ERROR);
            }

            // docName으로 블록체인 Hash값 조회
            BlockchainDocumentResponseDto blockchainResponseDto = blockchainUtil.getDocumentByName(docName);
            log.info("삭제하기 전 PDF hash {}",hashUtil.generateSHA256Hash(pdfFile.getBytes()));

            // pdf 파일 메타데이터 삭제
            byte[] deleteContent = pdfGeneratorUtil.deletePdfMetadataWithPDFBox(pdfFile.getBytes());


            // PDF Meta data로 hash 생성
            String pdfHash = "0x" + hashUtil.generateSHA256Hash(deleteContent);
            log.info("원본 Hash {}, 제거한 Hash {}", blockchainResponseDto.getDocHash(), pdfHash);

            // 블록체인 Hash값과 PDF Hash 비교
            if (!pdfHash.equals(blockchainResponseDto.getDocHash())) {
                throw new CustomException(ErrorCode.VALIDATION_NOT_MATCH, "docName", docName);
            }

        } catch (IOException e) {
            log.error("문서 검증 중 오류발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.VALDIATION_ERROR, "reason", e.getCause());
        }
    }
}
