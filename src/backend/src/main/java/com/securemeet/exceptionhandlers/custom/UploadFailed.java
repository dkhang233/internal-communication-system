package com.securemeet.exceptionhandlers.custom;

public class UploadFailed extends RuntimeException{
    public  UploadFailed(String message){
        super(message);
    }
}
