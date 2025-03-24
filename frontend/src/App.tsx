import { BrowserRouter, Route, Routes } from 'react-router-dom';
import molecules from '@/components/molecules';
import { DocsWrite } from '@/pages/docsWritePages/DocsWrite'

const { worker } = await import('./mocks/browser');

if (import.meta.env.VITE_NODE_ENV === 'development') {
  worker.start();
}

function App() {
  return (
    <div className='w-dvw h-dvh flex justify-center items-center'>
      <BrowserRouter>
        <div className='w-dvw h-dvh md:max-w-md md:max-h-[80%] px-8 border'>
          <molecules.Header children='test' />
          <Routes>
            {/* 문서 작성입니다. */}
            <Route path='/docs' element={<DocsWrite />} />
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
