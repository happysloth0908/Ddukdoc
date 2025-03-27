package com.ssafy.ddukdoc.domain.document.dto.request;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import com.ssafy.ddukdoc.domain.user.entity.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.*;

@Getter
@Setter
@Builder
public class DocumentFieldDto {
    @NotNull(message = "필드 ID는 필수입니다.")
    private int fieldId;

    @NotNull(message = "필드 이름은 필수입니다.")
    @Size(min = 1, max = 50, message = "필드 이름은 1자 이상 50자 이하로 입력해주세요.")
    private String name;

    @NotNull(message = "필드 값은 필수입니다.")
    private String fieldValue;

    public DocumentFieldValue toEntity(Document document, TemplateField field, User filledBy) {
        return DocumentFieldValue.builder()
                .document(document)
                .field(field)
                .filledBy(filledBy)
                .fieldValue(this.fieldValue)
                .build();
    }

    public DocumentFieldValue toEntity(Document document, TemplateField field, User filledBy,String fieldValue) {
        return DocumentFieldValue.builder()
                .document(document)
                .field(field)
                .filledBy(filledBy)
                .fieldValue(fieldValue)
                .build();
    }
    public static DocumentFieldDto of(DocumentFieldValue value,String fieldValue) {
        return DocumentFieldDto.builder()
                .fieldId(value.getField().getId())
                .name(value.getField().getName())
                .fieldValue(fieldValue)
                .build();
    }

}
