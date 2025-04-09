import blockchainLoading from '@/assets/images/blockchain/blockchain.gif';
import { useEffect, useState } from 'react';
export const Waiting = () => {
  const [dots, setDots] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 700);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
      <div className="mb-2 text-info-large font-bold">
        문서를 검증 중입니다{'.'.repeat(dots)}
      </div>
      <div>블록체인 Hash 검증을 통해 </div>
      <div>위조가 되었는지 검증해드릴게요!</div>
      <img
        src={blockchainLoading}
        alt="blockchain"
        className="h-40 w-40"
      />
    </div>
  );
};
