import { Documents } from '@/pdfs/Documents';
import { useIOUDocsStore } from '@/store/docs';
import { sendReceiveData } from '@/apis/mypage';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LongButton from '@/components/atoms/buttons/LongButton';
import { ProgressBar } from '@/components/atoms/infos/ProgressBar';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription';
import blockchainLoading from '@/assets/images/blockchain/blockchain.gif';

interface FinalCheckProps {
  role: number;
}

const FinalCheck = ({ role }: FinalCheckProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState(0);
  const { data, creditor_signature, debtor_signature } = useIOUDocsStore();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setDots((prev) => (prev >= 3 ? 0 : prev + 1));
      }, 700);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const saveSignature = async () => {
    setIsLoading(true);
    const signatureData = role === 2 ? creditor_signature : debtor_signature;
    const recieverData = {
      role_id: role,
      data:
        role === 2
          ? [
              {
                field_id: 14,
                name: 'creditor_name',
                field_value: data.creditor_name,
              },
              {
                field_id: 15,
                name: 'creditor_address',
                field_value: data.creditor_address,
              },
              {
                field_id: 16,
                name: 'creditor_contact',
                field_value: data.creditor_contact,
              },
              {
                field_id: 17,
                name: 'creditor_id',
                field_value: data.creditor_id,
              },
            ]
          : [
              {
                field_id: 18,
                name: 'debtor_name',
                field_value: data.debtor_name,
              },
              {
                field_id: 19,
                name: 'debtor_address',
                field_value: data.debtor_address,
              },
              {
                field_id: 20,
                name: 'debtor_contact',
                field_value: data.debtor_contact,
              },
              {
                field_id: 21,
                name: 'debtor_id',
                field_value: data.debtor_id,
              },
            ],
    };
    const response = await sendReceiveData(
      parseInt(id || '0'),
      recieverData,
      signatureData
    );
    console.log(response);
    setIsLoading(false);
    navigate(`/mypage/blockchain`);
  };

  return (
    <div className="flex flex-1 flex-col justify-between gap-y-6 pt-6">
      <div className="flex flex-1 flex-col gap-y-6">
        <ProgressBar curStage={3} totalStage={3} />
        <DocsDescription
          title={'문서를 확인해주세요'}
          subTitle={''}
          description={'이제 마지막이에요!'}
        />
        <Documents templateCode={'G1'} />
      </div>
      <LongButton
        children={'블록체인에 저장'}
        onClick={saveSignature}
        colorType="black"
        className="mb-20"
      />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex flex-col items-center justify-center rounded-lg p-8">
            <img
              src={blockchainLoading}
              alt="blockchain"
              className="h-40 w-40"
            />
            <p className="mt-4 text-lg font-medium text-white">
              블록체인에 저장중{'.'.repeat(dots)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalCheck;
