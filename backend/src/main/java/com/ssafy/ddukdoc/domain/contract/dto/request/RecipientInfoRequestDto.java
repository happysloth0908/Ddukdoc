package com.ssafy.ddukdoc.domain.contract.dto.request;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RecipientInfoRequestDto {

    @NotNull(message = "역할 ID는 필수입니다.")
    @Schema(example = "2")
    private Integer roleId;

    @Valid
    @NotNull(message = "필드 데이터는 필수입니다.")
    private List<DocumentFieldDto> data;
}
