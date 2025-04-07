package com.ssafy.ddukdoc.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.kms.KmsClient;

@Configuration
public class AWSConfig {

    @Value("${cloud.aws.kms.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.kms.credentials.secretKey}")
    private String secretKey;

    private static final Region REGION = Region.AP_NORTHEAST_2;

    @Bean
    public KmsClient kmsClient() {
        return KmsClient.builder()
                .region(REGION)
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        )
                )
                .build();
    }
}
