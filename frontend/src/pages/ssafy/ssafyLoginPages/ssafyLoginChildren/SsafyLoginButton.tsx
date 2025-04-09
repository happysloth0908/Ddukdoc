import LongButton from '@/components/atoms/buttons/LongButton';
import { SsafyLoginMainSVG } from '@/assets/images/ssafy';
// import api from '@/apis/axios';

export const SsafyLoginButton = ({
  onSsafyLoginClick,
}: {
  onSsafyLoginClick: () => void;
}) => {
  return (
    <LongButton
      colorType="none"
      onClick={onSsafyLoginClick}
      className="bg-ssafy-b2 flex flex-row text-gray-white"
    >
      <div className="flex items-center pl-2">
        <img src={SsafyLoginMainSVG.ssafy_logo_white} />
      </div>
      <div className="flex flex-1 items-center justify-center text-center text-info-small">
        SSAFY 로그인
      </div>
      <div></div>
    </LongButton>
  );
};
