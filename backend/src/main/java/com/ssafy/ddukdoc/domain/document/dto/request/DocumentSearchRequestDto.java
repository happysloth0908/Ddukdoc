package com.ssafy.ddukdoc.domain.document.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;

@Getter
@Setter
public class DocumentSearchRequestDto {

    @NotNull(message = "sendReceiveStatus는 필수입니다.")
    private Integer sendReceiveStatus;

    @Pattern(regexp = "^[A-Z]\\d$", message = "templateCode는 알파벳 대문자 한 글자와 숫자 한 자리 형식이어야 합니다.")
    private String templateCode;

    @Size(max = 50, message = "keyword는 최대 50자까지 가능합니다.")
    private String keyword;
    private String status;
    private LocalDateTime createdAt;

    public void setSend_receive_status(Integer sendReceiveStatus) {
        this.sendReceiveStatus = sendReceiveStatus;
    }

    public void setTemplate_code(String templateCode){
        this.templateCode = templateCode;
    }

    public void setCreated_at(LocalDateTime createdAt){
        this.createdAt = createdAt;
    }
}
