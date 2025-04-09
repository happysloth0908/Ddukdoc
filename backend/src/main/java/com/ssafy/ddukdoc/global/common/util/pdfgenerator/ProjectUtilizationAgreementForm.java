package com.ssafy.ddukdoc.global.common.util.pdfgenerator;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProjectUtilizationAgreementForm implements DocumentGenerator {
    private static final int APPLICANT_ROLE_ID = 6;  // 신청자 역할 ID

    @Override
    public void generateDocument(Document document, List<DocumentFieldDto> fieldValues, Map<Integer, byte[]> signatures, PdfFont font) throws IOException {
        // 필드값을 Map으로 변환하여 접근성 향상
        Map<String, String> fieldMap = new HashMap<>();
        for (DocumentFieldDto field : fieldValues) {
            fieldMap.put(field.getName(), field.getFieldValue());
        }

        // 문서 제목
        Paragraph title = new Paragraph("삼성청년SW아카데미 교육결과물 활용 동의서")
                .setFont(font)
                .setBold()
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20)
                .setMarginBottom(30);
        document.add(title);

        // 1번 항목
        Paragraph item1 = new Paragraph("1. \"삼성 청년 소프트웨어 아카데미(Samsung SW Academy For Youth), (이하 \"SSAFY\")가 본인의 'SSAFY' 교육 중 수행한 프로젝트의 결과물(코드, HW, 발표 자료 및 기타 산출물) 영상 등 모든 콘텐츠, 이에 수반하여 \"교육생 동의\"를 통해 SSAFY 교육(수업 기수 교육을 위한 교육적 동영상 촬영, 강의자료 활용 등 포함), 홍보, 후속 시 활용하는 것에 동의합니다.")
                .setFont(font)
                .setFontSize(11)
                .setMarginBottom(10);
        document.add(item1);

        // 2번 항목
        Paragraph item2 = new Paragraph("2. 결과물 등이 제 3자의 저작권 등 타인의 권리를 침해하지 않음을 보증하며, 결과물 등이 침해관련에서 소장/원고/책임을 수 있음을 인지하였습니다.")
                .setFont(font)
                .setFontSize(11)
                .setMarginBottom(10);
        document.add(item2);

        // 3번 항목
        Paragraph item3 = new Paragraph("3. SSAFY는 결과물 등 활용 시 경우에 따라 본인의 실명, 소속, 팀명 등을 표기할 수 있습니다.")
                .setFont(font)
                .setFontSize(11)
                .setMarginBottom(20);
        document.add(item3);

        // SSAFY 공통 프로젝트 결과만 해당되는 항목
        Paragraph specialItem = new Paragraph("- SSAFY 공통 프로젝트 결과인 \"" +
                getFieldValue(fieldMap, "project_name", "_______") + "\"과 관련된 전체 결과물")
                .setFont(font)
                .setFontSize(11)
                .setItalic()
                .setMarginBottom(150);
        document.add(specialItem);
        // 동의 문구
        Paragraph agreement = new Paragraph("본인은 위 내용을 확인하고 동의합니다.")
                .setFont(font)
                .setFontSize(12)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(40);
        document.add(agreement);

        // 날짜
        Paragraph date = new Paragraph(formatDate(getFieldValue(fieldMap, "submitted_date", "2025-04-03")))
                .setFont(font)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(30);
        document.add(date);

        // 생년월일, 이름 테이블
        Table infoTable = new Table(new float[]{1, 1, 1, 1})
                .setWidth(UnitValue.createPercentValue(80))
                .setHorizontalAlignment(HorizontalAlignment.CENTER);

        // 생년월일
        Cell birthLabel = new Cell()
                .add(new Paragraph("생년월일 : ").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.RIGHT));

        Cell birthValue = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "student_birthdate", "1999.02.12")).setFont(font).setFontSize(11).setTextAlignment(TextAlignment.LEFT));

        // 이름
        Cell nameLabel = new Cell()
                .add(new Paragraph("성 명 : ").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.RIGHT));

        Cell nameValue = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "student_name", "전아현 (서명/날인)")+" (서명)").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.LEFT));



        // 테이블에 셀 추가
        birthLabel.setBorder(null);
        birthValue.setBorder(null);
        nameLabel.setBorder(null);
        nameValue.setBorder(null);

        infoTable.addCell(birthLabel);
        infoTable.addCell(birthValue);
        infoTable.addCell(nameLabel);
        infoTable.addCell(nameValue);

        document.add(infoTable);

        // 서명 (있는 경우)
        if (signatures != null && signatures.containsKey(APPLICANT_ROLE_ID)) {
            Image signature = new Image(ImageDataFactory.create(signatures.get(APPLICANT_ROLE_ID)))
                    .setWidth(60)
                    .setHeight(30);

            // 서명을 이름 옆에 배치
            float xPosition = 410; // 이름 옆에 위치
            float yPosition = 200; // 이름과 같은 높이
            signature.setFixedPosition(xPosition, yPosition);
            document.add(signature);
        }

        // 주식회사 멀티캠퍼스 귀중
        Paragraph footer = new Paragraph("주식회사 멀티캠퍼스 귀중")
                .setFont(font)
                .setBold()
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(40);
        document.add(footer);

        // 참고 설명
        Paragraph note = new Paragraph("※ 서명자는 본인의 고유한 권리에 의해 상표파일 콘텐츠제작을 보증합니다.")
                .setFont(font)
                .setFontSize(9)
                .setTextAlignment(TextAlignment.LEFT)
                .setMarginTop(60);
        document.add(note);
    }

    // 필드값 가져오기 (없으면 기본값 사용)
    private String getFieldValue(Map<String, String> fieldMap, String key, String defaultValue) {
        return fieldMap.containsKey(key) ? fieldMap.get(key) : defaultValue;
    }

    private String formatDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty() || !dateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return dateStr; // 잘못된 형식이면 원본 반환
        }

        String[] parts = dateStr.split("-");
        return parts[0] + "년 " + parts[1] + "월 " + parts[2] + "일";
    }
}