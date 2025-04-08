package com.ssafy.ddukdoc.global.security;

import com.ssafy.ddukdoc.global.common.constants.SecurityConstants;
import com.ssafy.ddukdoc.global.common.constants.UserType;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Slf4j
@Component
@Profile({"dev", "local"})
@RequiredArgsConstructor
public class DevAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // 이미 인증된 사용자는 처리하지 않음
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        // X-DEV-USER 헤더가 있는지 확인
        String testUserId = request.getHeader("X-DEV-USER");

        if (StringUtils.hasText(testUserId)) {
            try {
                // 테스트 사용자 ID로 인증 객체 생성
                UserPrincipal userPrincipal = UserPrincipal.builder()
                        .id(Integer.parseInt(testUserId))
                        .authorities(Collections.singletonList(new SimpleGrantedAuthority(SecurityConstants.ROLE_PREFIX + UserType.ADMIN.name())))
                        .build();

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userPrincipal, "", userPrincipal.getAuthorities());

                // SecurityContext에 인증 객체 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (NumberFormatException e) {
                log.error("개발 환경: 테스트 사용자 ID 형식 오류", e);
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // 소셜 로그인 경로는 필터 적용하지 않음
        String path = request.getServletPath();
        return path.startsWith("/api/oauth");
    }
}
