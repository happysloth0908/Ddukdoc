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
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.stream.ImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FileValidationService {

    public String extractDocName(MultipartFile file) throws IOException {

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT);
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();

        return switch (extension) {
            case "pdf" -> extractPdfDocName(file);
            case "doc", "docx" -> extractWordDocName(file);
            case "png" -> extractPngDocName(file);
            default -> throw new CustomException(ErrorCode.MATERIAL_INVALID_FORMAT);
        };
    }

    private String extractPdfDocName(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDDocumentInformation info = document.getDocumentInformation();
            return info.getCustomMetadataValue("docName");
        } catch (IOException e) {
            throw new CustomException(ErrorCode.VALIDATION_ERROR);
        }
    }

    private String extractWordDocName(MultipartFile file) {
        try(XWPFDocument document = new XWPFDocument(file.getInputStream())){
            POIXMLProperties properties = document.getProperties();
            if (properties.getCustomProperties() != null) {
                CTProperty property = properties.getCustomProperties().getProperty("docName");
                return property.getLpwstr();
            }
            throw new CustomException(ErrorCode.FILE_METADATA_ERROR);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.VALIDATION_ERROR);
        }
    }

    private String extractPngDocName(MultipartFile file) {
        try(ByteArrayInputStream input = new ByteArrayInputStream(file.getBytes());
            ImageInputStream imageInputStream = ImageIO.createImageInputStream(input)){

            Iterator<ImageReader> readers = ImageIO.getImageReadersByFormatName("png");
            if (!readers.hasNext()) {
                throw new CustomException(ErrorCode.PNG_READER_NOT_FOUND);
            }
            ImageReader reader = readers.next();
            reader.setInput(imageInputStream, true);
            IIOMetadata metadata = reader.getImageMetadata(0);

            // PNG의 표준 메타데이터 형식
            String metaFormat = "javax_imageio_png_1.0";
            Node root = metadata.getAsTree(metaFormat);

            return findDocNameInNode(root);
        } catch (IOException e){
            throw new CustomException(ErrorCode.VALIDATION_ERROR, "message", e.getMessage());
        }
    }

    private String findDocNameInNode(Node node) {
        if ("tEXtEntry".equals(node.getNodeName())) {
            NamedNodeMap attributes = node.getAttributes();
            Node keywordAttr = attributes.getNamedItem("keyword");
            if (keywordAttr != null && "docName".equals(keywordAttr.getNodeValue())) {
                Node valueAttr = attributes.getNamedItem("value");
                if (valueAttr != null) {
                    return valueAttr.getNodeValue();
                }
            }
        }
        // 자식 노드를 순회하며 검색
        for (Node child = node.getFirstChild(); child != null; child = child.getNextSibling()) {
            String result = findDocNameInNode(child);
            if (result != null) {
                return result;
            }
        }
        return null;
    }

}
