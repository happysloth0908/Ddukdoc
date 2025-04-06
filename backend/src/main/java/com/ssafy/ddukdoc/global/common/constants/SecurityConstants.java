package com.ssafy.ddukdoc.global.common.constants;

import com.ssafy.ddukdoc.global.config.DomainConfig;
import org.springframework.stereotype.Component;

@Component
public class SecurityConstants {

    // 도메인 관련 상수
    private static String DOMAIN;
    private static Boolean IS_LOCAL = false;

    public static final long ACCESS_TOKEN_VALIDITY_SECONDS = 24L * 60 * 60; // 24시간
    public static final long REFRESH_TOKEN_VALIDITY_SECONDS = 14L * 24 * 60 * 60; // 14일

    // 쿠키 이름 상수
    public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    public SecurityConstants(DomainConfig domainConfig) {
        DOMAIN = domainConfig.getDomain();
        IS_LOCAL = domainConfig.getIsLocal();
    }

    public static String getDomain() {
        return DOMAIN;
    }

    public static Boolean getIsLocal() {
        return IS_LOCAL;
    }
}