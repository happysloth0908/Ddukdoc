package com.ssafy.ddukdoc.global.common.constants;

public enum UserType {
    GENERAL, SSAFY, TEST, ADMIN;

    public String getName() {
        return this.name().toLowerCase();
    }
}
