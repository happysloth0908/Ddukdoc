// 라우팅 관련
import { Route, Routes } from 'react-router-dom';
// 헤더
import molecules from '@/components/molecules';

// 문서 작성
import { DocsWrite } from '@/pages/docsWritePages/DocsWrite'

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


function App() {
  const location = useLocation();

  useEffect(() => {
    console.log('지금 경로는', location, "입니다.");
  }, [location]);


  return (
    <div className='w-dvw h-dvh flex justify-center items-center'>
        <div className='relative flex flex-col w-dvw h-dvh px-8 md:max-w-md border'>
          <molecules.Header children='test' />
          <Routes>
            {/* 문서 작성입니다. */}
            <Route path='/docs/*' element={<DocsWrite />} />
            {/* 마이페이지 */}
            {/* <Route path='/mypage' element={} /> */}
            {/* 위변조 검사 */}
            {/* <Route path='/forgery' element={} /> */}
          </Routes>
        </div>
    </div>
  );
}

export default App;
