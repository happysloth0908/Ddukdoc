import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  children: string;
}

export const Header = ({ children }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  useEffect(() => {
    const prevPath = sessionStorage.getItem('currentPath') || '';
    sessionStorage.setItem('previousPath', prevPath);
    sessionStorage.setItem('currentPath', pathname);
  }, [pathname]);

  // 경로에 따라 헤더 제목 변경
  const getTitleByPath = () => {
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments[0] === ' url 경로 ') {
      return '헤더 제목';
    }
  };

  // 뒤로 가기 눌렀을 때
  const onClick = () => {
    if (!document.referrer) {
      // 전에 링크가 없는 경우
      window.location.href = '/';
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="z-100 container sticky left-0 top-0 flex items-center">
      <ChevronLeft onClick={onClick} />
      <span className="text-xs">뒤로 가기</span>
      <div className="absolute left-1/2 -translate-x-1/2">{children}</div>
    </div>
  );
};
