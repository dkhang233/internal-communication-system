package com.securemeet.controllers;

import com.securemeet.responses.ApiResponseData;
import com.securemeet.responses.file.UploadImageResponse;
import com.securemeet.services.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RequestMapping("${api.prefix}/files")
@RestController
public class FileController {
    private final FileService fileService;
    
    @PostMapping("/upload")
    public ApiResponseData<String> uploadFile(@RequestBody MultipartFile file){
        return  ApiResponseData.success(fileService.upload(file));
    }

    @PostMapping("/upload/image")
    public ApiResponseData<UploadImageResponse> uploadImage(@RequestBody MultipartFile image){
        return  ApiResponseData.success(fileService.uploadImage(image));
    }

    @GetMapping("/download")
    public byte[] download(@RequestParam String filePath) {
        return fileService.download(filePath);
    }

}
