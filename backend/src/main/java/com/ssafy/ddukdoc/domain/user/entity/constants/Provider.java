package com.ssafy.ddukdoc.domain.user.entity.constants;

public enum Provider {
    KAKAO, SSAFY;

    public String getName() {
        return this.name().toLowerCase();
    }
}
