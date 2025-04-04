package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMMessageToUserRequest {
    @Schema(example = "sd324ajflksdjf")
    @NotBlank(message = "userId는 필수입니다.")
    private String userId;
    @Schema(example = "123dajflk34sdjf")
    @NotBlank(message = "token은 필수입니다.")
    private String token;
    @Schema(example = "1sdfe2ajflk34sdjf")
    @NotBlank(message = "receiverId는 필수입니다.")
    private String receiverId;
    @Schema(example = "12")
    @NotBlank(message = "documentId는 필수입니다.")
    private Integer documentId;
    @Schema(example = "안녕하세요")
    @NotBlank(message = "message는 필수입니다.")
    private String message;
}
