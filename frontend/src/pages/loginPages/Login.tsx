import { KakaoLoginButton } from './loginComponents/kakaoLoginButton';
import Login from '@/assets/images/login';

export const LoginPage = () => {
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
