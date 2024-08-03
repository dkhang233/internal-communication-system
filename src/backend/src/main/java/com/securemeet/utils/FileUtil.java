package com.securemeet.utils;

import java.util.Arrays;

public class FileUtil {
    /**
     * Lấy file extension
     * @param fileName - Tên của file cần lấy extension
     * @return String  - Extension
     */
    public static String getFileExtension(String fileName){
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        return  extension;
    }

    /**
     * Kiểm tra xem có là file ảnh không
     * @param fileName - Tên file ảnh
     * @return boolean - Có phải là file ảnh hay không ?
     */
    public static boolean isImage(String fileName){
        String fileExtension = getFileExtension(fileName);
        String[] imageExtension = new String[]{"jpeg","jpg","png","bmp","webp","gif"};
        return Arrays.stream(imageExtension).anyMatch(e -> fileExtension.toLowerCase().equals(e));
    }
}
