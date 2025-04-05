package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class DocumentDetailResponseDto {
    private DocumentResponseDto docsInfo;
    private List<DocumentFieldResponseDto> field;
    private SignatureResponseDto signature;
    private UserRoleResponseDto userRoleInfo;
    private boolean recipient;

    public static DocumentDetailResponseDto of(Document document,
                                               List<DocumentFieldResponseDto> fieldValues,
                                               SignatureResponseDto signature,
                                               UserRoleResponseDto userRoleInfo,
                                               boolean isRecipient
        ) {
        return DocumentDetailResponseDto.builder()
                .docsInfo(DocumentResponseDto.of(document))
                .field(fieldValues)
                .signature(signature)
                .userRoleInfo(userRoleInfo)
                .recipient(isRecipient)
                .build();
    }
}
