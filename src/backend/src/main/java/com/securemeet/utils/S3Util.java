package com.securemeet.utils;

import com.securemeet.exceptionhandlers.custom.InvalidDataException;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteBucketRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Component
public class S3Util {
    private  final S3Client s3Client;

    /**
     * Check whether the storage bucket exists
     * @return boolean
     */
    public boolean bucketExists(String bucketName){
        return s3Client.listBuckets().buckets().stream().anyMatch((bucket) -> bucket.name().equals(bucketName));
    }

    /**
     * Create storage bucket
     * @return Boolean
     */
    public boolean createBucket(String bucketName){
        try {
            CreateBucketRequest request = CreateBucketRequest.builder()
                    .bucket(bucketName)
                    .build();
            s3Client.createBucket(request);
        }catch (Exception e){
            log.error(e.getMessage());
            return false;
        }
        return true;
    }

    /**
     * Delete storage bucket
     * @return Boolean
     */
    public boolean deleteBucket(String bucketName){
        try {
            DeleteBucketRequest request = DeleteBucketRequest.builder()
                    .bucket(bucketName)
                    .build();
            s3Client.deleteBucket(request);
        }catch (Exception e){
            log.error(e.getMessage());
            return false;
        }
        return true;
    }

    public String upload(String bucketName, String path, MultipartFile file){
        String originalFileName = file.getOriginalFilename();
        if(StringUtils.isBlank(originalFileName)){
            throw new InvalidDataException("Filename is blank");
        }
        String fileName =  UUID.randomUUID() + originalFileName;
        String objectName = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE) + "/" + fileName;
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .build();
            RequestBody body = RequestBody.fromInputStream(file.getInputStream(),file.getSize());
            s3Client.putObject(request,body);
        }catch(Exception e){
            log.error(e.getMessage());
        }
        return  objectName;
    }
}
