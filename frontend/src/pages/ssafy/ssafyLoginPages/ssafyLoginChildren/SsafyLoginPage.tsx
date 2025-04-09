import { SsafyLoginButton } from './SsafyLoginButton';
import { SsafyLoginMainSVG } from '@/assets/images/ssafy';

export const SsafyLoginPage = ({
  onSsafyLoginClick,
}: {
  onSsafyLoginClick: () => void;
}) => {
  return (
    <div className="absolute inset-0 mx-8 flex flex-col items-center justify-evenly">
      <div className="flex flex-col justify-center">
        <img
          src={SsafyLoginMainSVG.ssafy_catchphrase}
          className="p-4"
          alt="캐치 프레이즈즈"
        />
        <img src={SsafyLoginMainSVG.ssafy_title} alt="똑딱똑 Doc" />
      </div>
      <div className="flex justify-center">
        <img src={SsafyLoginMainSVG.ssafy_logo} alt="SSAFY 로고" />
      </div>
      <div className="flex w-full justify-center">
        <SsafyLoginButton onSsafyLoginClick={onSsafyLoginClick} />
      </div>
    </div>
  );
};
