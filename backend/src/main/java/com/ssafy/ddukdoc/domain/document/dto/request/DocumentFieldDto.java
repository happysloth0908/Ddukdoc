package com.ssafy.ddukdoc.domain.document.dto.request;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import com.ssafy.ddukdoc.domain.user.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentFieldDto {
    @NotNull(message = "필드 ID는 필수입니다.")
    @Schema(example = "1")
    private int fieldId;

    @NotNull(message = "필드 이름은 필수입니다.")
    @Size(min = 1, max = 50, message = "필드 이름은 1자 이상 50자 이하로 입력해주세요.")
    @Schema(example = "loan_amount")
    private String name;

    @NotNull(message = "필드 값은 필수입니다.")
    @Schema(example = "2000000")
    private String fieldValue;

    public DocumentFieldValue toEntity(Document document, TemplateField field, User filledBy) {
        return DocumentFieldValue.builder()
                .document(document)
                .field(field)
                .filledBy(filledBy)
                .fieldValue(this.fieldValue)
                .build();
    }
}
