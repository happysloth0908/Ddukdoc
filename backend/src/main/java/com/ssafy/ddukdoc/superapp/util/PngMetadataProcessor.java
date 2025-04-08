package com.ssafy.ddukdoc.superapp.util;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.imageio.*;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.metadata.IIOMetadataNode;
import javax.imageio.stream.ImageOutputStream;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Slf4j
@Component
public class PngMetadataProcessor implements MetadataProcessor {
    @Override
    public byte[] addMetadata(byte[] fileData, String docName) {
        try {
            // 이미지 읽기
            ByteArrayInputStream input = new ByteArrayInputStream(fileData);
            BufferedImage image = ImageIO.read(input);
            if (image == null) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE,"reason","파일이 없습니다.");
            }
            // PNG용 ImageWriter 얻기
            ImageWriter writer = ImageIO.getImageWritersByFormatName("png").next();
            ImageWriteParam writeParam = writer.getDefaultWriteParam();
            // 이미지 타입 지정
            ImageTypeSpecifier typeSpecifier = ImageTypeSpecifier.createFromRenderedImage(image);
            IIOMetadata metadata = writer.getDefaultImageMetadata(typeSpecifier, writeParam);

            // 메타데이터에 텍스트 추가 (docName)
            String metaFormat = "javax_imageio_png_1.0";
            IIOMetadataNode textEntry = new IIOMetadataNode("tEXtEntry");
            textEntry.setAttribute("keyword", "docName");
            textEntry.setAttribute("value", docName);

            IIOMetadataNode text = new IIOMetadataNode("tEXt");
            text.appendChild(textEntry);

            IIOMetadataNode root = new IIOMetadataNode(metaFormat);
            root.appendChild(text);

            // 기존 메타데이터와 병합
            metadata.mergeTree(metaFormat, root);

            // 이미지를 PNG 형식으로 다시 쓰기 (메타데이터 포함)
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            try (ImageOutputStream ios = ImageIO.createImageOutputStream(output)) {
                writer.setOutput(ios);
                writer.write(metadata, new IIOImage(image, null, metadata), writeParam);
            }
            writer.dispose();

            return output.toByteArray();

        } catch (IOException e) {
            log.error("PNG 메타데이터 추가 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.FILE_METADATA_SAVE_ERROR, "PNG metadata", docName);
        }
    }

    @Override
    public boolean supportsExtension(String extension) {
        return "png".equalsIgnoreCase(extension);
    }
}