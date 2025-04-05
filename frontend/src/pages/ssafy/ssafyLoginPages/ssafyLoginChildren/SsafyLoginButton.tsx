import LongButton from '@/components/atoms/buttons/LongButton';
import { SsafyLoginSVG } from '@/assets/images/ssafy';
// import api from '@/apis/axios';

export const SsafyLoginButton = ({
  onSsafyLoginClick,
}: {
  onSsafyLoginClick: () => void;
}) => {
  return (
    <LongButton
      onClick={onSsafyLoginClick}
      className="grid grid-cols-3 bg-ssafy-default text-gray-white"
    >
      <div className="flex items-center pl-2">
        <img src={SsafyLoginSVG.ssafy_logo_white} />
      </div>
      <div className="flex items-center justify-center">SSAFY 로그인</div>
      <div></div>
    </LongButton>
  );
};
