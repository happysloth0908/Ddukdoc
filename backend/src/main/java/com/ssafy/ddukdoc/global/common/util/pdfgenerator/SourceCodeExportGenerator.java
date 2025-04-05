package com.ssafy.ddukdoc.global.common.util.pdfgenerator;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class SourceCodeExportGenerator implements DocumentGenerator {
    private static final int ROLE_ID = 6;  // 신청자 역할 ID

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
        Paragraph title = new Paragraph("[SSAFY] 소스코드 반출 검토 요청서")
                .setFont(font)
                .setBold()
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(15);
        document.add(title);

        // 안내문
        Paragraph intro = new Paragraph("아래와 같이 SSAFY 교육 과정 중 생성한 소스코드를 활용하고자 하오니, 검토하여 주시기 바랍니다.")
                .setFont(font)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.LEFT)
                .setMarginBottom(5);
        document.add(intro);

        // 구분선
        Paragraph divider = new Paragraph("- 아 래 -")
                .setFont(font)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
        document.add(divider);

        // 기본 정보 테이블 (소속, 이름, 연락처)
        Table infoTable = new Table(new float[]{1, 1, 1, 1, 1, 1})
                .setWidth(UnitValue.createPercentValue(100));

        // 소속, 이름, 연락처 행
        Cell cellSoSok = new Cell().add(new Paragraph("소속").setFont(font).setFontSize(11));
        Cell cellSoSokValue = new Cell().add(new Paragraph(getFieldValue(fieldMap, "affiliation", "서울1반")).setFont(font).setFontSize(11));
        Cell cellName = new Cell().add(new Paragraph("이름").setFont(font).setFontSize(11));
        Cell cellNameValue = new Cell().add(new Paragraph(getFieldValue(fieldMap, "applicant_name", "김싸피")).setFont(font).setFontSize(11));
        Cell cellContact = new Cell().add(new Paragraph("연락처").setFont(font).setFontSize(11));
        Cell cellContactValue = new Cell().add(new Paragraph(getFieldValue(fieldMap, "applicant_contact", "010-1234-5678")).setFont(font).setFontSize(11));

        infoTable.addCell(cellSoSok);
        infoTable.addCell(cellSoSokValue);
        infoTable.addCell(cellName);
        infoTable.addCell(cellNameValue);
        infoTable.addCell(cellContact);
        infoTable.addCell(cellContactValue);

        document.add(infoTable);

        // 상세 정보 테이블 (1줄 2칸 테이블)
        Table detailTable = new Table(new float[]{1, 5})
                .setWidth(UnitValue.createPercentValue(100))
                .setMarginTop(10);

        // 반출 목적
        addTableRow(detailTable, font, "반출 목적", getFieldValue(fieldMap, "export_purpose", "포트폴리오 제출"));

        // 반출처
        addTableRow(detailTable, font, "반출처", getFieldValue(fieldMap, "export_destination", "삼성전자(예시)"));

        // 반출 일정
        addTableRow(detailTable, font, "반출 일정", formatDate(getFieldValue(fieldMap, "export_date", "2024-08-01")));

        // 반납 일정
        addTableRow(detailTable, font, "반납 일정", formatDate(getFieldValue(fieldMap, "return_date", "2024-08-31")));

        // 프로젝트명
        addTableRow(detailTable, font, "프로젝트명", getFieldValue(fieldMap, "project_name", "공통 프로젝트(서비스명: 함께해요 미래로)"));

        // 반출 대상
        addTableRow(detailTable, font, "반출 대상", getFieldValue(fieldMap, "export_target", "*싸피깃 주소 작성"));

        // 반출 방법
        addTableRow(detailTable, font, "반출 방법", getFieldValue(fieldMap, "export_method", "*오픈할 깃허브 주소 작성"));

        document.add(detailTable);

        // 자가점검 체크리스트 테이블
        // 새로운 테이블 구조: 첫 번째 열에는 "자가점검 체크리스트"가 한번만 표시되고,
        // 나머지 열에는 항목, 결과(O/X), 조치사항
        Table checklistTable = new Table(new float[]{1, 3, 0.7f, 3})
                .setWidth(UnitValue.createPercentValue(100))
                .useAllAvailableWidth() // 사용 가능한 전체 너비 사용
                .setFixedLayout() // 고정 레이아웃
                .setMarginTop(10);

        // 헤더 행
        Cell headerCell1 = new Cell()
                .add(new Paragraph("").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER))
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBorderBottom(Border.NO_BORDER);  // 하단 경계선 제거

        Cell headerCell2 = new Cell(1, 1)
                .add(new Paragraph("항목").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER))
                .setBorderBottom(Border.NO_BORDER);  // 상단 경계선 제거

        Cell headerCell3 = new Cell(1, 1)
                .add(new Paragraph("결과(O/X)").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));

        Cell headerCell4 = new Cell(1, 1)
                .add(new Paragraph("조치사항").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));

        checklistTable.addCell(headerCell1);
        checklistTable.addCell(headerCell2);
        checklistTable.addCell(headerCell3);
        checklistTable.addCell(headerCell4);

        // 첫 번째 열에 "자가점검 체크리스트"를 세로로 배치하고 내부 구분선 제거
        Cell checklistLabelCell = new Cell(6, 1)
                .add(new Paragraph("자가점검\n체크리스트").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER))
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBorderRight(new SolidBorder(0.5f))
                .setBorderTop(Border.NO_BORDER);  // 상단 경계선 제거

        checklistTable.addCell(checklistLabelCell);

        // 항목 1 - 텍스트 자동 줄바꿈 기능은 iText 자체적으로 제공
        Cell item1 = new Cell()
                .add(new Paragraph("본인(팀)이 직접 개발한 프로젝트 결과물인가?").setFont(font).setFontSize(10));

        Cell result1 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_code_review", "O")).setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));

        Cell action1 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_code_review_action", "")).setFont(font).setFontSize(10));

        checklistTable.addCell(item1);
        checklistTable.addCell(result1);
        checklistTable.addCell(action1);

        // 항목 2
        Cell item2 = new Cell()
                .add(new Paragraph("SSAFY에서 제공한 스켈레톤 코드 비중이 20% 이내인가?").setFont(font).setFontSize(10));

        Cell result2 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_ssafy_code", "O")).setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));

        Cell action2 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_ssafy_code_action", "")).setFont(font).setFontSize(10));

        checklistTable.addCell(item2);
        checklistTable.addCell(result2);
        checklistTable.addCell(action2);

        // 항목 3
        Cell item3 = new Cell()
                .add(new Paragraph("SSAFY에서 제공한 이미지, 데이터셋, 에셋, 라이센스 등 프로젝트 개발 목적으로 제공된 리소스 원본이 포함되지 않았는가?").setFont(font).setFontSize(10));

        Cell result3 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_open_source", "O")).setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));

        Cell action3 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_open_source_action", "")).setFont(font).setFontSize(10));

        checklistTable.addCell(item3);
        checklistTable.addCell(result3);
        checklistTable.addCell(action3);

        // 항목 4
        Cell item4 = new Cell()
                .add(new Paragraph("SSAFY의 보안 기준 또는 타인의 저작권을 침해할 우려가 없는가?").setFont(font).setFontSize(10));

        Cell result4 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_third_party", "O")).setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));

        Cell action4 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_third_party_action", "")).setFont(font).setFontSize(10));

        checklistTable.addCell(item4);
        checklistTable.addCell(result4);
        checklistTable.addCell(action4);

        // 항목 5
        Cell item5 = new Cell()
                .add(new Paragraph("참조된 소스코드, 라이브러리 등의 출처를 명시하였는가?").setFont(font).setFontSize(10));

        Cell result5 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_security_check", "O")).setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));

        Cell action5 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_security_check_action", "")).setFont(font).setFontSize(10));

        checklistTable.addCell(item5);
        checklistTable.addCell(result5);
        checklistTable.addCell(action5);

        // 항목 6
        Cell item6 = new Cell()
                .add(new Paragraph("학습용 프로젝트가 해당하지 않고 포트폴리오로 인정할 만한 독창적인 프로젝트인가?").setFont(font).setFontSize(10));

        Cell result6 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_purpose_limit", "O")).setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));

        Cell action6 = new Cell()
                .add(new Paragraph(getFieldValue(fieldMap, "self_check_purpose_limit_action", "")).setFont(font).setFontSize(10));

        checklistTable.addCell(item6);
        checklistTable.addCell(result6);
        checklistTable.addCell(action6);

        document.add(checklistTable);

        // 동의 문구
        Paragraph agreement = new Paragraph("반출한 소스코드는 반납 일정에 맞춰 삭제하겠으며,\n반출 목적, 반출처 외 용도로 사용하지 않음을 동의합니다.")
                .setFont(font)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
        document.add(agreement);

        // 서명 (있는 경우)
        if (signatures != null && signatures.containsKey(ROLE_ID)) {
            Image signature = new Image(ImageDataFactory.create(signatures.get(ROLE_ID)))
                    .setWidth(100)
                    .setHeight(50);

            // 서명을 문서 오른쪽 하단에 배치
            signature.setFixedPosition(400, 100);
            document.add(signature);
        }

        // 페이지 나누기
        document.add(new AreaBreak());

        // 2페이지 - 제목
        document.add(title);

        // 2페이지 - 소제목
        Paragraph subTitle = new Paragraph("- 조치 완료 확인 -")
                .setFont(font)
                .setBold()
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(subTitle);

        // 조치 의견 섹션
        Paragraph opinionTitle = new Paragraph("□ 조치 의견(담당프로가 전달한 조치 안내사항 기입)")
                .setFont(font)
                .setFontSize(11)
                .setMarginBottom(10);
        document.add(opinionTitle);

        // 조치 의견 입력란 (빈 공간)
        String reviewOpinion = getFieldValue(fieldMap, "review_opinion", "");
        Paragraph opinionParagraph = new Paragraph(reviewOpinion)
                .setFont(font)
                .setFontSize(11)
                .setMarginBottom(40);
        document.add(opinionParagraph);

        // 조치 사항 섹션
        Paragraph actionTitle = new Paragraph("□ 조치 사항")
                .setFont(font)
                .setFontSize(11)
                .setMarginBottom(10);
        document.add(actionTitle);

        // 조치 전 표
        Table beforeTable = new Table(1)
                .setWidth(UnitValue.createPercentValue(100));

        Cell beforeHeaderCell = new Cell()
                .add(new Paragraph("조치 전(화면 캡쳐)").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));
        beforeTable.addCell(beforeHeaderCell);

        // 조치 전 이미지가 있으면 추가
        String beforeScreenshot = getFieldValue(fieldMap, "before_fix_screenshot", "");
        if (!beforeScreenshot.isEmpty() && beforeScreenshot.startsWith("data:")) {
            try {
                String base64Image = beforeScreenshot.substring(beforeScreenshot.indexOf(",") + 1);
                byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Image);
                Image image = new Image(ImageDataFactory.create(imageBytes));
                image.setWidth(UnitValue.createPercentValue(80));
                Cell imageCell = new Cell().add(image).setTextAlignment(TextAlignment.CENTER);
                beforeTable.addCell(imageCell);
            } catch (Exception e) {
                Cell emptyCell = new Cell().setHeight(180);
                beforeTable.addCell(emptyCell);
            }
        } else {
            Cell emptyCell = new Cell().setHeight(180);
            beforeTable.addCell(emptyCell);
        }

        document.add(beforeTable);

        // 조치 후 표
        Table afterTable = new Table(1)
                .setWidth(UnitValue.createPercentValue(100))
                .setMarginTop(10);

        Cell afterHeaderCell = new Cell()
                .add(new Paragraph("조치 후(화면 캡쳐)").setFont(font).setFontSize(11).setTextAlignment(TextAlignment.CENTER));
        afterTable.addCell(afterHeaderCell);

        // 조치 후 이미지가 있으면 추가
        String afterScreenshot = getFieldValue(fieldMap, "after_fix_screenshot", "");
        if (!afterScreenshot.isEmpty() && afterScreenshot.startsWith("data:")) {
            try {
                String base64Image = afterScreenshot.substring(afterScreenshot.indexOf(",") + 1);
                byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Image);
                Image image = new Image(ImageDataFactory.create(imageBytes));
                image.setWidth(UnitValue.createPercentValue(80));
                Cell imageCell = new Cell().add(image).setTextAlignment(TextAlignment.CENTER);
                afterTable.addCell(imageCell);
            } catch (Exception e) {
                Cell emptyCell = new Cell().setHeight(180);
                afterTable.addCell(emptyCell);
            }
        } else {
            Cell emptyCell = new Cell().setHeight(180);
            afterTable.addCell(emptyCell);
        }

        document.add(afterTable);
    }

    // 테이블 행 추가 헬퍼 메소드
    private void addTableRow(Table table, PdfFont font, String label, String value) {
        Cell labelCell = new Cell()
                .add(new Paragraph(label).setFont(font).setFontSize(11));
        Cell valueCell = new Cell()
                .add(new Paragraph(value).setFont(font).setFontSize(11));

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    // 필드값 가져오기 (없으면 기본값 사용)
    private String getFieldValue(Map<String, String> fieldMap, String key, String defaultValue) {
        return fieldMap.containsKey(key) ? fieldMap.get(key) : defaultValue;
    }

    // 날짜 형식 변환 (YYYY-MM-DD -> YYYY년 MM월 DD일)
    private String formatDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty() || !dateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return dateStr; // 잘못된 형식이면 원본 반환
        }

        String[] parts = dateStr.split("-");
        return parts[0] + "년 " + parts[1] + "월 " + parts[2] + "일";
    }
}