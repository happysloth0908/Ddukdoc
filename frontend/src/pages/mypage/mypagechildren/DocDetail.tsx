import LongButton from '@/components/atoms/buttons/LongButton.tsx';
import ShortButton from '@/components/atoms/buttons/ShortButton';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BottomRollup from '@/components/atoms/inputs/BottomRollup.tsx';
import Refuse from '@/pages/mypage/mypagechildren/Refuse.tsx';
import { apiClient } from '@/apis/mypage.ts';
import { DocData, ApiResponse } from '@/types/mypage.ts';

interface apiResponse extends ApiResponse {
  data: data;
}

interface data {
  docs_info: DocData;
  field: Field[];
  signature: {
    creator_signature: string;
    recipient_signature: string;
  };
  user_role_info: {
    creator_role_id: number;
    recipient_role_id: number;
  };
}

interface Field {
  field_id: number;
  role_id: number;
  field_name: string;
  is_required: boolean;
  type: string;
  order: number;
  group: string;
  field_value: string;
}

const DocDetail = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [docData, setDocData] = useState<DocData>();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);

  const fetchDoc = async () => {
    try {
      const response = await apiClient.get<apiResponse>(`/api/docs/${id}`);

      console.log(response.data.data);

      setDocData(response.data.data.docs_info);
      setFields(response.data.data.field);
    } catch (error) {
      console.error(error);
      const err = error as { response: { data: apiResponse } };
      if (err.response.data.error.code === 'C005') {
        alert('해당 문서에 접근할 수 없습니다');
      } else if (err.response.data.error.code === 'P002') {
        // 핀코드 입력 페이지로 리다이렉트
        navigate(`/mypage/pin/${id}`);
      }
    }
  };

  useEffect(() => {
    fetchDoc();
  }, []);

  return (
    <div className={'flex h-full w-full flex-col items-center justify-between'}>
      {/* 이 밑에꺼는 문서가 서명완료 상태일 때 상세페이지를 들어갔을 때 보여주는 부분 */}
      {docData?.status === '서명 완료' && (
        <div className={'flex w-full justify-between gap-x-4'}>
          <Link to={`files`} className={'w-1/2'}>
            <ShortButton children={'추가자료'} className={'w-full'} />
          </Link>
          <ShortButton children={'문서 다운로드'} className={'w-1/2'} />
        </div>
      )}

      {/* 문서정보 PDF가 들어갈 부분 */}
      <h3>{id}</h3>
      <div>{fields[0] ? fields[0].field_id : ''}</div>

      {/* 이 밑에꺼는 문서가 서명대기 상태일 때 상세페이지를 들어갔을 때 보여주는 부분 */}
      {docData?.status === '서명 대기' && (
        <div className={'mb-3 w-full'}>
          <LongButton children={'정보입력'} colorType={'black'} />
          <div
            onClick={() => setIsOpen(true)}
            className="mt-3 cursor-pointer justify-center text-center text-md font-medium text-status-warning underline"
          >
            문서 내용이 잘못되었나요? 반송하기
          </div>
        </div>
      )}

      <BottomRollup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Refuse />
      </BottomRollup>
    </div>
  );
};

export default DocDetail;
