package com.ssafy.ddukdoc.domain.document.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;

public enum DocumentStatus {
    WAITING("서명 대기"),
    SIGNED("서명 완료"),
    RETURNED("반송"),
    DELETED("삭제");

    private final String description;

    DocumentStatus(String description){
        this.description = description;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }
}