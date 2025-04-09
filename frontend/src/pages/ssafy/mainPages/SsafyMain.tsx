import { Link, useNavigate } from 'react-router-dom';
import { SsafyLoginMainSVG } from '@/assets/images/ssafy';
import SmallButton from '@/pages/mainPage/mainChildren/SmallButton';
import { useEffect } from 'react';
import { getCookie, deleteCookie } from '@/utils/cookies';
import { useSsafyMyStore } from '@/store/ssafyMyInfoStore';
import { SsafyGreeting } from './ssafyMainChildren/SsafyGreeting';

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
      } else {
        deleteCookie('auth_redirect_path');
        navigate(redirectPath);
      }
    }
    if (!data) {
      setData();
    }
  }, []);

  const saveRoute = () => {
    navigate('/forgery', { state: { fromSsafy: true } });
  };
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      {/* 전체 콘텐츠 컨테이너 - justify-center 추가 */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* 제목 */}
        <div className="mb-12 flex w-full justify-center">
          <img src={SsafyLoginMainSVG.ssafy_title} alt="SSAFY Title" />
        </div>

        {/* 인삿말 */}
        <div className="mb-12 w-full">
          <SsafyGreeting />
        </div>

        {/* 버튼들을 담는 컨테이너 */}
        <div className="w-full">
          {/* 블록 1 - 더 길쭉한 버튼 */}
          <Link to="/ssafy/docs">
            <div className="mb-6 flex h-44 w-full items-center justify-center rounded-lg bg-white">
              <SmallButton
                imageSrc={SsafyLoginMainSVG.ssafy_docs_icon}
                subtitle="빠르고 쉽게 문서 작성"
                title="문서 작성"
              />
            </div>
          </Link>

          {/* 하단 두 버튼을 위한 flex row */}
          <div className="flex w-full gap-6">
            {/* 블록 2 - 더 길쭉한 버튼 */}
            <Link to="/ssafy/mypage" className="w-1/2">
              <div className="flex h-44 w-full items-center justify-center rounded-lg bg-white">
                <SmallButton
                  imageSrc={SsafyLoginMainSVG.ssafy_myhome_icon}
                  subtitle="나의 싸피 문서함"
                  title="내 문서"
                />
              </div>
            </Link>

            {/* 블록 3 - 더 길쭉한 버튼 */}
            <div
              onClick={saveRoute}
              className="flex h-44 w-1/2 items-center justify-center rounded-lg bg-white"
            >
              <SmallButton
                imageSrc={SsafyLoginMainSVG.ssafy_forgery_icon}
                subtitle="블록체인 위변조 검사"
                title="위변조 검사"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
