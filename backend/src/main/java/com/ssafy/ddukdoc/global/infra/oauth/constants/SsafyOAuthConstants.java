package com.ssafy.ddukdoc.global.infra.oauth.constants;

public class SsafyOAuthConstants {
    public static class Urls {
        public static final String TOKEN = "https://project.ssafy.com/ssafy/oauth2/token";
        public static final String USER_INFO = "https://project.ssafy.com/ssafy/resources/userInfo";
    }

    public static class GrantTypes {
        public static final String AUTHORIZATION_CODE = "authorization_code";
    }

    public static class Parameters {
        public static final String GRANT_TYPE = "grant_type";
        public static final String CLIENT_ID = "client_id";
        public static final String CLIENT_SECRET = "client_secret";
        public static final String REDIRECT_URI = "redirect_uri";
        public static final String CODE = "code";
    }
}
