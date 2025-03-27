package com.ssafy.ddukdoc.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Optional;

@Getter
@RequiredArgsConstructor
public enum UserDocRoleStatus {
    ROLE_2_TO_3(2,3),
    ROLE_3_TO_2(3,2),
    ROLE_4_TO_5(4,5),
    ROLE_5_TO_4(5,4),
    ROLE_6_SELF(6,6);

    private final Integer creatorRoleId;
    private final Integer recipientRoleId;

    /**
     * 현재 발신자 역할 ID에 매칭되는 수신자 역할을 반환
     * @param creatorRoleId 발신자 역할 ID
     * @return 매핑되는 수신자 역할 ID를 반환
     */
    public static Optional<Integer> getRecipientRole(Integer creatorRoleId){
        return Arrays.stream(values())
                .filter(role -> role.creatorRoleId.equals(creatorRoleId))
                .map(UserDocRoleStatus::getRecipientRoleId)
                .findFirst();
        
    }
}
