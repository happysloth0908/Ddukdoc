package com.ssafy.ddukdoc.global.config;

import com.ssafy.ddukdoc.domain.auth.service.strategy.KakaoOAuthStrategy;
import com.ssafy.ddukdoc.domain.auth.service.strategy.OAuthStrategy;
import com.ssafy.ddukdoc.domain.auth.service.strategy.SsafyOAuthStrategy;
import com.ssafy.ddukdoc.global.common.constants.Provider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.EnumMap;
import java.util.Map;

@Configuration
public class OAuthConfig {
    @Bean
    public Map<Provider, OAuthStrategy> oAuthStrategyMap(
            KakaoOAuthStrategy kakaoStrategy,
            SsafyOAuthStrategy ssafyStrategy
    ) {
        Map<Provider, OAuthStrategy> strategyMap = new EnumMap<>(Provider.class);
        strategyMap.put(Provider.KAKAO, kakaoStrategy);
        strategyMap.put(Provider.SSAFY, ssafyStrategy);
        return strategyMap;
    }
}
