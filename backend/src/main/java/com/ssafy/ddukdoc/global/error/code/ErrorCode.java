package com.ssafy.ddukdoc.global.error.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력값입니다"),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "C002", "요청한 리소스를 찾을 수 없습니다"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C003", "서버 내부 오류가 발생했습니다"),
    UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "C004", "로그인이 필요한 서비스입니다"),
    FORBIDDEN_ACCESS(HttpStatus.FORBIDDEN, "C005", "접근 권한이 없습니다"),

    //Contract
    TEMPLATE_NOT_FOUND(HttpStatus.NOT_FOUND, "T001", "존재하지 않는 템플릿 코드입니다"),
    TEMPLATE_FIELD_NOT_FOUND(HttpStatus.NOT_FOUND,"T002","존재하지 않는 템플릿 필드 ID 입니다."),

    //Document
    DOCUMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "D001", "존재하지 않는 문서입니다"),
    PIN_CODE_MISMATCH(HttpStatus.NOT_FOUND, "D002", "잘못된 핀번호입니다"),
    CREATOR_NOT_MATCH(HttpStatus.UNAUTHORIZED, "D003", "문서의 발신자가 아닙니다"),
    DOCUMENT_NOT_RETURNED(HttpStatus.BAD_REQUEST, "D004", "반송되지 않은 문서입니다"),

    // Auth
    OAUTH_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "A001", "OAuth 서버와 통신 중 오류가 발생했습니다"),
    INVALID_OAUTH_PROVIDER(HttpStatus.BAD_REQUEST, "A002", "지원하지 않는 OAuth 제공자입니다"),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.BAD_REQUEST, "A003", "리프레시 토큰이 존재하지 않습니다"),
    INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST, "A004", "유효하지 않은 리프레시 토큰입니다"),
    INVALID_ACCESS_TOKEN(HttpStatus.BAD_REQUEST, "A005", "유효하지 않은 액세스 토큰입니다"),

    //Encryption
    ENCRYPTION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E001", "암호화 과정에서 오류가 발생했습니다"),
    DECRYPTION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E002", "복호화 과정에서 오류가 발생했습니다"),
    INVALID_KEK(HttpStatus.INTERNAL_SERVER_ERROR, "E003", "잘못된 KEK 값입니다"),
    INVALID_DEK(HttpStatus.INTERNAL_SERVER_ERROR, "E004", "잘못된 DEK 값입니다"),
    GENERATED_DEK(HttpStatus.INTERNAL_SERVER_ERROR, "E005", "DEK 생성 과정에서 오류가 발생했습니다."),
    //User
    INVALID_USER_ID(HttpStatus.NOT_FOUND,"U001","존재하지 않는 사용자입니다."),

    //s3
    FILE_UPLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"S001","파일 업로드 중 오류가 발생했습니다."),
    SIGNATURE_FILE_NOT_FOUND(HttpStatus.BAD_REQUEST, "S002", "서명 파일이 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

}
