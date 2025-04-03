package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMMessageRequest {
    @Schema(example = "sd324ajflksdjf")
    private String userId;
    @Schema(example = "123dajflk34sdjf")
    private String token;
    @Schema(example = "1sdfe2ajflk34sdjf")
    private String channelId;
    @Schema(example = "12")
    private Integer documentId;
    @Schema(example = "안녕하세요")
    private String message;
}
