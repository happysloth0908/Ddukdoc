package com.ssafy.ddukdoc.global.common.util.pdfgenerator;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;

// 문서 생성기 인터페이스
public interface DocumentGenerator {
    void generateDocument(Document document,
                          List<DocumentFieldDto> fieldValues,
                          Map<Integer, byte[]> signatures,
                          PdfFont font) throws IOException;
}
