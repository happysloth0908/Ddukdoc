package com.ssafy.ddukdoc.global.common;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class CustomPage<T> {
    private final List<T> content;
    private final int pageNumber;
    private final int totalPages;
    private final long totalElements;
    private final int pageSize;
    private final boolean first;
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
