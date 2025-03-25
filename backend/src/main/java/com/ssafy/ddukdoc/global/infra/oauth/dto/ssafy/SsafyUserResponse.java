package com.ssafy.ddukdoc.global.infra.oauth.dto.ssafy;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SsafyUserResponse {
    @JsonProperty("userId")
    private String userId;

    @JsonProperty("email")
    private String email;

    @JsonProperty("name")
    private String name;
}
