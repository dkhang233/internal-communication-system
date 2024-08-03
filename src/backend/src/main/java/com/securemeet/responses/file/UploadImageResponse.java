package com.securemeet.responses.file;

import lombok.Data;

@Data
public class UploadImageResponse {
    private  String originUrl;  // Url dẫn tới ảnh gốc
    private  String thumbnailUrl; // Url dẫn tới thumbnail
}
