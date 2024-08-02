package com.securemeet.utils;

import org.springframework.util.ReflectionUtils;

import java.util.ArrayList;
import java.util.List;

public class BeanUtil {

    private static void  handleReflectionException(Exception e){
        ReflectionUtils.handleReflectionException(e);
    }

    public  static <T,U> List<U> copyProperties(List<T> sourceList, Class<U> targetClass){
        if(sourceList == null || sourceList.size() == 0){
            return  List.of();
        }

        List<U> result = new ArrayList<>();
        sourceList.forEach((s) -> {
            result.add(copyProperties(s, targetClass));
        });
        return  result;
    }

    public static <T> T copyProperties(Object origin, Class<T> targetClass) {
        try {
                Object target = targetClass.getDeclaredConstructor().newInstance();
                if (origin == null)
                    return  null;
                copyProperties(origin, target);
                return  (T)target;
            } catch (Exception e) {
                handleReflectionException(e);
                return  null;
            }
    }

    public static void copyProperties(Object origin, Object target) {
        try {
            org.springframework.beans.BeanUtils.copyProperties(origin, target);
        } catch (Exception e) {
            handleReflectionException(e);
        }
    }
}
