package com.ssafy.ddukdoc.domain.material.dto.response;

import com.ssafy.ddukdoc.domain.material.entity.DocumentEvidence;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MaterialListResponseDto {
    private Integer id;
    private String title;
    private Integer userId;
    private String userName;
    private String format;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public static MaterialListResponseDto of(DocumentEvidence documentEvidence){
        return MaterialListResponseDto.builder()
                .id(documentEvidence.getId())
                .title(documentEvidence.getTitle())
                .userId(documentEvidence.getUser().getId())
                .userName(documentEvidence.getUser().getName())
                .format(documentEvidence.getMimeType())
                .createdAt(documentEvidence.getCreatedAt())
                .updatedAt(documentEvidence.getUpdatedAt())
                .build();
    }
}
