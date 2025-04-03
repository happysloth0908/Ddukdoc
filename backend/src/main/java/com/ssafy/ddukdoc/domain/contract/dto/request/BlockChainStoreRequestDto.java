package com.ssafy.ddukdoc.domain.contract.dto.request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@AllArgsConstructor
@ToString
public class BlockChainStoreRequestDto {
    // 요청자 주소 (토큰 소유자 또는 컨트롤러)
    private String requestor;

    // 문서 이름
    private String name;

    // 문서 URI (이 경우에는 빈 문자열로 설정)
    private String docUri;

    // 문서 해시값 (0x 접두사 포함한 16진수 문자열)
    private String docHash;

    // 서명 (요청 데이터에 대한 서명)
    private String signature;

}
