package com.ssafy.ddukdoc.superapp.util;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfDocumentInfo;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Slf4j
@Component
public class PdfMetadataProcessor implements MetadataProcessor{
    @Override
    public byte[] addMetadata(byte[] data, String docName) {
        try(PdfReader reader = new PdfReader(new ByteArrayInputStream(data));
            ByteArrayOutputStream modifiedPdfStream = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(modifiedPdfStream);
            PdfDocument pdfDocument = new PdfDocument(reader,writer);

            //메타데이터에 docName 추가
            PdfDocumentInfo info = pdfDocument.getDocumentInfo();
            info.setMoreInfo("docName",docName);

            pdfDocument.close();

            return modifiedPdfStream.toByteArray();
        }catch (IOException e){
            log.error("PDF 메타데이터 추가 중 오류 발생 : {}",e.getMessage());
            throw new CustomException(ErrorCode.FILE_METADATA_SAVE_ERROR,"PDF metadata",docName);
        }
    }
    @Override
    public boolean supportsExtension(String extension) {
        return "pdf".equalsIgnoreCase(extension);
    }
}
