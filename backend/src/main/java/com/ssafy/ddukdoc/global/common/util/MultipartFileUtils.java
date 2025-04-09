package com.ssafy.ddukdoc.global.common.util;

import lombok.experimental.UtilityClass;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;

@UtilityClass
public class MultipartFileUtils {
    public MultipartFile createMultipartFile(
            String name,
            String originalFilename,
            String contentType,
            byte[] content
    ) {
        return new MultipartFile() {
            @Override
            public String getName() { return name; }

            @Override
            public String getOriginalFilename() { return originalFilename; }

            @Override
            public String getContentType() { return contentType; }

            @Override
            public boolean isEmpty() { return content == null || content.length == 0; }

            @Override
            public long getSize() { return content.length; }

            @Override
            public byte[] getBytes() { return content; }

            @Override
            public InputStream getInputStream() { return new ByteArrayInputStream(content); }

            @Override
            public void transferTo(File dest) throws IOException, IllegalStateException {
                try (FileOutputStream fos = new FileOutputStream(dest)) {
                    fos.write(content);
                }
            }
        };
    }
}