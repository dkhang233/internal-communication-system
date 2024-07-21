package com.securemeet.enums;

public enum Role {
    ADMIN(0),
    MANAGER(1),
    EMPLOYEE(2);

    private final int value;

    private Role(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
