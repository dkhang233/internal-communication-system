package com.securemeet.configs;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;
import java.time.Duration;

@Data
@Slf4j
@Configuration
public class S3ClientConfig {

    @Value("${s3.endpoint}")
    private String endpoint;

    @Value("${s3.access-key}")
    private String accessKey;

    @Value("${s3.secret-key}")
    private String secretKey;


    @Bean
    public S3Client createS3Client(){
        AwsCredentials credentials = new AwsCredentials() {
            @Override
            public String accessKeyId() {
                return accessKey;
            }

            @Override
            public String secretAccessKey() {
                return secretKey;
            }
        };
        StaticCredentialsProvider provider = StaticCredentialsProvider.create(credentials);
        Region region = Region.of("APAC");
        return  S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(provider)
                .region(region)
                .build();
    }

    
}

