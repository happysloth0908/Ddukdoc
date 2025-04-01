// import { Route, Routes } from 'react-router-dom';
// import { SsafyLoginPage } from './ssafyLoginChildren/SsafyLoginPage';
// import axios from 'axios';
// import { useEffect, useRef, useState } from 'react';
// // import { useSsafyMyStore } from '@/store/ssafyMyInfo';

// export const SsafyLogin = () => {
//   //   const setData = useSsafyMyStore((state) => state.setData);
//   //   const navigate = useNavigate();
//   const [htmlContent, setHtmlContent] = useState<string>('');
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (htmlContent && containerRef.current) {
//       containerRef.current.innerHTML = htmlContent;
//     }
//   }, [htmlContent]);

//   const onSsafyLoginClick = async () => {
//     try {
//       const response = await fetch('/ssafy-api/oauth/sso-check');
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const htmlResponse = await response.text();
//       setHtmlContent(htmlResponse);
//     } catch (e) {
//       if (axios.isAxiosError(e)) {
//         console.log('axios 에러 발생', e.message);
//       } else {
//         console.log('일반 에러 발생', e);
//       }
//     }
//   };
//   return (
//     <div>
//       <Routes>
//         <Route
//           path="first"
//           element={<SsafyLoginPage onSsafyLoginClick={onSsafyLoginClick} />}
//         ></Route>
//       </Routes>
//       {htmlContent && (
//         <div style={{ width: '100%', height: '600px', margin: '20px 0' }}>
//           <iframe
//             srcDoc={htmlContent}
//             style={{
//               width: '100%',
//               height: '100%',
//               border: '1px solid #ccc',
//               display: 'block',
//             }}
//             sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
//             title="SSAFY Login"
//           />
//         </div>
//       )}
//     </div>
//   );
// };
import { Route, Routes } from 'react-router-dom';
import { SsafyLoginPage } from './ssafyLoginChildren/SsafyLoginPage';
import { useEffect, useState } from 'react';

// 사용자 데이터 타입 정의
interface UserData {
  id?: string;
  name?: string;
  // 추가 필요한 사용자 데이터 필드
  [key: string]: any;
}

// 메시지 이벤트 데이터 타입 정의
interface SsafyLoginMessage {
  type: string;
  userData: UserData;
}

export const SsafyLogin = () => {
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // 창 간 메시지 수신을 위한 이벤트 리스너
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 출처 검증은 보안을 위해 중요합니다
      // 실제 도메인에 맞게 조정하세요
      if (event.origin === window.location.origin) {
        try {
          const data = event.data as SsafyLoginMessage;
          if (data && data.type === 'ssafyLogin') {
            console.log('로그인 데이터 수신:', data);
            setIsLoggedIn(true);
            setUserData(data.userData);
            // 여기에 추가 처리 로직 (예: 상태 저장, 리다이렉트 등)
          }
        } catch (error) {
          console.error('메시지 처리 오류:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const onSsafyLoginClick = (): void => {
    // 새 창 열기
    const loginWindow = window.open(
      'https://project.ssafy.com/oauth/sso-check',
      'SSAFY Login',
      'width=600,height=700,resizable=yes,scrollbars=yes,status=yes'
    );

    // 창 열기 실패 처리
    if (!loginWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
  };

  return (
    <div>
      <Routes>
        <Route
          path="first"
          element={<SsafyLoginPage onSsafyLoginClick={onSsafyLoginClick} />}
        />
      </Routes>

      {/* 로그인 상태 표시 (선택 사항) */}
      {isLoggedIn && userData && (
        <div
          style={{
            margin: '20px 0',
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <h3>로그인 성공!</h3>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
