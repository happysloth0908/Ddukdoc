package com.ssafy.ddukdoc.superapp.service;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.poi.ooxml.POIXMLProperties;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.openxmlformats.schemas.officeDocument.x2006.customProperties.CTProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FileValidationService {

    private static final List<String> SUPPORTED_MIME_TYPES = Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/png"
    );

    public String extractDocName(MultipartFile file) throws IOException {

        String contentType = file.getContentType();

        if (contentType == null || !SUPPORTED_MIME_TYPES.contains(contentType)) {
            throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT);
        }

        return switch (contentType) {
            case "application/pdf" -> extractPdfDocName(file);
            case "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> extractWordDocName(file);
            case "image/png" -> extractPngDocName(file);
            default -> throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT);
        };
    }

    private String extractPdfDocName(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDDocumentInformation info = document.getDocumentInformation();
            return info.getCustomMetadataValue("docName");
        }
    }

    private String extractWordDocName(MultipartFile file) throws IOException {
        try(XWPFDocument document = new XWPFDocument(file.getInputStream())){
            POIXMLProperties properties = document.getProperties();
            if (properties.getCustomProperties() != null) {
                CTProperty property = properties.getCustomProperties().getProperty("docName");
                return property.getLpwstr();
            }
        }
        throw new CustomException(ErrorCode.FILE_METADATA_ERROR);
    }

    private String extractPngDocName(MultipartFile file) {
        throw new CustomException(ErrorCode.FILE_METADATA_ERROR);
    }


}
