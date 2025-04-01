import { SsafyLoginButton } from './SsafyLoginButton';
import { SsafyLoginSVG } from '@/assets/images/ssafy';

export const SsafyLoginPage = ({
  onSsafyLoginClick,
}: {
  onSsafyLoginClick: () => void;
}) => {
  return (
    <div className="relative flex grid w-full flex-1 grid-rows-3 flex-col items-center justify-center">
      <div className="flex justify-center">
        <img src={SsafyLoginSVG.ssafy_title}></img>
      </div>
      <div className="flex justify-center py-20">
        <img src={SsafyLoginSVG.ssafy_logo}></img>
      </div>
      <div className="flex w-full justify-center">
        <SsafyLoginButton onSsafyLoginClick={onSsafyLoginClick} />
      </div>
    </div>
  );
};
