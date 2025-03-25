import { BrowserRouter, Route, Routes } from 'react-router-dom';
import molecules from '@/components/molecules';
// import { DocsWrite } from '@/pages/docsWritePages/DocsWrite';
import { LoginPage } from '@/pages/loginPages/Login';

const { worker } = await import('./mocks/browser');

if (import.meta.env.VITE_NODE_ENV === 'development') {
  worker.start();
}

function App() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <BrowserRouter>
        <div className="h-dvh w-dvw border px-8 md:max-h-[80%] md:max-w-md">
          <molecules.Header children="test" />
          <Routes>
            {/* 로그인 페이지 */}
            <Route path="/login" element={<LoginPage />} />
            {/* 문서 작성입니다. */}
            {/* <Route path="/docs" element={<DocsWrite />} /> */}
            {/* 마이페이지 */}
            {/* <Route path='/mypage' element={} /> */}
            {/* 위변조 검사 */}
            {/* <Route path='/forgery' element={} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
