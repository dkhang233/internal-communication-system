package com.securemeet.utils;

import com.securemeet.exceptionhandlers.custom.InvalidDataException;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Component
public class S3Util {
    private final S3Client s3Client;

    /**
     * Kiểm tra tên bucket đã tồn tại chưa
     * @param bucketName - tên bucket
     * @return boolean  - kết quả kiểm tra
     */
    public boolean bucketExists(String bucketName){
        return s3Client.listBuckets().buckets().stream().anyMatch((bucket) -> bucket.name().equals(bucketName));
    }

    /**
     * Tạo bucket để lưu trữ
     * @param bucketName - Tên bucket cần tạo
     * @return Boolean  - Kết quả tạo bucket
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
     * Xóa bucket
     * @param bucketName - tên bucket cần xóa
     * @return boolean - Kết quả xóa
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

    /**
     * Upload file lên bucket
     * @param bucketName - tên bucket
     * @param path - đường dẫn 
     * @param file - file cần upload
     * @return String - tên của object tương ứng với file sau khi upload lên bucket
     */
    public String upload(String bucketName, String path, MultipartFile file){
        String originalFileName = file.getOriginalFilename();
        if(StringUtils.isBlank(originalFileName)){
            throw new InvalidDataException("Filename is blank");
        }
        String fileName =  UUID.randomUUID()+"-"+ originalFileName;
        String objectName = path + "/" + LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE) + "/" + fileName;
        
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .build();
            RequestBody body = RequestBody.fromInputStream(file.getInputStream(),file.getSize());
            s3Client.putObject(request,body);
        }catch(Exception e){
            log.error(e.getMessage());
            throw new RuntimeException("Upload failed");
        }
        return  objectName;
    }

    public  String upload(String bucketName, String path , byte[] file , String originalFileName , String contentType){
        if(StringUtils.isBlank(originalFileName)){
            throw new InvalidDataException("Filename is blank");
        }
        
        String fileName =  UUID.randomUUID()+"-"+ originalFileName;
        String objectName = path + "/" + LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE) + "/" + fileName;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .contentType(contentType)
                    .build();
            RequestBody body = RequestBody.fromBytes(file);
            s3Client.putObject(request,body);
        }catch(Exception e){
            log.error(e.getMessage());
            throw new RuntimeException("Upload failed");
        }
        
        return  objectName;
    }

    public byte[] download(String bucketName, String filePath){
        if(StringUtils.isBlank(filePath)){
            throw new InvalidDataException("Filename is blank");
        }
       
        try {
            GetObjectRequest request = GetObjectRequest.builder().bucket(bucketName).key(filePath).build();
            return s3Client.getObject(request).readAllBytes();
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
