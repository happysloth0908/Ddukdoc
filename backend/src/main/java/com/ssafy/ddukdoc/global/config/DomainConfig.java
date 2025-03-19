package com.ssafy.ddukdoc.global.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class DomainConfig {

    @Value("${app.cookie-domain}")
    private String domain;

    @Value("${app.is-local}")
    private Boolean isLocal;
}
