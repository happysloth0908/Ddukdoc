import BigButton from './BigButton';
import Login from '@/assets/images/login';
import MainPage from '@/assets/images/mainPage';
import SmallButton from './SmallButton';

export const MainMenuPage = () => {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden px-4">
      {/* 헤더 - test */}
      <div className="py-5 text-center"></div>

      {/* 로고 - 중앙 배치 */}
      <div className="mb-10 mt-16 flex items-center justify-center">
        <img src={Login.title} alt="뚝딱뚝Doc" />
      </div>

      {/* 메인 버튼 - BigButton */}
      <div className="mx-auto mb-6 w-full max-w-md">
        <BigButton />
      </div>

      {/* 작은 버튼들 - 간격 조정 */}
      <div className="mx-auto flex w-full max-w-md justify-center gap-4">
        <div className="flex-1">
          <SmallButton
            imageSrc={MainPage.securityShield}
            subtitle="블록체인 기술로 위변조 검사"
            title="위변조 검사"
          />
        </div>
        <div className="flex-1">
          <SmallButton
            imageSrc={MainPage.myDoc}
            subtitle="내 문서들을 한번에 확인"
            title="나의 문서"
          />
        </div>
      </div>

      {/* 하단 약관 - 고정 위치 */}
      <div className="fixed bottom-4 left-0 w-full text-center text-sm font-light text-[#5e5e5e] underline">
        뚝딱뚝Doc 약관
      </div>
    </div>
  );
};
