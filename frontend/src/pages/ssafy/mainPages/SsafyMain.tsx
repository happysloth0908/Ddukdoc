import { Link, useNavigate } from 'react-router-dom';
import { SsafyLoginSVG } from '@/assets/images/ssafy';
import SmallButton from '@/pages/mainPage/mainChildren/SmallButton';
import { useEffect } from 'react';
import { getCookie, deleteCookie } from '@/utils/cookies';
import { useSsafyMyStore } from '@/store/ssafyMyInfoStore';

export const SsafyMain = () => {
  const { data, setData } = useSsafyMyStore();
  const navigate = useNavigate();
  useEffect(() => {
    // localStorage에서 리다이렉트 경로 가져오기
    const redirectPath = getCookie('auth_redirect_path');

    if (redirectPath) {
      const isSsafy = window.location.pathname.includes('ssafy');
      const redirectIsSsafy = redirectPath.includes('ssafy');

      //리다이렉트 주소와 origin 이 맞지 않으면 무시하고 메인으로 가게 하기
      if (isSsafy !== redirectIsSsafy) {
        deleteCookie('auth_redirect_path');
        navigate(isSsafy ? '/ssafy' : '/');
      }
      deleteCookie('auth_redirect_path');
      navigate(redirectPath);
    }
    if (!data) {
      setData();
    }
  }, []);

  const saveRoute = () => {
    navigate('/forgery', { state: { fromSsafy: true } });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-4">
      {/* 제목 */}
      <div className="mb-8 mt-10 flex w-full justify-center">
        <img src={SsafyLoginSVG.ssafy_title} alt="SSAFY Title" />
      </div>

      {/* 2*2 블록들 - 여기에 mt-8 추가하여 아래로 내림 */}
      <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-4">
        {/* 블록 1 */}
        <div className="flex aspect-square items-center justify-center rounded-lg">
          <img
            src={SsafyLoginSVG.ssafy_logo}
            className="max-h-full max-w-full p-4 opacity-50"
            alt="SSAFY Logo"
          />
        </div>

        {/* 블록 2 */}
        <Link to="/ssafy/mypage">
          <div className="flex aspect-square items-center justify-center rounded-lg shadow-sm">
            <SmallButton
              imageSrc={SsafyLoginSVG.ssafy_myhome_icon}
              subtitle="나의 싸피 문서함"
              title="내 문서"
            />
          </div>
        </Link>

        {/* 블록 3 */}
        <div
          onClick={saveRoute}
          className="flex aspect-square items-center justify-center rounded-lg shadow-sm"
        >
          <SmallButton
            imageSrc={SsafyLoginSVG.ssafy_forgery_icon}
            subtitle="블록체인 기술로 위변조 검사"
            title="위변조 검사"
          />
        </div>

        {/* 블록 4 */}
        <Link to="/ssafy/docs">
          <div className="flex aspect-square items-center justify-center rounded-lg shadow-sm">
            <SmallButton
              imageSrc={SsafyLoginSVG.ssafy_docs_icon}
              subtitle="빠르고 쉽게 문서 작성"
              title="문서 작성"
            />
          </div>
        </Link>
      </div>

      {/* 약관 - flex-grow-1과 mt-auto를 사용하여 맨 아래로 배치 */}
      <div className="mt-auto py-8 text-sm text-text-description">
        뚝딱뚝Doc 이용약관
      </div>
    </div>
  );
};
