import { useEffect, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, checkAuthStatus } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading) {
      checkAuthStatus();
    }
  }, [user, loading, checkAuthStatus]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 로그인 안 한 경우 로그인 페이지로 리다이렉트
  if (!user) {
    const isSsafy = location.pathname.includes('ssafy');
    const loginPath = isSsafy ? '/ssafy/login' : '/login';

    console.log('전체 location 객체:', location);
    console.log('location.pathname:', location.pathname);
    console.log('location.href:', window.location.href);
    localStorage.setItem('auth_redirect_path', location.pathname);
    return <Navigate to={loginPath} replace />;
  }

  // 로그인된 경우, 원래 컴포넌트 렌더링
  return <>{children}</>;
};
