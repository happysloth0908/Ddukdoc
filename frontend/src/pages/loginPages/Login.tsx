import { KakaoLoginButton } from './loginChildren/kakaoLoginButton';
import Login from '@/assets/images/login';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const { user, loading, checkAuthStatus } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 이미 로그인한 경우 원래 가려던 페이지로 리다이렉트
  useEffect(() => {
    if (user && !loading) {
      // localStorage에서 리다이렉트 경로 가져오기
      const redirectPath = localStorage.getItem('auth_redirect_path');

      if (redirectPath) {
        // 사용 후 삭제
        localStorage.removeItem('auth_redirect_path');
        navigate(redirectPath);
      } else {
        // 기본 리다이렉트 경로
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center">
      <img
        alt="뚝닥뚝Doc 제목"
        src={Login.title}
        style={{
          width: '70%',
          height: 'auto',
          maxWidth: '200px',
        }}
        className="my-20"
      />
      <img
        alt="로고"
        src={Login.logo}
        style={{
          width: '50%',
          height: 'auto',
          maxWidth: '150px',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 mb-6 flex justify-center px-4">
        <KakaoLoginButton className="rounded-md py-10" />
      </div>
    </div>
  );
};
