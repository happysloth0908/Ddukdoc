package com.ssafy.ddukdoc.domain.document.entity;

public enum DocumentStatus {
    WAITING,   // 서명 대기
    SIGNED,    // 서명 완료
    RETURNED,  // 반송
    DELETED   // 삭제
}