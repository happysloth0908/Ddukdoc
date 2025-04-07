import { Routes, Route } from 'react-router-dom';
import { SsafyLogin } from './ssafyLoginPages/SsafyLogin';
import { SsafyMain } from './mainPages/SsafyMain';
import { DocsWrite } from './docsWritePages/DocsWrite';
import { ProtectedRoute } from '@/functions/ProtectedRoute';
import SsafyMyPage from './mypages/MyPage';

function SsafyRouter() {
  return (
    <div className="h-full w-full">
      <Routes>
        <Route path="login/*" element={<SsafyLogin />} />
        <Route
          index
          element={
            <ProtectedRoute>
              <SsafyMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="docs/*"
          element={
            <ProtectedRoute>
              <DocsWrite />
            </ProtectedRoute>
          }
        />
        <Route
          path="mypage/*"
          element={
            <ProtectedRoute>
              <SsafyMyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default SsafyRouter;
