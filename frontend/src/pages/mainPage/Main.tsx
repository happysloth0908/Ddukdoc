import BigButton from './mainChildren/BigButton';
import Login from '@/assets/images/login';
import MainPage from '@/assets/images/mainPage';
import SmallButton from './mainChildren/SmallButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { getCookie, deleteCookie } from '@/utils/cookies';
import { useIOUDocsStore, useS1Data, useS6Data } from '@/store/docs';

export const MainMenuPage = () => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const IOUStore = useIOUDocsStore();
  const S1Data = useS1Data();
  const S6Data = useS6Data();

  useEffect(() => {
    IOUStore.resetData();
    S1Data.resetData();
    S6Data.resetData();
    if (isLoggedIn) {
      // localStorage에서 리다이렉트 경로 가져오기
      const redirectPath = getCookie('auth_redirect_path');

      if (redirectPath) {
        const isSsafy = window.location.pathname.includes('ssafy');
        const redirectIsSsafy = redirectPath.includes('ssafy');

        //리다이렉트 주소와 origin 이 맞지 않으면 무시하고 메인으로 가게 하기
        if (isSsafy !== redirectIsSsafy) {
          console.log('origin 이 맞지 않으니 메인 페이지로 갑니다. ');
          deleteCookie('auth_redirect_path');
          navigate(isSsafy ? '/ssafy' : '/');
        } else {
          deleteCookie('auth_redirect_path');
          navigate(redirectPath);
        }
      }
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden px-4">
      {/* 헤더 - test */}

      {/* 로고 - 중앙 배치 */}
      <div className="mb-10 mt-16 flex items-center justify-center pt-5">
        <img src={Login.title} alt="뚝딱뚝Doc" />
      </div>

      {/* 메인 버튼 - BigButton */}
      <Link to="/docs">
        <div className="mx-auto mb-6 w-full max-w-md">
          <BigButton />
        </div>
      </Link>

      {/* 작은 버튼들 - 간격 조정 */}
      <div className="mx-auto flex w-full max-w-md justify-center gap-4">
        <div className="flex-1">
          <Link to="/forgery">
            <SmallButton
              className="shadow-md"
              imageSrc={MainPage.securityShield}
              subtitle="블록체인 위변조 검사"
              title="위변조 검사"
            />
          </Link>
        </div>
        <div className="flex-1">
          <Link to="/mypage">
            <SmallButton
              className="shadow-md"
              imageSrc={MainPage.myDoc}
              subtitle="내 문서들을 한번에 확인"
              title="나의 문서"
            />
          </Link>
        </div>
      </div>

      {/* 하단 약관 - 고정 위치 */}
      <div className="fixed bottom-4 left-0 w-full text-center text-sm font-light text-[#5e5e5e] underline">
        뚝딱뚝Doc 약관
      </div>
    </div>
  );
};
