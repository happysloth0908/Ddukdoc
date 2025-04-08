import { useEffect, ReactNode, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { setCookie } from '@/utils/cookies';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, loading, checkAuthStatus } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      checkAuthStatus();
      setAuthChecked(true);
    };
    verifyAuth();
  }, []);

  if (!authChecked || loading) {
    return <div>로딩 중...</div>;
  }

  // 로그인 안 한 경우 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    setCookie('auth_redirect_path', location.pathname);
    return <Navigate to={'/login'} replace />;
  }

  // 로그인된 경우, 원래 컴포넌트 렌더링
  console.log('인증 확인 완료, 보호된 컴포넌트 렌더링');
  return <>{children}</>;
};
