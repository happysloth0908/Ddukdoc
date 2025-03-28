package com.ssafy.ddukdoc.global.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class CustomPage<T> {
    private final List<T> content;
    @Schema(example = "1")
    private final int pageNumber;
    @Schema(example = "3")
    private final int totalPages;
    @Schema(example = "10")
    private final long totalElements;
    @Schema(example = "5")
    private final int pageSize;
    @Schema(example = "true")
    private final boolean first;
    @Schema(example = "false")
    private final boolean last;

    public CustomPage(Page<T> page) {
        this.content = page.getContent();
        this.pageNumber = page.getNumber() + 1;
        this.totalPages = page.getTotalPages();
        this.totalElements = page.getTotalElements();
        this.pageSize = page.getSize();
        this.first = page.isFirst();
        this.last = page.isLast();
    }
}
