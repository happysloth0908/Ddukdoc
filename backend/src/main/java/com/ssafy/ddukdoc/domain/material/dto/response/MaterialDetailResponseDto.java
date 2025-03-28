package com.ssafy.ddukdoc.domain.material.dto.response;

import com.ssafy.ddukdoc.domain.material.entity.DocumentEvidence;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.Base64;

@Getter
@Builder
public class MaterialDetailResponseDto {
    private Integer materialId;
    private String title;
    private Integer userId;
    private String userName;
    private String fileUrl;
    private String fileFormat;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MaterialDetailResponseDto of(DocumentEvidence material, byte[] fileBytes){
        return MaterialDetailResponseDto.builder()
                .materialId(material.getId())
                .title(material.getTitle())
                .userId(material.getUser().getId())
                .userName(material.getUser().getName())
                .fileUrl(Base64.getEncoder().encodeToString(fileBytes))
                .fileFormat(material.getMimeType())
                .createdAt(material.getCreatedAt())
                .updatedAt(material.getUpdatedAt())
                .build();
    }
}
