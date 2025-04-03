package com.ssafy.ddukdoc.domain.document.dto.request;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentStatus;
import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.domain.user.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class DocumentSaveRequestDto {
    @NotNull(message = "작성자 역할(role_id)는 필수입니다.")
    @Schema(example = "1")
    private int roleId;

    @NotNull(message = "문서 제목은 필수입니다.")
    @Size(min = 1, max = 100, message = "문서 제목은 1자 이상 100자 이하로 입력해주세요.")
    @Schema(example = "홍길동 차용증")
    private String title;

    @NotNull(message = "문서 입력 data는 필수입니다.")
    private List<DocumentFieldDto> data;

    public Document toEntity(User creator, Template templateId,TemplateCode templateCode) {
        return Document.builder()
                .title(this.title)
                .creator(creator)
                .template(templateId)
                .status(DocumentStatus.getInitialStatus(templateCode))
                .build();
    }

    public Document toEntity(User creator, Template templateId, int pin, TemplateCode templateCode) {
        return Document.builder()
                .title(this.title)
                .creator(creator)
                .template(templateId)
                .pin(pin)
                .status(DocumentStatus.getInitialStatus(templateCode))
                .build();
    }
}
