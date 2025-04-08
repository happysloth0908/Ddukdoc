package com.ssafy.ddukdoc.superapp.util;

public interface MetadataProcessor {
    /**
     * 문서에 메타데이터를 추가합니다.
     * @param data 원본 문서 바이트 배열
     * @param docName 추가할 문서 이름
     * @return 메타데이터가 추가된 문서 바이트 배열
     */
    byte[] addMetadata(byte[] data, String docName);
    boolean supportsExtension(String extension);
}
