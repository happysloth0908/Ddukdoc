package com.ssafy.ddukdoc.domain.document.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DocumentListResponse {
    private List<DocumentList> sentDocuments;
    private List<DocumentList> receivedDocuments;
    private Integer pageNumber;
    private Integer totalPages;
    private Integer totalElements;
    private Integer pageSize;
    private boolean first;
    private boolean last;
}
