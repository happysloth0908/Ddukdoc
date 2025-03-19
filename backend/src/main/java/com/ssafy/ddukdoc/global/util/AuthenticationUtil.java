package com.ssafy.ddukdoc.global.util;

import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticationUtil {

    private final UserRepository userRepository;

    public Integer getCurrentUserId(UserPrincipal userPrincipal) {
        if (userPrincipal == null || userPrincipal.getId() == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        return userPrincipal.getId();
    }
}

