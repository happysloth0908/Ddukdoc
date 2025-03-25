package com.ssafy.ddukdoc.domain.document.entity;

import com.fasterxml.jackson.annotation.JsonValue;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;

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

    public static DocumentStatus getInitialStatus(TemplateCode templateCode) {
        return templateCode.name().startsWith("G") ?
                WAITING :
                SIGNED;
    }
}