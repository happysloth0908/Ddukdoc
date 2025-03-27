package com.ssafy.ddukdoc.global.common.util.pdfgenerator;

import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;

public class DocumentGeneratorFactory {
    public static DocumentGenerator getGenerator(TemplateCode templateCode){
        switch (templateCode){
            case G1:
                return new LoanAgreementGenerator();
            default:
                throw new CustomException(ErrorCode.TEMPLATE_NOT_FOUND);
        }
    }
}
