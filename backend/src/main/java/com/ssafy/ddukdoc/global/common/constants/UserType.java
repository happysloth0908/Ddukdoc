package com.ssafy.ddukdoc.global.common.constants;

public enum UserType {
    GENERAL, SSAFY, TEST, ADMIN;

    public String getLowerCaseName() {
        return this.name().toLowerCase();
    }

    public static UserType getUserTypeByProvider (Provider provider) {
        if (provider == Provider.SSAFY) {
            return UserType.SSAFY;
        } else {
            return UserType.GENERAL;
        }
    }
}
