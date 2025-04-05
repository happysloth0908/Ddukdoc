import { SsafyLoginButton } from './SsafyLoginButton';
import { SsafyLoginSVG } from '@/assets/images/ssafy';

export const SsafyLoginPage = ({
  onSsafyLoginClick,
}: {
  onSsafyLoginClick: () => void;
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-evenly mx-8">
      <div className="flex justify-center">
        <img src={SsafyLoginSVG.ssafy_title} alt="똑딱똑 Doc" />
      </div>
      <div className="flex justify-center">
        <img src={SsafyLoginSVG.ssafy_logo} alt="SSAFY 로고" />
      </div>
      <div className="flex w-full justify-center">
        <SsafyLoginButton onSsafyLoginClick={onSsafyLoginClick} />
      </div>
    </div>
  );
};