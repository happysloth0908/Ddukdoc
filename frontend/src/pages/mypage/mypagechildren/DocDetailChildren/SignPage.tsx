import { ProgressBar } from '@/components/atoms/infos/ProgressBar';
import { SignBox } from '@/components/molecules/SignBox';

const SignPage = ({ role }: { role: number }) => {
  return (
    <div className="flex flex-1 flex-col">
      <ProgressBar curStage={2} totalStage={3} />
      <SignBox
        next=""
        role={role === 2 ? '채권자' : '채무자'}
        isReciever={true}
      />
    </div>
  );
};

export default SignPage;
