import atoms from '@/components/atoms';
import { useNavigate, useParams } from 'react-router-dom';
import { S1 } from '@/pdfs/SSAFY/S1';
import { useS1Data } from '@/store/docs';
import { patchSsafyDocs } from '@/apis/ssafy/mypage';
import { useEffect, useState } from 'react';
import blockchainLoading from '@/assets/images/blockchain/blockchain.gif';

const SsafyDocFinalCheck = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, signature } = useS1Data();
  const docId = id ? parseInt(id) : 0;

  const formatDateToYYMMDD = (date: Date): string => {
    const year = date.getFullYear().toString().slice(2); // '24'
    const month = String(date.getMonth() + 1).padStart(2, '0'); // '04'
    const day = String(date.getDate()).padStart(2, '0'); // '05'
    return `${year}${month}${day}`; // '240405'
  };

  const today = new Date();
  const formatted = formatDateToYYMMDD(today);

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

  const patch = async () => {
    setIsLoading(true);
    const formData = {
      role_id: 6,
      title: `${formatted}_노트북 반출 확인서_${data.applicant_name}`,
      data: [
        {
          field_id: 61,
          name: 'export_date',
          field_value: data.export_date,
        },
        {
          field_id: 62,
          name: 'return_due_date',
          field_value: data.return_due_date,
        },
        {
          field_id: 63,
          name: 'location',
          field_value: data.location,
        },
        {
          field_id: 64,
          name: 'student_id',
          field_value: data.student_id,
        },
        {
          field_id: 65,
          name: 'contact_number',
          field_value: data.contact_number,
        },
        {
          field_id: 66,
          name: 'applicant_name',
          field_value: data.applicant_name,
        },
      ],
    };

    try {
      const response = await patchSsafyDocs(docId, formData, signature);
      console.log(response);
      setIsLoading(false);
      navigate(`/ssafy/mypage/detail/${id}`, {
        state: { from: '/ssafy/mypage' },
      });
    } catch (error) {
      console.error(error);
      alert('블록체인에 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
      navigate('/error', {state: {fromSsafy: true}});
    }
  };

  return (
    <div className="flex h-full flex-col gap-y-6">
      <div className="flex flex-1 flex-col justify-center gap-y-6">
        <atoms.DocsDescription
          title={'수정하신 문서입니다'}
          subTitle="문서를"
          description="확인하고 다음을 눌러주세요!"
        />
        <S1 />
      </div>
      <atoms.LongButton
        onClick={patch}
        className="mb-20"
        children="저장 후 공유"
        colorType="black"
      />
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
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

export default SsafyDocFinalCheck;
