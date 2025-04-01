import { KakaoLoginButton } from './loginChildren/kakaoLoginButton';
import Login from '@/assets/images/login';

export const LoginPage = () => {
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
          src={Login.logo}
          style={{
            width: '50%',
            height: 'auto',
            maxWidth: '150px',
          }}
        />
      </div>
      <div className="mb-6 flex w-full justify-center">
        <KakaoLoginButton className="rounded-md py-10" />
      </div>
    </div>
  );
};
