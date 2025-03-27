package com.ssafy.ddukdoc.domain.auth.service.strategy;

import com.ssafy.ddukdoc.domain.auth.dto.OAuthUserInfo;
import com.ssafy.ddukdoc.global.error.exception.CustomException;

public interface OAuthStrategy {
    OAuthUserInfo getUserInfo(String code) throws CustomException;
}
