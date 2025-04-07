package com.ssafy.ddukdoc.global.common.util.encrypt.data;

import java.security.SecureRandom;

import static com.ssafy.ddukdoc.global.common.util.encrypt.AESConstants.IV_LENGTH;

public interface EncryptionStrategy {
    String encrypt(String data);
    String decrypt(String encryptedData);

    default byte[] generateIV() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }
}