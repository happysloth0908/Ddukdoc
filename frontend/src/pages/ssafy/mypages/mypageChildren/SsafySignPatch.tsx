import { ProgressBar } from '@/components/atoms/infos/ProgressBar';
import molecules from '@/components/molecules';
import { useLocation, useParams } from 'react-router-dom';

const SsafySignPatch = () => {
  const { id } = useParams();
  const location = useLocation();
  const templateCode = location.state?.templateCode;

  return (
    <div className="flex w-full flex-1 flex-col">
      <ProgressBar curStage={2} totalStage={2} />
      <molecules.SignBox
        next={`/ssafy/mypage/check/${id}?template=${templateCode}`}
        ssafy={{ isSsafy: true, template: templateCode }}
      />
    </div>
  );
};

export default SsafySignPatch;
