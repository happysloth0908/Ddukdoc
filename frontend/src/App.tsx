import { Route, Routes, useLocation } from 'react-router-dom';
import molecules from '@/components/molecules';
import { DocsWrite } from '@/pages/docsWritePages/DocsWrite';
import { MainMenuPage } from '@/pages/mainPage/MainMenuPage';
// import { worker } from './mocks/browser';
import { LoginPage } from '@/pages/loginPages/Login';
import { ForgeryInspection } from './pages/forgeryInspectionPages/ForgeryInspection';

// if (import.meta.env.VITE_NODE_ENV === 'development') {
//   worker.start();
// }

function App() {
  const location = useLocation();
  const isMainRoute = location.pathname === '/';
  const bgClass = isMainRoute
    ? 'bg-backgroundswirl bg-no-repeat bg-cover'
    : 'bg-white';

  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <div
        className={`relative flex h-dvh w-dvw flex-col border px-8 md:max-w-md ${bgClass} `}
      >
        <molecules.Header children="test" />
        <Routes>
          {/* 문서 작성입니다. */}
          <Route path="/docs" element={<DocsWrite />} />
          {/* 메인 페이지 */}
          <Route path="/" element={<MainMenuPage />} />
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          {/* 마이페이지 */}
          {/* <Route path='/mypage' element={} /> */}
          {/* 위변조 검사 */}
          <Route path="/forgery" element={<ForgeryInspection />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
