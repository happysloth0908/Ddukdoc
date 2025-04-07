package com.ssafy.ddukdoc.global.common.util.encrypt.file;

import java.io.File;
import java.util.Map;

public interface FileEncryptionStrategy {
    Map<String, Object> encryptFile(File file);
    File decryptFile(File encryptedFile, String encryptedKeyData, String ivData);
}