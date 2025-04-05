// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MyPageMain from './mypagechildren/MyPageMain';
import DocDetail from './mypagechildren/DocDetail';
import PinInput from '@/pages/mypage/mypagechildren/PinInput.tsx';
import EtcFiles from '@/pages/mypage/mypagechildren/EtcFiles.tsx';
import FileDetail from '@/pages/mypage/mypagechildren/FileDetail.tsx';
import DocPreview from './mypagechildren/DocDetailChildren/DocPreview';
import BlockChainPage from './mypagechildren/DocDetailChildren/BlockChainPage';

const MyPage = () => (
  <Routes>
    <Route index element={<MyPageMain />} />
    <Route path="detail/:id/*" element={<DocDetail />} />
    <Route path="preview/:id/" element={<DocPreview />} />
    <Route path="pin/:id" element={<PinInput />} />
    <Route path="preview/:id/files" element={<EtcFiles />} />
    <Route path="preview/:id/files/:fileId" element={<FileDetail />} />
    <Route path="blockchain" element={<BlockChainPage />} />
  </Routes>
);

export default MyPage;
