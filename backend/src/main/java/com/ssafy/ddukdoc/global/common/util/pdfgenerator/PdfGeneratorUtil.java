package com.ssafy.ddukdoc.global.common.util.pdfgenerator;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.global.common.util.HashUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Slf4j
@Component
@RequiredArgsConstructor
public class PdfGeneratorUtil {

    private static final String FONT_NAME = "fonts/malgun.ttf";
    private static final float MARGIN = 50; //문서 여백
    private final HashUtil hashUtil;
    private final ResourceLoader resourceLoader;

    /**
     * 템플릿 코드와 필드 값, 서명 데이터를 기반으로 PDF를 생성합니다.
     *
     * @param templateCode  템플릿 코드 (ex: G1 - 차용증)
     * @param fieldValues   문서 필드 값 리스트
     * @param signatures    역할 ID별 서명 이미지 맵
     * @param transactionId PDF 메타데이터에 포함될 블록체인 트랜잭션 ID (null일 경우 포함하지 않음)
     * @return PDF 데이터가 포함된 ByteArrayOutputStream
     * @throws IOException 파일 작업 중 오류 발생 시
     */
    public ByteArrayOutputStream generatePdf(TemplateCode templateCode,
                                             List<DocumentFieldDto> fieldValues,
                                             Map<Integer, byte[]> signatures,
                                             String transactionId) throws IOException {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            log.debug("한글 폰트 설정 시작");
            // 리소스 로더를 통해 폰트 파일 접근
            Resource fontResource = resourceLoader.getResource("classpath:" + FONT_NAME);

            PdfFont font;
            try (InputStream fontStream = fontResource.getInputStream()) {
                if (fontResource.exists()) {
                    log.debug("폰트 파일 발견: {}", fontResource.getFilename());
                    byte[] fontBytes = fontStream.readAllBytes(); // byte 배열 변환
                    font = PdfFontFactory.createFont(fontBytes, PdfEncodings.IDENTITY_H); // byte[] 방식
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
        } catch (IOException e) {
            log.error("PDF 생성 실패: {} - DOC TYPE: {} ",
                    e.getMessage(),
                    templateCode,
                    e);
            throw new CustomException(ErrorCode.PDF_GENERATION_ERROR, "reason", e.getMessage());
        }
    }

    /**
     * 메타데이터 없이 PDF를 생성하고 해시값을 계산합니다.
     *
     * @param templateCode 템플릿 코드
     * @param fieldValues  문서 필드 값 리스트
     * @param signatures   역할 ID별 서명 이미지 맵
     * @return 생성된 PDF와 해시값을 포함한 결과 객체
     */
    public Map<String,Object> generatePdfNoData(TemplateCode templateCode,
                                    List<DocumentFieldDto> fieldValues,
                                    Map<Integer, byte[]> signatures) {
        try {
            // generatePdf() 메서드 호출 시 IOException 처리
            ByteArrayOutputStream pdfStream = generatePdf(templateCode, fieldValues, signatures, null);
            byte[] pdfData = pdfStream.toByteArray();

            Map<String,Object> result = new HashMap<>();
            String docName = generateUniqueDocName(templateCode);

            result.put("pdfData",addPdfMetadata(pdfData,docName));
            result.put("docName",docName);

            //metadata에 docName 추가 후 전달
            return result;

        } catch (IOException e) {
            throw new CustomException(ErrorCode.PDF_GENERATION_ERROR, "Metadata addition failed", e.getMessage());
        }
    }

    public byte[] addPdfMetadata(byte[] pdfData,String docName) {
        // PDF 메타데이터에 해시값 추가
        try (PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfData));
             ByteArrayOutputStream modifiedPdfStream = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(modifiedPdfStream);
            PdfDocument pdfDocument = new PdfDocument(reader, writer);

            // 메타데이터에 해시값 추가
            PdfDocumentInfo info = pdfDocument.getDocumentInfo();
            info.setMoreInfo("docName", docName);

            pdfDocument.close();

            return modifiedPdfStream.toByteArray();
        } catch (IOException e) {
            throw new CustomException(ErrorCode.PDF_GENERATION_ERROR, "Metadata addition failed", e.getMessage());
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
