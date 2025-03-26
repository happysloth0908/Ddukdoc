package com.ssafy.ddukdoc.domain.material.service;

import com.ssafy.ddukdoc.domain.material.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;

    public void uploadMaterial(Integer documentId, String title, MultipartFile file){

    }

}
