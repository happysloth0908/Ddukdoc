package com.ssafy.ddukdoc.global.common.constants;

public enum UserType {
    GENERAL, SSAFY;

    public String getName() {
        return this.name().toLowerCase();
    }
}
