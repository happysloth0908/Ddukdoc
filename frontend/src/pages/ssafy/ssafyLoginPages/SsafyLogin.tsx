import { Route, Routes } from 'react-router-dom';
import { SsafyLoginPage } from './ssafyLoginChildren/SsafyLoginPage';
// import { useEffect, useState } from 'react';

// // 사용자 데이터 타입 정의
// interface UserData {
//   id?: string;
//   name?: string;
//   // 추가 필요한 사용자 데이터 필드
//   [key: string]: any;
// }

// // 메시지 이벤트 데이터 타입 정의
// interface SsafyLoginMessage {
//   type: string;
//   userData: UserData;
// }

export const SsafyLogin = () => {
  // // 로그인 상태 관리
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // const [userData, setUserData] = useState<UserData | null>(null);

  // // 창 간 메시지 수신을 위한 이벤트 리스너
  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     // 출처 검증은 보안을 위해 중요합니다
  //     // 실제 도메인에 맞게 조정하세요
  //     if (event.origin === window.location.origin) {
  //       try {
  //         const data = event.data as SsafyLoginMessage;
  //         if (data && data.type === 'ssafyLogin') {
  //           console.log('로그인 데이터 수신:', data);
  //           setIsLoggedIn(true);
  //           setUserData(data.userData);
  //           // 여기에 추가 처리 로직 (예: 상태 저장, 리다이렉트 등)
  //         }
  //       } catch (error) {
  //         console.error('메시지 처리 오류:', error);
  //       }
  //     }
  //   };

  //   window.addEventListener('message', handleMessage);

  //   // 컴포넌트 언마운트 시 이벤트 리스너 정리
  //   return () => {
  //     window.removeEventListener('message', handleMessage);
  //   };
  // }, []);

  const onSsafyLoginClick = (): void => {
    const VITE_SSAFY_CLIENT_ID = import.meta.env.VITE_SSAFY_CLIENT_ID;
    const VITE_SSAFY_REDIRECT_URI = import.meta.env.VITE_SSAFY_REDIRECT_URI;

    // 새 창 열기
    const ssafyLoginURL = `https://project.ssafy.com/oauth/sso-check?client_id=${VITE_SSAFY_CLIENT_ID}&redirect_uri=${VITE_SSAFY_REDIRECT_URI}&response_type=code`;
    window.location.href = ssafyLoginURL;
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<SsafyLoginPage onSsafyLoginClick={onSsafyLoginClick} />}
        />
      </Routes>
      {/* 
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
      )} */}
    </div>
  );
};
