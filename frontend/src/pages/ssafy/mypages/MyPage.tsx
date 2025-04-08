import { Route, Routes } from 'react-router-dom';
import MyPageMain from './mypageChildren/MyPageMain';
import SsafyDocsDetail from './mypageChildren/SsafyDocsDetail';
import SsafyDocPatch from './mypageChildren/SsafyDocPatch';
import SsafySignPatch from './mypageChildren/SsafySignPatch';
import SsafyDocFinalCheck from './mypageChildren/SsafyDocFinalCheck';
import MmShare from './mypageChildren/MmShare';
import ShareSuccess from './mypageChildren/mmChildren/ShareSuccess';

const MyPage = () => {
  return (
    <Routes>
      <Route index element={<MyPageMain />} />
      <Route path="detail/:id" element={<SsafyDocsDetail />} />
      <Route path="patch/:id" element={<SsafyDocPatch />} />
      <Route path="sign/:id" element={<SsafySignPatch />} />
      <Route path="check/:id" element={<SsafyDocFinalCheck />} />
      <Route path="share/:id/*" element={<MmShare />} />
      <Route path="success" element={<ShareSuccess />} />
    </Routes>
  );
};

export default MyPage;
