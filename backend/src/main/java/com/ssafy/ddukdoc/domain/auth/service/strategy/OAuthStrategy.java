package com.ssafy.ddukdoc.domain.auth.service.strategy;

import com.ssafy.ddukdoc.domain.auth.dto.OAuthUserInfo;

import java.io.IOException;

public interface OAuthStrategy {
    OAuthUserInfo getUserInfo(String code) throws IOException;
}
