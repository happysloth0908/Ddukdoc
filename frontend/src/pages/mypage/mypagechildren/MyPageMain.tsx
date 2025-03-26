import ShortButton from '@/components/atoms/buttons/ShortButton';
import { DocsCard } from '@/components/molecules/cards/DocsCard';
import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/apis/mypage';

interface DocData {
  id: number;
  template_id: number;
  template_code: string;
  template_name: string;
  title: string;
  status: string;
  creator_id: number;
  creator_name: string;
  recipient_id: number;
  recipient_name: string;
  created_at: string;
  updated_at: string;
  return_reason: string | null;
}

interface ApiResponse {
  success: boolean;
  data: {
    content: DocData[];
    page_number: number;
    total_pages: number;
    total_elements: number;
    page_size: number;
    first: boolean;
    last: boolean;
  };
  error: null;
}

const MyPageMain = () => {
  const [docs, setDocs] = useState<DocData[]>([]);
  const [selectedType, setSelectedType] = useState<'1' | '2'>('1');

  const fetchDocs = async (type: '1' | '2') => {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/api/docs?send_receive_status=${type}`
      );
      setDocs(response.data.data.content);

      // 임시 데이터
      // const response: ApiResponse = {
      //   success: true,
      //   data: {
      //     content: [
      //       {
      //         id: 1,
      //         template_id: 1,
      //         template_code: 'G2',
      //         template_name: '차용증',
      //         title: '03.12 전아현 차용증',
      //         status: '서명 대기',
      //         creator_id: 1,
      //         creator_name: '김발신',
      //         recipient_id: 31,
      //         recipient_name: '이수신',
      //         created_at: '2024-12-04T15:30:00Z',
      //         updated_at: '2024-12-04T16:05:20Z',
      //         return_reason: null,
      //       },
      //       {
      //         id: 2,
      //         template_id: 1,
      //         template_code: 'G2',
      //         template_name: '차용증',
      //         title: '03.12 전아현 차용증',
      //         status: '서명 대기',
      //         creator_id: 1,
      //         creator_name: '김발신',
      //         recipient_id: 31,
      //         recipient_name: '이수신',
      //         created_at: '2024-12-04T15:30:00Z',
      //         updated_at: '2024-12-04T16:05:20Z',
      //         return_reason: null,
      //       },
      //       {
      //         id: 3,
      //         template_id: 1,
      //         template_code: 'G2',
      //         template_name: '차용증',
      //         title: '03.12 전아현 차용증',
      //         status: '서명 대기',
      //         creator_id: 1,
      //         creator_name: '김발신',
      //         recipient_id: 31,
      //         recipient_name: '이수신',
      //         created_at: '2024-12-04T15:30:00Z',
      //         updated_at: '2024-12-04T16:05:20Z',
      //         return_reason: null,
      //       },
      //       {
      //         id: 4,
      //         template_id: 1,
      //         template_code: 'G2',
      //         template_name: '차용증',
      //         title: '03.12 전아현 차용증',
      //         status: '서명 대기',
      //         creator_id: 1,
      //         creator_name: '김발신',
      //         recipient_id: 31,
      //         recipient_name: '이수신',
      //         created_at: '2024-12-04T15:30:00Z',
      //         updated_at: '2024-12-04T16:05:20Z',
      //         return_reason: null,
      //       },
      //       {
      //         id: 5,
      //         template_id: 1,
      //         template_code: 'G2',
      //         template_name: '차용증',
      //         title: '03.12 전아현 차용증',
      //         status: '서명 대기',
      //         creator_id: 1,
      //         creator_name: '김발신',
      //         recipient_id: 31,
      //         recipient_name: '이수신',
      //         created_at: '2024-12-04T15:30:00Z',
      //         updated_at: '2024-12-04T16:05:20Z',
      //         return_reason: null,
      //       },
      //       {
      //         id: 6,
      //         template_id: 1,
      //         template_code: 'G2',
      //         template_name: '차용증',
      //         title: '03.12 전아현 차용증',
      //         status: '서명 대기',
      //         creator_id: 1,
      //         creator_name: '김발신',
      //         recipient_id: 31,
      //         recipient_name: '이수신',
      //         created_at: '2024-12-04T15:30:00Z',
      //         updated_at: '2024-12-04T16:05:20Z',
      //         return_reason: null,
      //       },
      //       {
      //         id: 7,
      //         template_id: 1,
      //         template_code: 'G2',
      //         template_name: '차용증',
      //         title: '03.12 전아현 차용증',
      //         status: '서명 대기',
      //         creator_id: 1,
      //         creator_name: '김발신',
      //         recipient_id: 31,
      //         recipient_name: '이수신',
      //         created_at: '2024-12-04T15:30:00Z',
      //         updated_at: '2024-12-04T16:05:20Z',
      //         return_reason: null,
      //       },
      //       {
      //         id: 8,
      //         template_id: 1,
      //         template_code: 'G2',
      //         template_name: '차용증',
      //         title: '03.12 전아현 차용증',
      //         status: '서명 대기',
      //         creator_id: 1,
      //         creator_name: '김발신',
      //         recipient_id: 31,
      //         recipient_name: '이수신',
      //         created_at: '2024-12-04T15:30:00Z',
      //         updated_at: '2024-12-04T16:05:20Z',
      //         return_reason: null,
      //       },
      //     ],
      //     page_number: 1,
      //     total_pages: 10,
      //     total_elements: 150,
      //     page_size: 10,
      //     first: true,
      //     last: false,
      //   },
      //   error: null,
      // };
      // setDocs(response.data.content);
    } catch (error) {
      console.error('문서 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleTypeChange = (type: '1' | '2') => {
    setSelectedType(type);
    fetchDocs(type);
  };

  useEffect(() => {
    fetchDocs(selectedType);
  }, [selectedType]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="fixed left-0 right-0 top-0 z-10 mx-5 my-10 flex items-center justify-between bg-white px-4">
        <div className="flex space-x-2">
          <ShortButton
            children={'수신'}
            colorType={selectedType === '1' ? 'black' : 'gray'}
            className="flex h-9 items-center justify-center"
            onClick={() => handleTypeChange('1')}
          />
          <ShortButton
            children={'발신'}
            colorType={selectedType === '2' ? 'black' : 'gray'}
            className="flex h-9 items-center justify-center"
            onClick={() => handleTypeChange('2')}
          />
        </div>
        <div>
          <SlidersHorizontal className="h-7 w-7" />
        </div>
      </div>
      <div className="mt-32 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              to={`docs/${doc.id}`}
              className="block cursor-pointer"
            >
              <DocsCard
                data={doc}
                calls={selectedType === '1' ? '수신' : '발신'}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPageMain;
