import atoms from '@/components/atoms';
import { Link } from 'react-router-dom';

const ShareSuccess = () => {
  return (
    <div className="flex h-full flex-col gap-y-6 overflow-hidden">
      <div className="flex flex-1 items-center justify-center">
        <atoms.CompletePage type="share" />
      </div>
      <Link to={'/ssafy/mypage'} state={{ from: '/ssafy' }}>
        <atoms.LongButton
          className="mb-20"
          children="문서 목록으로"
          colorType="black"
        />
      </Link>
    </div>
  );
};

export default ShareSuccess;
