package com.ssafy.ddukdoc.domain.user.service;

import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public void withdrawUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID));

        userRepository.delete(user);
    }
}
