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
    TEMPLATE_NOT_MATCH(HttpStatus.NOT_FOUND,"T003","다른 문서의 필드 ID 입니다."),

    //Document
    DOCUMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "D001", "존재하지 않는 문서입니다"),
    CREATOR_NOT_MATCH(HttpStatus.UNAUTHORIZED, "D002", "문서의 발신자가 아닙니다"),
    DOCUMENT_NOT_RETURNED(HttpStatus.BAD_REQUEST, "D003", "반송되지 않은 문서입니다"),
    USER_DOC_ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "D004", "사용자의 문서 역할을 찾을 수 없습니다"),
    INVALID_DOCUMENT_STATUS(HttpStatus.BAD_REQUEST,"D005" ,"문서의 상태가 서명대기가 아닙니다." ),
    DOCUMENT_NOT_SIGNED(HttpStatus.BAD_REQUEST, "D006", "서명완료되지 않은 문서입니다"),

    // Role
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "존재하지 않는 문서 역할입니다"),

    //Pin
    PIN_CODE_MISMATCH(HttpStatus.NOT_FOUND, "P001", "잘못된 핀번호입니다"),
    PIN_CODE_REQUIRED(HttpStatus.BAD_REQUEST, "P002", "핀코드 입력이 필요합니다"),

    // DocumentEvidence
    MATERIAL_UPLOAD_ERROR(HttpStatus.BAD_REQUEST, "M001", "파일이 없거나 비어있습니다"),
    MATERIAL_INVALID_FORMAT(HttpStatus.BAD_REQUEST, "M002", "허용되지 않는 확장자입니다"),
    MATERIAL_SIZE_EXCEEDED(HttpStatus.PAYLOAD_TOO_LARGE, "M003", "파일 용량을 초과했습니다"),
    MATERIAL_NOT_FOUND(HttpStatus.NOT_FOUND, "M004", "존재하지 않는 파일입니다"),
    MATERIAL_NOT_IMAGE(HttpStatus.BAD_REQUEST, "M005","이미지 파일만 조회 가능합니다"),
    MATERIAL_DOWNLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "M006", "자료를 다운로드 중 오류가 발생했습니다"),
    MATERIAL_ZIP_CONVERT_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "M007", "ZIP 파일 생성 중 오류가 발생했습니다"),
    MATERIAL_DOWNLOAD_EMPTY(HttpStatus.BAD_REQUEST, "M008","다운로드 할 수 있는 자료가 없습니다"),

    // Auth
    OAUTH_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "A001", "OAuth 서버와 통신 중 오류가 발생했습니다"),
    INVALID_OAUTH_PROVIDER(HttpStatus.BAD_REQUEST, "A002", "지원하지 않는 OAuth 제공자입니다"),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.BAD_REQUEST, "A003", "리프레시 토큰이 존재하지 않습니다"),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "A004", "유효하지 않은 리프레시 토큰입니다"),
    INVALID_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "A005", "유효하지 않은 액세스 토큰입니다"),

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
    SIGNATURE_FILE_NOT_FOUND(HttpStatus.BAD_REQUEST, "S002", "서명 파일이 없습니다."),
    FILE_CONVERT_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"S003","File 변환과정에서 오류가 발생했습니다."),
    FILE_DOWNLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"S004","파일 다운로드 중 오류가 발생했습니다."),
    FILE_METADATA_ERROR(HttpStatus.BAD_REQUEST,"S005","메타데이터의 정보가 누락되었습니다."),
    FILE_NOT_FOUND(HttpStatus.BAD_REQUEST,"S006","파일이 존재하지 않거나 파일이 아닙니다."),
    FILE_SIZE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"S007","파일 크기가 IV 길이보다 작습니다. 파일이 손상되었을 수 있습니다."),
    FILE_DECRYPTION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"S008","파일 복호화 과정에서 오류가 발생했습니다."),
    FILE_PATH_ERROR(HttpStatus.BAD_REQUEST, "S009", "잘못된 파일 경로입니다"),
    FILE_DELETE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "S010", "파일 삭제 중 오류가 발생했습니다"),
    FILE_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR,"S011","암호화된 파일 삭제 시 오류가 발생했습니다."),


    //Hash
    INVALID_ENCRYPTION_ALGORITHM(HttpStatus.INTERNAL_SERVER_ERROR,"H001","지원하지 않는 해시 암호화 알고리즘입니다."),

    //PDF
    PDF_GENERATION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"P001" ,"PDF 생성에 실패하였습니다." ),

    // API
    EXTERNAL_API_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E001", "외부 API 호출 중 오류가 발생했습니다"),

    //Blockchain
    BLOCKCHAIN_SIGNATURE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"B001","블록체인 서명 생성 중 오류가 발생했습니다."),
    BLOCKCHAIN_DOCUMENT_ERROR(HttpStatus.BAD_REQUEST,"B002","블록체인에 저장된 문서 조회 중 오류가 발생했습니다"),

    // Validation
    VALIDATION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "V001","위변조 검증 중 오류가 발생했습니다"),
    VALIDATION_NOT_MATCH(HttpStatus.BAD_REQUEST, "V002","위조된 문서입니다"),
    PNG_READER_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "V003","PNG 이미지 리더를 찾을 수 없습니다"),
    VALIDATION_NOT_REGIST(HttpStatus.BAD_REQUEST, "V004", "뚝딱뚝딱에 등록되지 않은 문서입니다"),

    // superapp
    BLOCKCHAIN_SAVE_ERROR(HttpStatus.BAD_REQUEST,"Z001","블록체인에 저장 중 오류가 발생했습니다."),
    VALIDATION_NOT_ACCESS(HttpStatus.BAD_REQUEST,"Z002","등록되지 않거나 위조된 문서입니다."),
    FILE_METADATA_SAVE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"Z003","메타데이터 저장 시 오류가 발생했습니다."),
    FILE_IS_EMPTY(HttpStatus.BAD_REQUEST,"Z004","입력된 파일이 없습니다.")
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;

}
