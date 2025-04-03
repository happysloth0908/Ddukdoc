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
public class LaptopExportGenerator implements DocumentGenerator{
    private static final int APPLICANT_ROLE_ID = 6;

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
        Paragraph title = new Paragraph("노트북 반출 확인서")
                .setFont(font)
                .setBold()
                .setFontSize(22)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(15);
        document.add(title);

        // 안내문
        Paragraph intro = new Paragraph("본 확인서는 노트북 반출 시 작성하여 접수해야 합니다.")
                .setFont(font)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.LEFT)
                .setMarginBottom(5);
        document.add(intro);

        Paragraph responsibility = new Paragraph("노트북 반출 이후의 관리 및 분실 책임은 노트북 수령 확인서에 기초하여 사용자의 책임으로 합니다.")
                .setFont(font)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.LEFT)
                .setMarginBottom(15);
        document.add(responsibility);

        // 규정 항목들
        addRegulationItem(document, font, "1", "분실 또는 도난 당하였을 경우 동일한 성능의 노트북으로 변상한다.");
        addRegulationItem(document, font, "2", "노트북을 파손하였을 경우 전액 수령자 비용 부담으로 수리하여 원 상태로 반납하여야 한다. 실금, 흠집 등 사용상의 문제가 없는 미세 하자 역시 파손에 포함되므로 최초 수령 시점의 외관 상태를 기준으로 한다.");
        addRegulationItem(document, font, "3", "노트북을 임의로 타인에게 양도 및 대여할 수 없으며, 이로 인해 발생하는 모든 문제에 대해 수령자의 책임으로 한다.");
        addRegulationItem(document, font, "4", "노트북에 임의로 설치한 소프트웨어 및 데이터의 저작권 위반 혹은 라이선스 문제 발생 시 수령자의 책임으로 한다.");
        addRegulationItem(document, font, "5", "노트북은 교육 외(게임, 쇼핑 등) 용도로 사용하지 않는다.");
        addRegulationItem(document, font, "6", "지급 받은 노트북은 오프라인 출석 시 필수 지참하며, 교육 종료 시 사무국으로 원 상태로(구성품 포함) 반납한다.");
        addRegulationItem(document, font, "7", "허가된 장소(자택, 캠퍼스, 기타 일체의 허가 받은 장소) 외 무단 반출할 경우 절도에 해당하는 민형사상 법적 책임이 있으며, 위 내용 위반 시 즉시 중도 퇴소한다.");

        // 동의 문구
        Paragraph agreement = new Paragraph("본인은 위 사항에 동의하고 작성한 일자를 준수할 것을 확인합니다.")
                .setFont(font)
                .setTextAlignment(TextAlignment.LEFT)
                .setMarginTop(15)
                .setMarginBottom(15);
        document.add(agreement);

        // 사용자 정보 표 생성
        Table infoTable = new Table(new float[]{2, 3})
                .setWidth(UnitValue.createPercentValue(100))
                .setMarginBottom(10);

        // 반출 일자
        addTableRow(infoTable, font, "반출 일자", formatDate(fieldMap.get("export_date")));

        // 반납 예정일
        addTableRow(infoTable, font, "반입 일자", formatDate(fieldMap.get("return_due_date")));

        // 소속
        addTableRow(infoTable, font, "소속", fieldMap.get("location"));

        // 학번
        addTableRow(infoTable, font, "학번", fieldMap.get("student_id"));

        // 연락처
        addTableRow(infoTable, font, "연락처", fieldMap.get("contact_number"));

        // 이름
        addTableRow(infoTable, font, "이름", fieldMap.get("applicant_name") + " (인)");

        document.add(infoTable);

        // 사용자 서명 (서명이 있는 경우)
        if (signatures.containsKey(APPLICANT_ROLE_ID)) {
            Image signature = new Image(ImageDataFactory.create(signatures.get(APPLICANT_ROLE_ID)))
                    .setWidth(80)
                    .setHeight(40);
            signature.setRelativePosition(350, -30, 0, 0); // 이름 옆에 서명이 나타나도록 위치 조정
            document.add(signature);
        }

        // 하단 발행 기관
        Paragraph footer = new Paragraph("삼성 청년 S/W 아카데미")
                .setFont(font)
                .setBold()
                .setFontSize(20)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(30);
        document.add(footer);
    }

    // 규정 항목 추가 헬퍼 메소드
    private void addRegulationItem(Document document, PdfFont font, String number, String content) {
        Paragraph item = new Paragraph()
                .setFont(font)
                .setTextAlignment(TextAlignment.LEFT)
                .setMarginBottom(5);

        // 번호와 내용을 굵게 표시
        Text numberText = new Text(number + ". ").setBold();
        Text contentText = new Text(content).setBold();

        item.add(numberText);
        item.add(contentText);

        document.add(item);
    }

    // 테이블 행 추가 헬퍼 메소드
    private void addTableRow(Table table, PdfFont font, String label, String value) {
        Cell labelCell = new Cell()
                .add(new Paragraph(label).setFont(font))
                .setBorder(null)
                .setPadding(5);

        Cell valueCell = new Cell()
                .add(new Paragraph(value).setFont(font))
                .setBorder(null)
                .setPadding(5);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    // 날짜 형식 변환 헬퍼 메소드 (YYYY-MM-DD -> YYYY년 MM월 DD일)
    private String formatDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty() || !dateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return dateStr; // 잘못된 형식이면 원본 반환
        }

        String[] parts = dateStr.split("-");
        return parts[0] + "년 " + parts[1] + "월 " + parts[2] + "일";
    }
}
