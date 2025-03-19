package com.ssafy.ddukdoc.global.infra.oauth.constants;

public class KakaoOAuthConstants {
    public static class Urls {
        public static final String TOKEN = "https://kauth.kakao.com/oauth/token";
        public static final String USER_INFO = "https://kapi.kakao.com/v2/user/me";
    }

    public static class GrantTypes {
        public static final String AUTHORIZATION_CODE = "authorization_code";
    }

    public static class Parameters {
        public static final String GRANT_TYPE = "grant_type";
        public static final String CLIENT_ID = "client_id";
        public static final String REDIRECT_URI = "redirect_uri";
        public static final String CODE = "code";
    }
}
