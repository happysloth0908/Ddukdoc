package com.ssafy.ddukdoc.domain.share.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MMMessageToChannelRequest {
    @Schema(example = "sd324ajflksdjf")
    @NotBlank(message = "userId는 필수입니다.")
    private String userId;
    @Schema(example = "123dajflk34sdjf")
    @NotBlank(message = "token은 필수입니다.")
    private String token;
    @Schema(example = "1sdfe2ajflk34sdjf")
    @NotBlank(message = "channelId는 필수입니다.")
    private String channelId;
    @Schema(example = "12")
    @NotBlank(message = "documentId는 필수입니다.")
    private Integer documentId;
    @Schema(example = "안녕하세요")
    @NotBlank(message = "message는 필수입니다.")
    private String message;


    public static MMMessageToChannelRequest of(String channelId, MMMessageToUserRequest messageRequest) {
        return MMMessageToChannelRequest.builder()
                .userId(messageRequest.getUserId())
                .token(messageRequest.getToken())
                .channelId(channelId)
                .documentId(messageRequest.getDocumentId())
                .message(messageRequest.getMessage())
                .build();
    }
}
