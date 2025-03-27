package com.ssafy.ddukdoc.global.security.jwt;

public record TokenValidationResult(boolean isValid, TokenError error) {
}
