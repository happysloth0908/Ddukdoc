package com.ssafy.ddukdoc.domain.share.dto.response;

import com.ssafy.ddukdoc.domain.share.dto.request.MMChannelRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MMChannelResponse {

    @Schema(example = "ismhz6qc5bbfmrtdqwnacudx5o")
    private String userId;
    @Schema(example = "m8prdnfy67yz5ex57pw.....")
    private String token;
    @Schema(example = "ctadrfe613fppgbzw36g6kyoih")
    private String teamId;
    private List<MMChannel> channels;

    public static MMChannelResponse of(MMChannelRequest channelRequest, List<MMChannel> channels) {
        return MMChannelResponse.builder()
                .userId(channelRequest.getUserId())
                .token(channelRequest.getToken())
                .teamId(channelRequest.getTeamId())
                .channels(channels)
                .build();
    }

    @Getter
    @Builder
    public static class MMChannel {
        @Schema(example = "eqcw7giuppyhxd8zd35p4rnwfy")
        private String id;
        @Schema(example = "P")
        private String type;
        @Schema(example = "특화 프로젝트 B108 🏆")
        private String displayName;

        public static MMChannel of(String id, String type, String displayName) {
            return MMChannel.builder()
                    .id(id)
                    .type(type)
                    .displayName(displayName)
                    .build();
        }
    }
}
