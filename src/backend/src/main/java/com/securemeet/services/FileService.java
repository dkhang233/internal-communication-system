package com.securemeet.services;

import com.securemeet.constants.Constant;
import com.securemeet.exceptionhandlers.custom.InvalidDataException;
import com.securemeet.exceptionhandlers.custom.UploadFailed;
import com.securemeet.responses.file.UploadImageResponse;
import com.securemeet.utils.FileUtil;
import com.securemeet.utils.ImageUtil;
import com.securemeet.utils.S3Util;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Service
public class FileService {
    @Value(value = "${s3.bucket.name}")
    private String bucketName;

    @Value(value = "${s3.bucket.public.url}")
    private String publicUrl;

    @Value(value = "${s3.path.file}")
    private String filePath;

    @Value(value = "${s3.path.image}")
    private String imagePath;

    private final S3Util s3Util;

    /**
     * Upload file
     * @param file - file cần upload
     * @return String - url dẫn tới file sau khi upload
     */
    public String upload(MultipartFile file){
        // Kiểm tra kích thước file
         if(file.getSize() > Constant.MAX_FILE_SIZE)
             throw new InvalidDataException("File size cannot exceed 10M");

         // Upload file
         String fileName = s3Util.upload(bucketName, filePath, file);

         // Nếu fileName rỗn, ném lỗi
         if(StringUtils.isBlank(fileName))
             throw new UploadFailed("File upload failed");

         String url =  publicUrl + "/" + fileName;
         return url;
    }

    /**
     *  Upload ảnh
     * @param image - ảnh cần upload
     * @return UploadImageResponse - chứa các đường dẫn tới ảnh gốc và thumbnail tương ứng
     */
    public UploadImageResponse uploadImage(MultipartFile image){
        // Kiểm tra kích thước ảnh
        if (image.getSize() > Constant.MAX_IMAGE_SIZE)
            throw new InvalidDataException("Image size cannot exceed 5M");

        // Kiểm tra có đúng định dạng ảnh cho phép hay không
        if(!FileUtil.isImage(image.getOriginalFilename()))
            throw  new InvalidDataException("The image format is illegal");

        UploadImageResponse response = new UploadImageResponse(); // Tạo response trả về
        String origin = s3Util.upload(bucketName, imagePath, image); // url dẫn tới ảnh gốc

        //Kiểm tra lỗi
        if(origin.isBlank())
            throw new UploadFailed("Image upload failed");

        // Đặt url dẫn tới ảnh gốc vào response
        response.setOriginUrl(publicUrl + "/" + origin);

        // Tạo thumbnail và đặt url dẫn tới thumbnail vào response
        try {
            byte[] imageBytes =  ImageUtil.compressImage(image.getBytes(), Constant.THUMBNAIL_SIZE);
            String thumbnail = s3Util.upload(bucketName,imagePath,imageBytes,image.getOriginalFilename(),image.getContentType());
            if(thumbnail.isBlank())
                throw new UploadFailed("Image upload failed");
            response.setThumbnailUrl(publicUrl + "/" + thumbnail);
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new UploadFailed("Image upload failed");
        }
        
        return response;
    }
}
