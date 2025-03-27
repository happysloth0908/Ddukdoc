package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import lombok.Builder;
import lombok.Getter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class DocumentDetailResponseDto {
    private DocumentResponseDto docsInfo;
    private List<DocumentFieldResponseDto> field;
    private SignatureResponseDto signature;
    private UserRoleResponseDto userRoleInfo;

    public static DocumentDetailResponseDto of(Document document,
                                               List<DocumentFieldValue> fieldValues,
                                               SignatureResponseDto signature,
                                               UserRoleResponseDto userRoleInfo) {
        return DocumentDetailResponseDto.builder()
                .docsInfo(DocumentResponseDto.of(document))
                .field(fieldValues.stream()
                        .map(DocumentFieldResponseDto::of)
                        .collect(Collectors.toList()))
                .signature(signature)
                .userRoleInfo(userRoleInfo)
                .build();
    }
}
