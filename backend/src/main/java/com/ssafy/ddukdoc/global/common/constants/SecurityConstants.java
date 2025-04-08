package com.ssafy.ddukdoc.global.common.constants;

import com.ssafy.ddukdoc.global.config.DomainConfig;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
public class SecurityConstants {

    @Getter
    private static String domain;
    @Getter
    private static Boolean isLocal = false;

    public static final long ACCESS_TOKEN_VALIDITY_SECONDS = 24L * 60 * 60; // 24시간
    public static final long REFRESH_TOKEN_VALIDITY_SECONDS = 14L * 24 * 60 * 60; // 14일

    // 쿠키 이름 상수
    public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    public static final String ROLE_NAME = "typ";
    public static final String ROLE_PREFIX = "ROLE_";

    public SecurityConstants(DomainConfig domainConfig) {
        domain = domainConfig.getDomain();
        isLocal = domainConfig.getIsLocal();
    }
}