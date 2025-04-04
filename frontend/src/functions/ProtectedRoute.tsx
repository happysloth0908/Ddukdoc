import { useEffect, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { setCookie } from '@/utils/cookies';
// import { useCookies } from '@/hooks/useCookies';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, loading, checkAuthStatus } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 로그인 안 한 경우 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    const isSsafy = location.pathname.includes('ssafy');
    const loginPath = isSsafy ? '/ssafy/login' : '/login';
    setCookie('auth_redirect_path', location.pathname);
    console.log('로그인이 필요합니다. 리다이렉트 경로:', loginPath);
    return <Navigate to={loginPath} replace />;
  }

  // 로그인된 경우, 원래 컴포넌트 렌더링
  console.log('인증 확인 완료, 보호된 컴포넌트 렌더링');
  return <>{children}</>;
};
