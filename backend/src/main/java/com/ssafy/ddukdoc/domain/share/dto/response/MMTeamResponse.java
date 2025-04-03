package com.ssafy.ddukdoc.domain.share.dto.response;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * [
 *     {
 *         "id": "7rky4c6zntbp5kxtjn4aeeo6ne",
 *         "create_at": 1735268568537,
 *         "update_at": 1735514056620,
 *         "delete_at": 0,
 *         "display_name": "12기 공통 대전1반",
 *         "name": "s12p10b1",
 *         "description": "",
 *         "email": "",
 *         "type": "O",
 *         "company_name": "",
 *         "allowed_domains": "",
 *         "invite_id": "",
 *         "allow_open_invite": false,
 *         "last_team_icon_update": 1735514056620,
 *         "scheme_id": null,
 *         "group_constrained": null,
 *         "policy_id": null,
 *         "cloud_limits_archived": false
 *     },
 */

@Getter
@Builder
public class MMTeamResponse {

    @Schema(example = "ismhz6qc5bbfmrtdqwnacudx5o")
    String userId;
    @Schema(example = "m8prdnfy67yz5ex57pw.....")
    String token;
    List<MMTeam> teams;

    public static MMTeamResponse of(String userId, String token, List<MMTeam> teams) {
        return MMTeamResponse.builder()
                .userId(userId)
                .token(token)
                .teams(teams)
                .build();
    }

    @Getter
    @Builder
    public static class MMTeam {
        @Schema(example = "7rky4c6zntbp5kxtjn4aeeo6ne")
        String id;
        @Schema(example = "12기 공통 대전1반")
        String displayName;

        public static MMTeam of(String id, String display_name) {
            return MMTeam.builder()
                    .id(id)
                    .displayName(display_name)
                    .build();
        }
    }
}
