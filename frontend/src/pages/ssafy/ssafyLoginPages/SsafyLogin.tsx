import { Route, Routes } from 'react-router-dom';
import { SsafyLoginPage } from './ssafyLoginChildren/SsafyLoginPage';

export const SsafyLogin = () => {
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
          index
          element={<SsafyLoginPage onSsafyLoginClick={onSsafyLoginClick} />}
        />
      </Routes>
    </div>
  );
};
