import { KakaoLoginButton } from './loginChildren/kakaoLoginButton';
import Login from '@/assets/images/login';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const LoginPage = () => {
  const { isLoggedIn, loading, checkAuthStatus } = useAuthStore();
  const navigate = useNavigate();

useEffect(() => {
  checkAuthStatus();
}, [checkAuthStatus]);

useEffect(() => {
  if (isLoggedIn && !loading) {
    navigate('/', { replace: true });
  }
}, [isLoggedIn, loading, navigate]);

if (loading) {
  return <div>로딩 중...</div>;
}

  return (
    <div className="flex grid flex-1 grid-rows-3 flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <img
          alt="뚝닥뚝Doc 제목"
          src={Login.title}
          style={{
            width: '70%',
            height: 'auto',
            maxWidth: '200px',
          }}
        />
      </div>
      <div className="flex items-center justify-center">
        <img
          alt="로고"
          src={Login.hammer}
          style={{
            width: '65%',
            height: 'auto',
            maxWidth: '400px',
          }}
        />
      </div>
      <div className="mb-6 flex w-full justify-center">
        <KakaoLoginButton className="rounded-md py-10" />
      </div>
    </div>
  );
};
