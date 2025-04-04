package com.ssafy.ddukdoc.global.common.util.pdfgenerator;

import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;

public class DocumentGeneratorFactory {
    public static DocumentGenerator getGenerator(TemplateCode templateCode){
        switch (templateCode){
            case G1:
                return new LoanAgreementGenerator();
            case S1:
                return new LaptopExportGenerator();
            case S3:
                return new AttendanceFormGenerator();
//            case S4:
//                return new AttendanceChangeRequestForm();
//            case S5:
//                return new SourceCodeExportGenerator();
//            case S6:
//                return new ProjectUtilizationAgreementForm();
            default:
                throw new CustomException(ErrorCode.TEMPLATE_NOT_FOUND);
        }
    }
}
