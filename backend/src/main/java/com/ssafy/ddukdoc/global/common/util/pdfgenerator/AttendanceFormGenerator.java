package com.ssafy.ddukdoc.global.common.util.pdfgenerator;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.AreaBreakType;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Slf4j
public class AttendanceFormGenerator implements DocumentGenerator{
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
        Paragraph title = new Paragraph("삼성 청년 S/W 아카데미 공가/사유 확인서")
                .setFont(font)
                .setBold()
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(15)
                .setUnderline();
        document.add(title);

        // 교육생 및 공가/사유 정보 섹션
        Paragraph infoTitle = new Paragraph("* 교육생 및 공가/사유 정보")
                .setFont(font)
                .setBold()
                .setMarginBottom(5);
        document.add(infoTitle);

        // 성명 및 생년월일
        String birthdate = fieldMap.get("student_birthdate");
        String formattedBirthdate = "";
        if (birthdate != null && birthdate.length() >= 10) {
            // YYYY-MM-DD 형식에서 YYMMDD 형식으로 변환
            formattedBirthdate = birthdate.substring(2, 4) + birthdate.substring(5, 7) + birthdate.substring(8, 10);
        }

        Paragraph nameLine = new Paragraph("- 성 명 : " + fieldMap.get("student_name") + " (생년월일 : " + formattedBirthdate + " )")
                .setFont(font)
                .setMarginBottom(5);
        document.add(nameLine);

        // 일시 및 시간대
        String attendanceDate = fieldMap.get("attendance_datetime");
        String year = "", month = "", day = "";
        if (attendanceDate != null && attendanceDate.length() >= 10) {
            year = attendanceDate.substring(0, 4);
            month = attendanceDate.substring(5, 7);
            day = attendanceDate.substring(8, 10);
        }

        String timeOption = fieldMap.get("attendance_time");
        String morningCheck = timeOption != null && timeOption.equals("오전") ? "■" : "□";
        String afternoonCheck = timeOption != null && timeOption.equals("오후") ? "■" : "□";
        String alldayCheck = timeOption != null && timeOption.equals("종일") ? "■" : "□";

        Paragraph dateLine = new Paragraph("- 일 시 : " + year + " 년 " + month + "월 " + day + "일 " +
                morningCheck + " 오전 " + afternoonCheck + " 오후 " + alldayCheck + " 종일")
                .setFont(font)
                .setMarginBottom(10);
        document.add(dateLine);

        // 공가/사유 내용 상자
        Paragraph absenceTitle = new Paragraph("* 공가/사유 (증빙서류는 별첨으로 뒷장에 첨부 必)")
                .setFont(font)
                .setBold()
                .setMarginBottom(5);
        document.add(absenceTitle);

        // 공가/사유 박스
        Table absenceBox = new Table(1)
                .setWidth(UnitValue.createPercentValue(100))
                .setBorder(new com.itextpdf.layout.borders.SolidBorder(1))
                .setMarginBottom(10);

        Cell boxCell = new Cell();

        // 공가/사유 구분
        String isPublicAbsence = fieldMap.get("is_public_absence");
        String publicCheck = isPublicAbsence != null && isPublicAbsence.startsWith("공가") ? "■" : "□";
        String privateCheck = isPublicAbsence != null && !isPublicAbsence.startsWith("공가") ? "■" : "□";

        Paragraph absenceTypePara = new Paragraph(publicCheck + " 공가(" + (isPublicAbsence != null && isPublicAbsence.startsWith("공가") ? isPublicAbsence.replace("공가", "").trim() : "") + ")")
                .setFont(font)
                .setBold()
                .setMarginBottom(5);
        boxCell.add(absenceTypePara);

        String absenceReason = fieldMap.get("absence_reason");
        Paragraph reasonPara = new Paragraph(privateCheck + " 사유" + (absenceReason != null ? absenceReason : ""))
                .setFont(font)
                .setBold()
                .setMarginBottom(5);
        boxCell.add(reasonPara);

        Paragraph illnessNote = new Paragraph("* 질병으로 인한 사유결석의 경우 아래 결석사유 상세히 작성")
                .setFont(font)
                .setBold()
                .setMarginBottom(5);
        boxCell.add(illnessNote);

        absenceBox.addCell(boxCell);
        document.add(absenceBox);

        // 세부 내용
        Paragraph detailLine = new Paragraph("- 세부내용 : " + fieldMap.get("absence_detail"))
                .setFont(font)
                .setMarginBottom(5);
        document.add(detailLine);

        // 장소
        Paragraph locationLine = new Paragraph("- 장 소 : " + fieldMap.get("location"))
                .setFont(font)
                .setMarginBottom(5);
        document.add(locationLine);

        // 서명
        Paragraph signatureLine = new Paragraph("- 서 명 : " + fieldMap.get("applicant_name") + " (인)")
                .setFont(font)
                .setMarginBottom(10);
        document.add(signatureLine);

        // 사용자 서명 (서명이 있는 경우)
        if (signatures.containsKey(APPLICANT_ROLE_ID)) {
            try {
                Image signature = new Image(ImageDataFactory.create(signatures.get(APPLICANT_ROLE_ID)))
                        .setWidth(60)
                        .setHeight(30);

                // 서명 위치 조정 - 서명란 근처에 배치
                float signatureX = 270;
                float signatureY = 200;

                signature.setFixedPosition(signatureX, signatureY);
                document.add(signature);
            } catch (Exception e) {
                System.err.println("서명 이미지 처리 중 오류 발생: " + e.getMessage());
            }
        }

        // 확인 문구
        Paragraph confirmText1 = new Paragraph("상기 본인은 위 내용이 사실임을 확인하며")
                .setFont(font)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(3);
        document.add(confirmText1);

        Paragraph confirmText2 = new Paragraph("사실이 아닐 경우 삼성 청년 S/W 아카데미 규정에 의해 처리됨을 동의합니다.")
                .setFont(font)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
        document.add(confirmText2);

        // 제출일
        String submittedDate = fieldMap.get("submitted_date");
        String subYear = "", subMonth = "", subDay = "";
        if (submittedDate != null && submittedDate.length() >= 10) {
            subYear = submittedDate.substring(0, 4);
            subMonth = submittedDate.substring(5, 7);
            subDay = submittedDate.substring(8, 10);
        }

        Paragraph datePara = new Paragraph(subYear + " 년 " + subMonth + "월 " + subDay + "일")
                .setFont(font)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(datePara);

        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));

        // 증빙서류 섹션
        Paragraph proofTitle = new Paragraph("[별첨] 증빙서류")
                .setFont(font)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
        document.add(proofTitle);

        // 증빙서류 이미지 (있는 경우)
        String proofDocuments = fieldMap.get("proof_documents");
        if (proofDocuments != null && !proofDocuments.isEmpty() && !proofDocuments.equals("[]")) {
            try {
                // 로그 추가 - 디버깅 용도
                System.out.println("증빙서류 JSON: " + proofDocuments);

                // JSON 배열 형태로 저장된 이미지 URL 또는 Base64 데이터를 파싱
                JSONArray proofArray = new JSONArray(proofDocuments);
                System.out.println("증빙서류 수: " + proofArray.length());

                for (int i = 0; i < proofArray.length(); i++) {
                    String imageData = proofArray.getString(i);
                    System.out.println("이미지 데이터 " + (i+1) + ": " + imageData.substring(0, Math.min(50, imageData.length())) + "...");

                    try {
                        // Base64 또는 URL인 경우를 처리
                        if (imageData.startsWith("data:image")) {
                            // Base64 데이터에서 메타데이터 제거 (예: "data:image/jpeg;base64,")
                            String base64Data = imageData.substring(imageData.indexOf(",") + 1);
                            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

                            // 이미지 추가
                            Image proofImage = new Image(ImageDataFactory.create(imageBytes))
                                    .setWidth(UnitValue.createPercentValue(40))
                                    .setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER)
                                    .setMarginBottom(10);
                            document.add(proofImage);
                            System.out.println("Base64 이미지 추가 성공");
                        } else if (imageData.startsWith("http")) {
                            // 테스트 환경에서 외부 URL에 접근할 수 없으므로 로컬 이미지 사용
                            // 실제 운영 환경에서는 아래 주석을 해제하고 사용
                            Image proofImage = new Image(ImageDataFactory.create(imageData))
                                    .setWidth(UnitValue.createPercentValue(80))
                                    .setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER)
                                    .setMarginBottom(10);
                            document.add(proofImage);
                            System.out.println("URL 이미지 추가 성공");
                        } else {
                            // 이미지 데이터가 Base64나 URL 형식이 아닌 경우
                            Paragraph errorParagraph = new Paragraph("지원하지 않는 이미지 형식: " + imageData.substring(0, Math.min(20, imageData.length())) + "...")
                                    .setFont(font)
                                    .setItalic();
                            document.add(errorParagraph);
                        }
                    } catch (Exception e) {
                        // 각 이미지 처리 중 발생한 예외를 개별적으로 처리
                        Paragraph errorParagraph = new Paragraph("이미지 " + (i+1) + " 처리 중 오류: " + e.getMessage())
                                .setFont(font)
                                .setItalic();
                        document.add(errorParagraph);
                        log.error("증빙서류 이미지 처리 중 오류 발생: {}", e.getMessage(), e);
                    }
                }
            } catch (Exception e) {
                // JSON 파싱 또는 기타 일반 예외 처리
                Paragraph errorParagraph = new Paragraph("증빙서류 처리 중 오류 발생: " + e.getMessage())
                        .setFont(font)
                        .setItalic();
                document.add(errorParagraph);
                log.error("증빙서류 JSON 처리 중 오류 발생: {}", e.getMessage(), e);
            }
        } else {
            // 증빙서류가 없거나 빈 배열인 경우
            Paragraph noProofParagraph = new Paragraph("제출된 증빙서류가 없습니다.")
                    .setFont(font)
                    .setItalic()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(noProofParagraph);
        }
    }
}
