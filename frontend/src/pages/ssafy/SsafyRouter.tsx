import { Routes, Route } from 'react-router-dom';
import { SsafyLogin } from './ssafyLoginPages/SsafyLogin';
import { SsafyMain } from './mainPages/SsafyMain';
import { DocsWrite } from './docsWritePages/DocsWrite';
import { SsafyProtectedRoute } from '@/functions/SsafyProtectedRoute';
import SsafyMyPage from './mypages/MyPage';

function SsafyRouter() {
  return (
    <Routes>
      <Route path="login/*" element={<SsafyLogin />} />
      <Route
        index
        element={
          <SsafyProtectedRoute>
            <SsafyMain />
          </SsafyProtectedRoute>
        }
      />
      <Route
        path="docs/*"
        element={
          // <SsafyProtectedRoute>
            <DocsWrite />
          // </SsafyProtectedRoute>
        }
      />
      <Route
        path="mypage/*"
        element={
          <SsafyProtectedRoute>
            <SsafyMyPage />
          </SsafyProtectedRoute>
        }
      />
    </Routes>
  );
}

export default SsafyRouter;
