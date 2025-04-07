import molecules from '@/components/molecules';
import { useParams } from 'react-router-dom';

const SsafySignPatch = () => {
  const { id } = useParams();
  return (
    <div className="h-full w-full">
      <molecules.SignBox
        next={`/ssafy/mypage/check/${id}`}
        ssafy={{ isSsafy: true, template: 'S1' }}
      />
    </div>
  );
};

export default SsafySignPatch;
