package com.ssafy.ddukdoc.global.common.constants;

public class SecurityConstants {
    // 도메인 관련 상수
    public static final String DOMAIN = "i12b108.p.ssafy.io";

    public static final long ACCESS_TOKEN_VALIDITY_SECONDS = 24 * 60 * 60; // 24시간
    public static final long REFRESH_TOKEN_VALIDITY_SECONDS = 14 * 24 * 60 * 60; // 14일

    // 쿠키 이름 상수
    public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
}