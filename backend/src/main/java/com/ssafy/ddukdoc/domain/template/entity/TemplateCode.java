package com.ssafy.ddukdoc.domain.template.entity;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;

public enum TemplateCode {
    G1("차용증",1),
    G2("근로계약서",2),
    S1("노트북 반출 서약서",3),
    S2("노트북 수령 확인서",4),
    S3("출결 확인서",5),
    S4("출결 변경요청서",6),
    S5("소스코드 반출 요청서",7),
    S6("프로젝트 활용 동의서",8);

    private final String description;
    private final Integer code;

    TemplateCode(String description, Integer code) {
        this.description = description; this.code = code;
    }

    public static TemplateCode fromString(String code){
        try{
            return valueOf(code.toUpperCase());
        }catch (IllegalArgumentException e){
            throw new CustomException(ErrorCode.TEMPLATE_NOT_FOUND);
        }
    }
}
