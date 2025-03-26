package com.ssafy.ddukdoc.domain.contract.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignatureData {
    private Integer id;
    private Integer roleId;
    private byte[] signatureImage;
}
