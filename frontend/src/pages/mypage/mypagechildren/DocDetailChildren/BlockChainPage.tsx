import atoms from '@/components/atoms';
import { useNavigate } from 'react-router-dom';
import safeImage from '@/assets/images/blockchain/safe.png';
import { useIOUDocsStore } from '@/store/docs';

const BlockChainPage = () => {
  const navigate = useNavigate();
  const { resetData } = useIOUDocsStore();

  const handleClick = () => {
    resetData();
    navigate('/mypage', { state: { from: '/' } });
  };

  return (
    <div className="flex h-full flex-col gap-y-6 overflow-hidden">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-6">
        <img src={safeImage} alt="blockchain" />
        <div className="flex flex-col items-center gap-y-2">
          <div className="text-2xl font-bold">작성하신 문서를 블록체인으로</div>
          <div className="text-2xl font-bold">안전하게 보호해드릴게요!</div>
        </div>
      </div>
      <atoms.LongButton
        className="mb-20"
        children="문서 목록으로"
        colorType="black"
        onClick={handleClick}
      />
    </div>
  );
};

export default BlockChainPage;
