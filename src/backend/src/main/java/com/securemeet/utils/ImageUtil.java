package com.securemeet.utils;


import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnailator;
import net.coobird.thumbnailator.Thumbnails;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Slf4j
public class ImageUtil {
    private static final Integer ZERO = 0;
    private static final Integer ONE_ZERO_TWO_FOUR = 1024;
    private static final Integer NINE_ZERO_ZERO = 900;
    private static final Integer THREE_TWO_SEVEN_FIVE = 3275;
    private static final Integer TWO_ZERO_FOUR_SEVEN = 2047;
    private static final Double ZERO_EIGHT_FIVE = 0.85;
    private static final Double ZERO_SIX = 0.6;
    private static final Double ZERO_FOUR_FOUR = 0.44;
    private static final Double ZERO_FOUR = 0.4;

    /**
     * Nén ảnh
     * @param imageBytes - ảnh cần nén(dạng mảng byte)
     * @param desFileSize - kích thước sau nén
     * @return byte[] - ảnh sau nén(dạng mảng byte)
     */
    public static byte[] compressImage(byte[] imageBytes, long desFileSize){
        if(imageBytes == null  || imageBytes.length == 0 || imageBytes.length <= desFileSize){
            return  imageBytes;
        }
        long srcSize = imageBytes.length;
        double accuracy = getAccuracy(srcSize);
        try {
            while (imageBytes.length > desFileSize){
                ByteArrayInputStream input = new ByteArrayInputStream(imageBytes);
                ByteArrayOutputStream result = new ByteArrayOutputStream(imageBytes.length);
                Thumbnails.of(input)
                        .scale(accuracy)
                        .outputQuality(accuracy)
                        .toOutputStream(result);
                imageBytes = result.toByteArray();
            }
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return imageBytes;
    }

    /**
     * Trả về độ chính xách thích hợp dựa vào kích thước file
     * @param srcSize - kích thước file cần nến
     * @return double - độ chính xác
     */
    private static double getAccuracy(long srcSize){
        double accuracy;
        if(srcSize < NINE_ZERO_ZERO)
            accuracy = ZERO_EIGHT_FIVE;
        else if (srcSize < TWO_ZERO_FOUR_SEVEN)
            accuracy = ZERO_SIX;
        else if (srcSize < THREE_TWO_SEVEN_FIVE)
            accuracy = ZERO_FOUR_FOUR;
        else
            accuracy = ZERO_FOUR;
        return  accuracy;
    }
}
