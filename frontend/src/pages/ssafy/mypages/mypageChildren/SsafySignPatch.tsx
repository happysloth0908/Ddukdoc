import { ProgressBar } from '@/components/atoms/infos/ProgressBar';
import molecules from '@/components/molecules';
import { useParams } from 'react-router-dom';

const SsafySignPatch = () => {
  const { id } = useParams();
  return (
    <div className="flex w-full flex-1 flex-col">
      <ProgressBar curStage={2} totalStage={2} />
      <molecules.SignBox
        next={`/ssafy/mypage/check/${id}`}
        ssafy={{ isSsafy: true, template: 'S1' }}
      />
    </div>
  );
};

export default SsafySignPatch;
