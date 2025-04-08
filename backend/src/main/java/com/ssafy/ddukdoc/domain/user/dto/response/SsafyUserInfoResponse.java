package com.ssafy.ddukdoc.domain.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SsafyUserInfoResponse {
    @Schema(example = "심규빈")
    private String name;
    @Schema(example = "skb0516@naver.com")
    private String email;
    @Schema(example = "대전")
    private String region;
    @Schema(example = "N // 퇴소여부")
    private String retireYn;
    @Schema(example = "특화 // ex) 1학기, 공통, 특화")
    private String category;
    @Schema(example = "뚝딱뚝Doc // ex) projectSsafy 미설정 시 '대전1반 8팀'")
    private String projectName;

    public static SsafyUserInfoResponse of(String name, String email, String region, String retireYn, String category, String projectName) {
        return SsafyUserInfoResponse.builder()
                .name(name)
                .email(email)
                .region(region)
                .retireYn(retireYn)
                .category(category)
                .projectName(projectName)
                .build();
    }
}
