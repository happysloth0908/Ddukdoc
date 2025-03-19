package com.ssafy.ddukdoc.domain.document.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentSearchRequestDto {
    private Integer sendReceiveStatus;
    private Integer page;
    private String templateCode;
    private String keyword;
    private String status;
    private LocalDateTime createdAt;
}
