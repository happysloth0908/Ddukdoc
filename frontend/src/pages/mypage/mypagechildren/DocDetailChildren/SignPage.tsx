import { ProgressBar } from '@/components/atoms/infos/ProgressBar';
import { SignBox } from '@/components/molecules/SignBox';
import { useParams } from 'react-router-dom';

const SignPage = ({ role }: { role: number }) => {
  const { id } = useParams();
  return (
    <div className="flex flex-1 flex-col">
      <ProgressBar curStage={2} totalStage={3} />
      <SignBox
        next={`/mypage/detail/${id}/check`}
        role={role === 2 ? '채권자' : '채무자'}
      />
    </div>
  );
};

export default SignPage;
