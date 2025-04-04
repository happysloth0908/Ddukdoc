package com.ssafy.ddukdoc.domain.verification.service;

import com.ssafy.ddukdoc.global.common.util.blockchain.BlockchainUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VerificationService {

    private final BlockchainUtil blockchainUtil;

    public void documentVerification() {

    }
}
