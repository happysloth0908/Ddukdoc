package com.ssafy.ddukdoc.domain.document.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserRoleResponseDto {
    private Integer creatorRoleId;
    private Integer recipientRoleId;

    public static UserRoleResponseDto of(Integer creatorRoleId, Integer recipientRoleId) {
        return UserRoleResponseDto.builder()
                .creatorRoleId(creatorRoleId)
                .recipientRoleId(recipientRoleId)
                .build();
    }
}
