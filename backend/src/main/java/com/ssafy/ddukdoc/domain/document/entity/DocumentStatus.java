package com.ssafy.ddukdoc.domain.document.entity;

import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;

public enum DocumentStatus {
    WAITING,   // 서명 대기
    SIGNED,    // 서명 완료
    RETURNED,  // 반송
    DELETED;   // 삭제

    public static DocumentStatus getInitialStatus(TemplateCode templateCode) {
        return templateCode.name().startsWith("G") ?
                WAITING :
                SIGNED;
    }
}