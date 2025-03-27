import { ChevronLeft } from 'lucide-react';
// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  children: string;
}

export const Header = ({ children }: HeaderProps) => {
  const navigate = useNavigate();

  // 뒤로 가기 눌렀을 때
  const onClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
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
