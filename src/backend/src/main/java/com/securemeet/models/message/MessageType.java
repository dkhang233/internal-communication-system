package com.securemeet.models.message;

public enum MessageType {
    TEXT(0),
    LINK(1),
    IMAGE(2),
    AUDIO(3),
    VIDEO(4),
    FILE(5);

    private final int value;

    private MessageType(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
