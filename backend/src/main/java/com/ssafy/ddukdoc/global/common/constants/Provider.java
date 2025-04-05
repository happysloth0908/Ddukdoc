package com.ssafy.ddukdoc.global.common.constants;

public enum Provider {
    KAKAO(""),
    SSAFY("/ssafy");

    private final String redirectUriSuffix;

    Provider(String redirectUriSuffix) {
        this.redirectUriSuffix = redirectUriSuffix;
    }

    public String getName() {
        return this.name().toLowerCase();
    }

    public String getRedirectUri(String domainUrl) {
        return domainUrl + this.redirectUriSuffix;
    }
}
