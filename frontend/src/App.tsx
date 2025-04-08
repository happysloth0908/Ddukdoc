import { Route, Routes, useLocation } from 'react-router-dom';
import molecules from '@/components/molecules';
import { DocsWrite } from '@/pages/docsWritePages/DocsWrite';
import { MainMenuPage } from '@/pages/mainPage/Main';
// import { worker } from './mocks/browser';
import { LoginPage } from '@/pages/loginPages/Login';
import MyPage from '@/pages/mypage/MyPage.tsx';
import { ForgeryInspection } from './pages/forgeryInspectionPages/ForgeryInspection';
import { ProtectedRoute } from './functions/ProtectedRoute';
import { SsafyProtectedRoute } from './functions/SsafyProtectedRoute';
import SsafyRouter from './pages/ssafy/SsafyRouter';
// if (import.meta.env.VITE_NODE_ENV === 'development') {
//   worker.start();
// }

function App() {
  const location = useLocation();
  const isMainRoute = location.pathname === '/';
  const isSsafy =
    location.pathname === '/ssafy/login' || location.pathname === '/ssafy';
  const bgClass = isMainRoute
    ? 'bg-backgroundswirl bg-no-repeat bg-cover'
    : isSsafy
      ? 'bg-blue-gradient'
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
              // <ProtectedRoute>
              <MainMenuPage />
              // </ProtectedRoute>
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
              location.state?.fromSsafy ? (
                <SsafyProtectedRoute>
                  <ForgeryInspection />
                </SsafyProtectedRoute>
              ) : (
                <ProtectedRoute>
                  <ForgeryInspection />
                </ProtectedRoute>
              )
            }
          />
          <Route path="/ssafy/*" element={<SsafyRouter />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
