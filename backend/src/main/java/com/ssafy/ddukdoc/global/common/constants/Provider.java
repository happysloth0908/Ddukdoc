package com.ssafy.ddukdoc.global.common.constants;

public enum Provider {
    KAKAO, SSAFY;

    public String getName() {
        return this.name().toLowerCase();
    }
}
