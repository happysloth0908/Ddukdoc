import molecules from '@/components/molecules';
import { useParams } from 'react-router-dom';

const SsafySignPatch = () => {
  const { id } = useParams();
  return (
    <div className="h-full w-full">
      <molecules.SignBox next={`/ssafy/mypage/check/${id}`} isSsafy={true} />
    </div>
  );
};

export default SsafySignPatch;
