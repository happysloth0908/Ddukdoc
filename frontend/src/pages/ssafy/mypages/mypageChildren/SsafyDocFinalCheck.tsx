import atoms from '@/components/atoms';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { S1 } from '@/pdfs/SSAFY/S1';
import { S6 } from '@/pdfs/SSAFY/S6';
import { useS1Data, useS6Data } from '@/store/docs';
import { patchSsafyDocs } from '@/apis/ssafy/mypage';
import { useEffect, useState } from 'react';
import { Viewer } from '@/components/atoms/three/Viewer';

const SsafyDocFinalCheck = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState(0);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateCode = searchParams.get('template');
  const S1Data = useS1Data();
  const S6Data = useS6Data();
  const docId = id ? parseInt(id) : 0;

  const formatDateToYYMMDD = (date: Date): string => {
    const year = date.getFullYear().toString().slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
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
    let formData: {
      role_id: number;
      title: string;
      data: {
        field_id: number;
        name: string;
        field_value: string;
      }[];
    } | null = null;
    let signature: string | null = null;

    if (templateCode === 'S1') {
      formData = {
        role_id: 6,
        title: `${formatted}_노트북 반출 확인서_${S1Data.data.applicant_name}`,
        data: [
          {
            field_id: 61,
            name: 'export_date',
            field_value: S1Data.data.export_date,
          },
          {
            field_id: 62,
            name: 'return_due_date',
            field_value: S1Data.data.return_due_date,
          },
          {
            field_id: 63,
            name: 'location',
            field_value: S1Data.data.location,
          },
          {
            field_id: 64,
            name: 'student_id',
            field_value: S1Data.data.student_id,
          },
          {
            field_id: 65,
            name: 'contact_number',
            field_value: S1Data.data.contact_number,
          },
          {
            field_id: 66,
            name: 'applicant_name',
            field_value: S1Data.data.applicant_name,
          },
        ],
      };
      signature = S1Data.signature;
    } else if (templateCode === 'S6') {
      formData = {
        role_id: 6,
        title: 'S6번_프로젝트 동의서_김싸피',
        data: [
          {
            field_id: 88,
            name: 'project_name',
            field_value: S6Data.data.project_name,
          },
          {
            field_id: 89,
            name: 'submitted_date',
            field_value: S6Data.data.date,
          },
          {
            field_id: 90,
            name: 'student_birthdate',
            field_value: S6Data.data.birth,
          },
          {
            field_id: 91,
            name: 'student_name',
            field_value: S6Data.data.name,
          },
        ],
      };
      signature = S6Data.signature;
    }

    if (!formData || !signature) {
      alert('잘못된 템플릿 코드입니다.');
      setIsLoading(false);
      return;
    }

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
    }
  };

  const docType = (templateCode: string | null) => {
    if (!templateCode) return null;
    switch (templateCode) {
      case 'S1':
        return <S1 />;
      case 'S6':
        return <S6 />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col gap-y-6">
      <div className="flex flex-1 flex-col justify-center gap-y-6">
        <atoms.DocsDescription
          title={'수정하신 문서입니다'}
          subTitle="수정완료"
          description="를 누르시면 블록체인에 저장됩니다!"
        />
        {docType(templateCode)}
      </div>
      <atoms.LongButton
        onClick={patch}
        className="mb-20"
        children="수정 완료"
        colorType="black"
      />
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex flex-col items-center justify-center rounded-lg p-8">
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70 p-10">
              <p className="my-4 text-lg font-medium text-white">
                블록체인에 저장중{'.'.repeat(dots)}
              </p>
              <Viewer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SsafyDocFinalCheck;
