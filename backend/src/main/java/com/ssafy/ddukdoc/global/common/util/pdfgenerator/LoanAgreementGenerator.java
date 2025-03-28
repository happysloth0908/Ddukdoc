package com.ssafy.ddukdoc.global.common.util.pdfgenerator;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class LoanAgreementGenerator implements DocumentGenerator{
    private static final int CREDITOR_ROLE_ID = 2;
    private static final int DEBTOR_ROLE_ID = 3;

    @Override
    public void generateDocument(Document document,
                                 List<DocumentFieldDto> fieldValues,
                                 Map<Integer, byte[]> signatures,
                                 PdfFont font) throws IOException {
        // 필드값을 Map으로 변환하여 접근성 향상
        Map<String, String> fieldMap = new HashMap<>();
        for (DocumentFieldDto field : fieldValues) {
            fieldMap.put(field.getName(), field.getFieldValue());
        }

        // 제목
        Paragraph title = new Paragraph("차 용 증")
                .setFont(font)
                .setBold()
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10); // 제목 아래 여백 설정
        document.add(title);
        // 개행 제거

        // 기본 정보 표 생성
        Table basicInfoTable = new Table(new float[]{1, 3})
                .setWidth(UnitValue.createPercentValue(100));

        // 차용 목적
        Cell purposeLabel = new Cell().add(new Paragraph("차용 목적").setBold().setFont(font));
        Cell purposeValue = new Cell().add(new Paragraph(fieldMap.get("loan_purpose")).setFont(font));
        basicInfoTable.addCell(purposeLabel);
        basicInfoTable.addCell(purposeValue);

        // 차용 일자
        Cell dateLabel = new Cell().add(new Paragraph("차용 일자").setBold().setFont(font));
        Cell dateValue = new Cell().add(new Paragraph(fieldMap.get("loan_date")).setFont(font));
        basicInfoTable.addCell(dateLabel);
        basicInfoTable.addCell(dateValue);

        // 원금
        Cell principalLabel = new Cell().add(new Paragraph("원금").setBold().setFont(font));
        Cell principalValue = new Cell().add(new Paragraph(
                fieldMap.get("principal_amount_text") + " (\\" + fieldMap.get("principal_amount_numeric") + ")").setFont(font));
        basicInfoTable.addCell(principalLabel);
        basicInfoTable.addCell(principalValue);

        document.add(basicInfoTable);

        // 1번 내용 - 표 사이 간격 최소화
        Paragraph para1 = new Paragraph("1. 상기 금액을 채무자가 채권자로부터 " + fieldMap.get("loan_date") + " 차용하였으며, 아래와 같이 이행할 것을 확약한다.")
                .setFont(font)
                .setMarginTop(10)    // 위 여백 줄이기
                .setMarginBottom(2); // 아래 여백 최소화
        document.add(para1);
        // 개행 제거

        // 이자 및 변제 정보 표
        Table repaymentTable = new Table(new float[]{1, 3})
                .setWidth(UnitValue.createPercentValue(100))
                .setMarginTop(0);    // 위 여백 제거

        // 이자율
        Cell interestLabel = new Cell().add(new Paragraph("이자율").setBold().setFont(font));
        Cell interestValue = new Cell().add(new Paragraph(fieldMap.get("interest_rate") + " %").setFont(font));
        repaymentTable.addCell(interestLabel);
        repaymentTable.addCell(interestValue);

        // 원금 변제일
        Cell repaymentDateLabel = new Cell().add(new Paragraph("원금 변제일").setBold().setFont(font));
        Cell repaymentDateValue = new Cell().add(new Paragraph(fieldMap.get("repayment_date")).setFont(font));
        repaymentTable.addCell(repaymentDateLabel);
        repaymentTable.addCell(repaymentDateValue);

        document.add(repaymentTable);

        // 2번 내용 - 간격 최소화
        Paragraph para2Title = new Paragraph("2. 채무변제방법")
                .setFont(font)
                .setBold()
                .setMarginTop(10)    // 위 여백 조정
                .setMarginBottom(2); // 아래 여백 최소화
        document.add(para2Title);

        Paragraph para2Content = new Paragraph("원금과 이자는 지정 일자에 채권자의 주소지에 지참 지불하거나 아래의 예금계좌로 송금하여 변제한다.")
                .setFont(font)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(2); // 아래 여백 최소화
        document.add(para2Content);
        // 개행 제거

        // 계좌 정보 표
        Table accountTable = new Table(new float[]{1, 3})
                .setWidth(UnitValue.createPercentValue(100))
                .setMarginTop(0);    // 위 여백 제거

        // 은행
        Cell bankLabel = new Cell().add(new Paragraph("은행").setBold().setFont(font));
        Cell bankValue = new Cell().add(new Paragraph(fieldMap.get("bank_name")).setFont(font));
        accountTable.addCell(bankLabel);
        accountTable.addCell(bankValue);

        // 계좌번호
        Cell accountLabel = new Cell().add(new Paragraph("계좌번호").setBold().setFont(font));
        Cell accountValue = new Cell().add(new Paragraph(fieldMap.get("account_number")).setFont(font));
        accountTable.addCell(accountLabel);
        accountTable.addCell(accountValue);

        // 예금주
        Cell account_holderLabel = new Cell().add(new Paragraph("예금주").setBold().setFont(font));
        Cell account_holderValue = new Cell().add(new Paragraph(fieldMap.get("account_holder")).setFont(font));
        accountTable.addCell(account_holderLabel);
        accountTable.addCell(account_holderValue);

        // 이자 지급일
        Cell interestDateLabel = new Cell().add(new Paragraph("이자 지급일").setBold().setFont(font));
        Cell interestDateValue = new Cell().add(new Paragraph("매월 " + fieldMap.get("interest_payment_date") + "일").setFont(font));
        accountTable.addCell(interestDateLabel);
        accountTable.addCell(interestDateValue);

        document.add(accountTable);

        // 3번 내용
        Paragraph para3 = new Paragraph("3. 원금 및 이자의 변제를 지체할 경우 채무자는 일 " + fieldMap.get("late_interest_rate")
                + "%의 이자율에 의한 지연 손실금을 가산해서 지불해야 한다.")
                .setFont(font)
                .setMarginTop(10)    // 위 여백 조정
                .setMarginBottom(10); // 아래 여백 조정
        document.add(para3);

        // 4번 내용 - 간격 없는 단일 문단으로 생성
        Paragraph section4 = new Paragraph()
                .setFont(font)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(10); // 아래 여백 조정

        section4.add(new Text("4. 다음 경우에는 최고 없이 당연히 기한의 이익을 상실하고 잔존 채무금 전부를 즉시 지급한다.\n"));
        section4.add(new Text("   A. 이자의 지급을 " + fieldMap.getOrDefault("loss_of_benefit_conditions", "3회") + " 이상 지체할 때\n"));
        section4.add(new Text("   B. 채무자가 타의 채권자로부터 가압류 강제집행을 받거나 파산 화해신청을 받을 때\n"));
        section4.add(new Text("   C. 기타 이 약정 조항을 위반할 때"));

        document.add(section4);

        // 5번 내용
        Paragraph para5 = new Paragraph("5. 위 채권을 담보하거나 추심에 필요한 비용은 채무자가 부담한다.")
                .setFont(font)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(10); // 아래 여백 조정
        document.add(para5);

        // 6번 내용
        Paragraph para6 = new Paragraph("6. 위 채권에 관한 소는 채권자 주소지에 한다.")
                .setFont(font)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(10); // 아래 여백 조정
        document.add(para6);

        // 채무자 확약
        Paragraph confirmation = new Paragraph("채무자는 위와 같은 조건으로, 채권자로부터 틀림없이 위 돈을 차용하였으며, 연대보증인은 채무자의 채무이행을 연대보증 하기로 한다.")
                .setFont(font)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(10); // 아래 여백 조정
        document.add(confirmation);
        document.add(new Paragraph("\n"));
        document.add(new Paragraph("\n"));

        // 특약사항
        Paragraph specialTitle = new Paragraph("특약사항")
                .setFont(font)
                .setBold()
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(0);


        document.add(specialTitle);
        Paragraph specialContent = new Paragraph(fieldMap.getOrDefault("special_terms", "특약사항이 없음."))
                .setFont(font)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(15); // 날짜와의 간격 설정

        document.add(specialContent);

        // 날짜
        String[] dateParts = fieldMap.get("loan_date").split("-");
        String dateString = dateParts[0] + " 년 " + dateParts[1] + " 월 " + dateParts[2] + " 일";

        Paragraph datePara = new Paragraph(dateString)
                .setFont(font)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(15); // 서명 정보와의 간격 설정
        document.add(datePara);

        // 채권자 정보
        Paragraph creditorTitle = new Paragraph("채 권 자")
                .setFont(font)
                .setBold()
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(2); // 아래 여백 최소화
        document.add(creditorTitle);

        Paragraph creditorInfo = new Paragraph()
                .setFont(font)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(2); // 아래 여백 최소화

        creditorInfo.add("성 명 : " + fieldMap.get("creditor_name") + "\n");
        creditorInfo.add("주 소 : " + fieldMap.get("creditor_address") + "\n");
        creditorInfo.add("주민등록번호 : " + fieldMap.get("creditor_id"));

        document.add(creditorInfo);

        // 채권자 서명 (서명이 있는 경우)
        if (signatures.containsKey(CREDITOR_ROLE_ID)) {
            Paragraph signatureText = new Paragraph("(인)").setFont(font);
            document.add(signatureText);

            Image signature = new Image(ImageDataFactory.create(signatures.get(CREDITOR_ROLE_ID)))
                    .setWidth(100)
                    .setHeight(50);
            signature.setRelativePosition(-20, -40, 0, 0);
            document.add(signature);
        } else {
            document.add(new Paragraph("(인)").setFont(font));
        }

        // 채무자 정보
        Paragraph debtorTitle = new Paragraph("채 무 자")
                .setFont(font)
                .setBold()
                .setMarginTop(15)    // 위 여백 설정
                .setMarginBottom(2); // 아래 여백 최소화
        document.add(debtorTitle);

        Paragraph debtorInfo = new Paragraph()
                .setFont(font)
                .setMarginTop(0)     // 위 여백 제거
                .setMarginBottom(2); // 아래 여백 최소화

        debtorInfo.add("성 명 : " + fieldMap.get("debtor_name") + "\n");
        debtorInfo.add("주 소 : " + fieldMap.get("debtor_address") + "\n");
        debtorInfo.add("주민등록번호 : " + fieldMap.get("debtor_id"));

        document.add(debtorInfo);

        // 채무자 서명 (서명이 있는 경우)
        if (signatures.containsKey(DEBTOR_ROLE_ID)) {
            Paragraph signatureText = new Paragraph("(인)").setFont(font);
            document.add(signatureText);
            Image signature = new Image(ImageDataFactory.create(signatures.get(DEBTOR_ROLE_ID)))
                    .setWidth(100)
                    .setHeight(50);
            signature.setRelativePosition(-20, -40, 0, 0);
            document.add(signature);
        } else {
            document.add(new Paragraph("(인)").setFont(font));
        }
    }
}
