// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MyPageMain from './mypagechildren/MyPageMain';
import DocDetail from './mypagechildren/DocDetail';
import PinInput from '@/pages/mypage/mypagechildren/PinInput.tsx';
import EtcFiles from '@/pages/mypage/mypagechildren/EtcFiles.tsx';
import FileDetail from '@/pages/mypage/mypagechildren/FileDetail.tsx';

const MyPage = () => (
  <Routes>
    <Route index element={<MyPageMain />} />
    <Route path="docs/:id" element={<DocDetail />} />
    <Route path="pin/:id" element={<PinInput />} />
    <Route path="docs/:id/files" element={<EtcFiles />} />
    <Route path="docs/:id/files/:fileId" element={<FileDetail />} />
  </Routes>
);

export default MyPage;
