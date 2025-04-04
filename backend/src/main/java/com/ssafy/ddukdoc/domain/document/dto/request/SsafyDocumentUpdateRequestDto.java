package com.ssafy.ddukdoc.domain.document.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SsafyDocumentUpdateRequestDto {

    @NotNull(message = "문서 제목은 필수입니다.")
    @Size(min = 1, max = 100, message = "문서 제목은 1자 이상 100자 이하로 입력해주세요.")
    @Schema(example = "김싸피 노트북반출확인서")
    private String title;

    @NotNull(message = "문서 입력 data는 필수입니다.")
    private List<DocumentFieldDto> data;
}
