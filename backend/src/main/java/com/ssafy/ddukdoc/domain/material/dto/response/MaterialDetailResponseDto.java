package com.ssafy.ddukdoc.domain.material.dto.response;

import com.ssafy.ddukdoc.domain.material.entity.DocumentEvidence;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Base64;

@Getter
@Builder
public class MaterialDetailResponseDto {
    @Schema(example = "1")
    private Integer materialId;
    @Schema(example = "계약서 첨부 자료")
    private String title;
    @Schema(example = "10")
    private Integer userId;
    @Schema(example = "홍길동")
    private String userName;
    @Schema(example = "https://example.com/files/contract_attachment.pdf")
    private String fileUrl;
    @Schema(example = "pdf")
    private String fileFormat;
    @Schema(example = "2023-05-15T14:30:00")
    private LocalDateTime createdAt;
    @Schema(example = "2023-05-15T14:30:00")
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
