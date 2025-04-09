import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  // 뒤로 가기 눌렀을 때
  const onClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const getTitleByPath = () => {
    if (pathname.startsWith('*/docs')) return '문서 작성';
    if (pathname.startsWith('*/mypage')) return '나의 문서';
    if (pathname.startsWith('*/forgery')) return '위변조 확인';
    return '';
  };

  return (
    <div className="flex w-full justify-center">
      {!pathname.startsWith('/login') &&
        !(pathname === '/') &&
        !(pathname === '/ssafy') &&
        !(pathname === '/ssafy/login') &&
        !(pathname === '/docs/share') &&
        !(pathname === '/ssafy/docs/share') &&
        !(pathname === '/mypage/pin/*') && 
        !(pathname === '/mypage/blockchain') && (
          <div className="z-100 sticky left-0 top-0 -mx-8 flex w-full items-center bg-bg-default py-5">
            <ArrowLeft className="text-primary-300" onClick={onClick} />
            <span className="text-md"></span>
            <div className="w-full flex-1 text-center text-info-small">
              {getTitleByPath()}
            </div>
            <LogOut className="invisible text-primary-300" />
          </div>
        )}
    </div>
  );
};
