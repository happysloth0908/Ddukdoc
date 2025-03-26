import Login from '@/assets/images/login';

interface KakaoLoginButtonProps {
  className: string;
}

export const KakaoLoginButton = ({ className }: KakaoLoginButtonProps) => {
  return (
    <button className={className}>
      <img src={Login.kakao_login} alt="카카오 로그인" className="w-full" />
    </button>
  );
};
