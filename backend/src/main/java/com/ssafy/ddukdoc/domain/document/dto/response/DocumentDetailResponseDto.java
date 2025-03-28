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
                                               List<DocumentFieldResponseDto> fieldValues,
                                               SignatureResponseDto signature,
                                               UserRoleResponseDto userRoleInfo) {
        return DocumentDetailResponseDto.builder()
                .docsInfo(DocumentResponseDto.of(document))
                .field(fieldValues)
                .signature(signature)
                .userRoleInfo(userRoleInfo)
                .build();
    }
}
