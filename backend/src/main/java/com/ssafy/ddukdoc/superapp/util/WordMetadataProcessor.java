package com.ssafy.ddukdoc.superapp.util;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ooxml.POIXMLProperties;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.openxmlformats.schemas.officeDocument.x2006.customProperties.CTProperty;
import org.openxmlformats.schemas.officeDocument.x2006.customProperties.CTProperties;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Slf4j
@Component
public class WordMetadataProcessor implements MetadataProcessor {
    @Override
    public byte[] addMetadata(byte[] fileData, String docName) {
        try {
            // Word 문서 로드
            ByteArrayInputStream input = new ByteArrayInputStream(fileData);
            XWPFDocument document = new XWPFDocument(input);

            // 코어 속성 업데이트 (기본 메타데이터)
            POIXMLProperties properties = document.getProperties();
            POIXMLProperties.CoreProperties coreProps = properties.getCoreProperties();
            coreProps.setTitle(docName);
            coreProps.setCreator("SSAFY-DDUKDOC");
            coreProps.setDescription("Document registered with SSAFY-DDUKDOC system");

            // 커스텀 속성 추가
            POIXMLProperties.CustomProperties customProps = properties.getCustomProperties();
            if (customProps != null) {
                addCustomProperty(customProps, "docName", docName);
            } else {
                log.warn("커스텀 프로퍼티 지원 안 됨. 코어 프로퍼티만 업데이트됨.");
            }

            // 변경된 문서 저장
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            document.write(output);
            document.close();

            return output.toByteArray();
        } catch (IOException e) {
            log.error("Word 메타데이터 추가 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.FILE_METADATA_SAVE_ERROR, "Word metadata", docName);
        }
    }

    private void addCustomProperty(POIXMLProperties.CustomProperties customProps, String name, String value) {
        // 기존 속성이 있으면 업데이트, 없으면 추가
        CTProperties ctProps = customProps.getUnderlyingProperties();
        CTProperty ctProperty = null;

        // 기존 속성 찾기
        for (int i = 0; i < ctProps.sizeOfPropertyArray(); i++) {
            CTProperty prop = ctProps.getPropertyArray(i);
            if (name.equals(prop.getName())) {
                ctProperty = prop;
                break;
            }
        }

        // 속성이 없으면 새로 생성
        if (ctProperty == null) {
            ctProperty = ctProps.addNewProperty();
            ctProperty.setName(name);
            ctProperty.setFmtid("{D5CDD505-2E9C-101B-9397-08002B2CF9AE}");
            ctProperty.setPid(ctProps.sizeOfPropertyArray());
        }

        // 문자열 값 설정
        ctProperty.setLpwstr(value);
    }

    @Override
    public boolean supportsExtension(String extension) {
        return "docx".equalsIgnoreCase(extension) || "doc".equalsIgnoreCase(extension);
    }
}