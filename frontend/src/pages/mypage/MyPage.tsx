// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MyPageMain from './mypagechildren/MyPageMain';
import DocDetail from '../docs/DocDetail';

const MyPage = () => (
  <Routes>
    <Route index element={<MyPageMain />} />
    <Route path="docs/:id" element={<DocDetail />} />
  </Routes>
);

export default MyPage;
