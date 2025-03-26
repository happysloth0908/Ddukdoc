import Login from '@/assets/images/login';

interface KakaoLoginButtonProps {
  className?: string;
}

export const KakaoLoginButton = ({ className }: KakaoLoginButtonProps) => {
  const VITE_KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const VITE_KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const sendToKakaoLogin = () => {
    const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${VITE_KAKAO_CLIENT_ID}&redirect_uri=${VITE_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoLoginURL;
  };
  return (
    <button className={className} onClick={sendToKakaoLogin}>
      <img src={Login.kakao_login} alt="카카오 로그인" className="w-full" />
    </button>
  );
};
