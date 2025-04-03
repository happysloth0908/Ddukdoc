import { Route, Routes, useLocation } from 'react-router-dom';
import molecules from '@/components/molecules';
import { DocsWrite } from '@/pages/docsWritePages/DocsWrite';
import { MainMenuPage } from '@/pages/mainPage/MainMenuPage';
// import { worker } from './mocks/browser';
import { LoginPage } from '@/pages/loginPages/Login';
import MyPage from '@/pages/mypage/MyPage.tsx';
import { ForgeryInspection } from './pages/forgeryInspectionPages/ForgeryInspection';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import { ProtectedRoute } from './functions/ProtectedRoute';
// if (import.meta.env.VITE_NODE_ENV === 'development') {
//   worker.start();
// }

function App() {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const location = useLocation();
  const isMainRoute = location.pathname === '/';
  const bgClass = isMainRoute
    ? 'bg-backgroundswirl bg-no-repeat bg-cover'
    : 'bg-bg-default';

  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <div
        className={`relative flex h-dvh w-dvw flex-col border px-8 md:max-w-md ${bgClass} `}
      >
        <molecules.Header />
        <Routes>
          {/*  공개 라우트  */}
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 문서 작성입니다. */}
          <Route
            path="/docs/*"
            element={
              <ProtectedRoute>
                <DocsWrite />
              </ProtectedRoute>
            }
          />
          {/* 메인 페이지 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainMenuPage />
              </ProtectedRoute>
            }
          />
          {/* 마이페이지 */}
          <Route
            path="/mypage/*"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          {/* 위변조 검사 */}
          <Route
            path="/forgery/*"
            element={
              <ProtectedRoute>
                <ForgeryInspection />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
