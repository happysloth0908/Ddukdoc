package com.ssafy.ddukdoc.domain.document.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserRoleResponseDto {
    @Schema(example = "1")
    private Integer creatorRoleId;
    @Schema(example = "2")
    private Integer recipientRoleId;

    public static UserRoleResponseDto of(Integer creatorRoleId, Integer recipientRoleId) {
        return UserRoleResponseDto.builder()
                .creatorRoleId(creatorRoleId)
                .recipientRoleId(recipientRoleId)
                .build();
    }
}
