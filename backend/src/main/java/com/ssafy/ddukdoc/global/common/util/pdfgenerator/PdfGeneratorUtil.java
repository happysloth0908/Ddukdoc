package com.ssafy.ddukdoc.global.common.util.pdfgenerator;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfDocumentInfo;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.ssafy.ddukdoc.domain.contract.dto.BlockchainSaveResult;
import com.ssafy.ddukdoc.domain.contract.dto.request.BlockChainStoreRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.global.common.util.HashUtil;
import com.ssafy.ddukdoc.global.common.util.blockchain.BlockchainUtil;
import com.ssafy.ddukdoc.global.common.util.blockchain.SignatureUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Slf4j
@Component
@RequiredArgsConstructor
public class PdfGeneratorUtil {

    @Value("${blockchain.address}")
    private String requestor;

    @Value("${blockchain.private-key}")
    private String privateKey;

    private static final String FONT_NAME = "fonts/malgun.ttf";
    private static final float MARGIN = 50; //문서 여백
    private final HashUtil hashUtil;
    private final ResourceLoader resourceLoader;
    private final SignatureUtil signatureUtil;
    private final BlockchainUtil blockchainUtil;

    /**
     * 템플릿 코드와 필드 값, 서명 데이터를 기반으로 PDF를 생성합니다.
     *
     * @param templateCode 템플릿 코드 (ex: G1 - 차용증)
     * @param fieldValues 문서 필드 값 리스트
     * @param signatures 역할 ID별 서명 이미지 맵
     * @param transactionId PDF 메타데이터에 포함될 블록체인 트랜잭션 ID (null일 경우 포함하지 않음)
     * @return PDF 데이터가 포함된 ByteArrayOutputStream
     * @throws IOException 파일 작업 중 오류 발생 시
     */
    public ByteArrayOutputStream generatePdf(TemplateCode templateCode,
                                                    List<DocumentFieldDto> fieldValues,
                                                    Map<Integer, byte[]> signatures,
                                                    String transactionId) throws IOException {
        try{
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            log.debug("한글 폰트 설정 시작");
            // 리소스 로더를 통해 폰트 파일 접근
            Resource fontResource = resourceLoader.getResource("classpath:" + FONT_NAME);

            PdfFont font;
            try {
                // 폰트 파일 로드 시도
                if (fontResource.exists()) {
                    log.debug("폰트 파일 발견: {}", fontResource.getFilename());
                    font = PdfFontFactory.createFont(fontResource.getFile().getAbsolutePath(), PdfEncodings.IDENTITY_H);
                } else {
                    log.error("폰트 파일을 찾을 수 없음: {}", FONT_NAME);
                    throw new IOException("폰트 파일을 찾을 수 없음: " + FONT_NAME);
                }
            } catch (Exception e) {
                log.error("폰트 로딩 실패: {}", e.getMessage());
                throw new IOException("폰트 로딩 실패: " + e.getMessage());
            }

            document.setFont(font);
            document.setMargins(MARGIN, MARGIN, MARGIN, MARGIN);
            log.debug("한글 폰트 설정 완료");

            // PDF 메타데이터에 블록체인 트랜잭션 ID 추가 (ID가 존재할 경우)
            if (transactionId != null && !transactionId.isEmpty()) {
                PdfDocumentInfo info = pdf.getDocumentInfo();
                info.setMoreInfo("transactionId", transactionId);
            }

            // 템플릿 코드에 맞는 문서 생성기 가져오기
            DocumentGenerator generator = DocumentGeneratorFactory.getGenerator(templateCode);

            // 문서 생성
            generator.generateDocument(document, fieldValues, signatures, font);

            document.close();
            return outputStream;
        }catch (IOException e){
            log.error("PDF 생성 실패: {} - DOC TYPE: {} ",
                    e.getMessage(),
                    templateCode,
                    e);
            throw new CustomException(ErrorCode.PDF_GENERATION_ERROR,"reason",e.getMessage());
        }
    }

    /**
     * PDF 바이너리 데이터의 해시값 생성
     *
     * @param pdfData PDF 바이너리 데이터
     * @return SHA-256 해시값
     */
    public String generatePdfHash(byte[] pdfData) {
        return hashUtil.generateSHA256Hash(pdfData);
    }

    /**
     * 메타데이터 없이 PDF를 생성하고 해시값을 계산합니다.
     *
     * @param templateCode 템플릿 코드
     * @param fieldValues 문서 필드 값 리스트
     * @param signatures 역할 ID별 서명 이미지 맵
     * @return 생성된 PDF와 해시값을 포함한 결과 객체
     */
    public byte[] generatePdfForHash(TemplateCode templateCode,
                                            List<DocumentFieldDto> fieldValues,
                                            Map<Integer, byte[]> signatures) {
        try {
            // generatePdf() 메서드 호출 시 IOException 처리
            ByteArrayOutputStream pdfStream = generatePdf(templateCode, fieldValues, signatures, null);
            byte[] pdfData = pdfStream.toByteArray();

            // PDF 데이터의 해시값 계산
            String hash = generatePdfHash(pdfData);
            String docHashWithPrefix = "0x" + hash; // 0x 접두사 추가

            //서명 생성 후 블록체인 저장
            BlockchainSaveResult saveResponse = saveDocumentinBlockchain(pdfData,templateCode,docHashWithPrefix);

            // PDF 메타데이터에 해시값 추가
            try (PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfData));
                 ByteArrayOutputStream modifiedPdfStream = new ByteArrayOutputStream()) {

                PdfWriter writer = new PdfWriter(modifiedPdfStream);
                PdfDocument pdfDocument = new PdfDocument(reader, writer);

                // 메타데이터에 해시값 추가
                PdfDocumentInfo info = pdfDocument.getDocumentInfo();
                info.setMoreInfo("TransactionId",saveResponse.getTransactionHash());
                info.setMoreInfo("docName",saveResponse.getDocumentName());

                pdfDocument.close();

                return modifiedPdfStream.toByteArray();
            } catch (IOException e) {
                throw new CustomException(ErrorCode.PDF_GENERATION_ERROR, "Metadata addition failed", e.getMessage());
            }
        } catch (IOException e) {
            // generatePdf() 메서드에서 발생하는 IOException 처리
            throw new CustomException(ErrorCode.PDF_GENERATION_ERROR, "PDF generation failed", e.getMessage());
        }
    }

    private BlockchainSaveResult saveDocumentinBlockchain(byte[] pdfData,TemplateCode templateCode, String hash){
        log.error("saveDocumentinBlockchain 메서드 시작"); // 이 줄이 출력되는지 확인

        try{
            // 문서 이름 생성
            String docName = generateUniqueDocName(templateCode);
            // 서명 생성
            String signature = signatureUtil.createSignature(requestor, docName, "", hash, privateKey);
            // 블록체인 객체 생성
            BlockChainStoreRequestDto storeData = new BlockChainStoreRequestDto(requestor,docName,"",hash,signature);

            // 블록체인 API 호출
            Map<String, Object> blockchainResponse = blockchainUtil.storeDocument(storeData);
            // 블록체인 트랜잭션 ID 추출
            String transactionHash = (String) blockchainResponse.get("transactionHash");

            return new BlockchainSaveResult(pdfData,transactionHash,hash,docName,blockchainResponse);
        }catch(Exception e){
            throw new CustomException(ErrorCode.BLOCKCHAIN_SIGNATURE_ERROR,"reason",e.getMessage());
        }

    }

    /**
     * 유니크한 문서 이름을 생성합니다.
     *
     * @param templateCode 템플릿 코드
     * @return 유니크한 문서 이름
     */
    private String generateUniqueDocName(TemplateCode templateCode) {
        // UUID + 템플릿 코드 + 타임스탬프 조합으로 유니크한 이름 생성
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String timestamp = String.valueOf(System.currentTimeMillis());
        return templateCode.name() + "_" + uuid + "_" + timestamp;
    }

}
