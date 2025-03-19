package com.ssafy.ddukdoc.domain.document.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
public class DocumentSearchRequestDto {
    private Integer sendReceiveStatus;
    private Integer page;
    private String templateCode;
    private String keyword;
    private String status;
    private LocalDateTime createdAt;
}
