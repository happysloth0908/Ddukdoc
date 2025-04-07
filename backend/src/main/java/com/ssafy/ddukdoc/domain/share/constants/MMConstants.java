package com.ssafy.ddukdoc.domain.share.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MMConstants {
    public static final String API_URL = "https://meeting.ssafy.com/api/v4";
    public static final String LOGIN_URL = "/users/login";
    public static final String SEARCH_USER_URL = "/users/autocomplete";
    public static final String CREATE_DIRECT_URL = "/channels/direct";

    //    Authorization
    public static final String AUTH = "Authorization";
    public static final String TOKEN = "Token ";
}
