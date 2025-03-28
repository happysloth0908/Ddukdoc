package com.ssafy.ddukdoc.domain.document.dto.request;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PinCodeRequestDto {
    @NotNull(message = "핀코드는 필수 입력값입니다.")
    @Min(value = 100000, message = "핀코드는 6자리 숫자여야 합니다.")
    @Max(value = 999999, message = "핀코드는 6자리 숫자여야 합니다.")
    @Schema(description = "문서의 핀코드", example = "123456")
    private final Integer pinCode;

    public static PinCodeRequestDto of(Document document){
        return PinCodeRequestDto.builder()
                .pinCode(document.getPin())
                .build();
    }
}