import ShortButton from '@/components/atoms/buttons/ShortButton';
import { DocsCard } from '@/components/molecules/cards/DocsCard';
import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/apis/mypage';
import MyPageMainFilter from './MyPageMainFilter';
import BottomRollup from '@/components/atoms/inputs/BottomRollup';
import { DocData, ApiResponse } from '@/types/mypage';

interface apiResponse extends ApiResponse {
  data: {
    content: DocData[];
    page_number: number;
    total_pages: number;
    total_elements: number;
    page_size: number;
    first: boolean;
    last: boolean;
  };
}

interface SearchParams {
  searchKeyword?: string;
  selectedDocType?: string;
  selectedStatus?: string;
  selectedDate?: string;
}

const MyPageMain = () => {
  const [docs, setDocs] = useState<DocData[]>([]);
  const [selectedType, setSelectedType] = useState<'1' | '2'>('1');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const navigate = useNavigate(); // ✅ useNavigate 훅 사용

  const fetchDocs = async (type: '1' | '2', params: SearchParams = {}) => {
    try {
      const queryParams = new URLSearchParams({
        send_receive_status: type,
        ...(params.searchKeyword && { keyword: params.searchKeyword }),
        ...(params.selectedDocType && { doc_type: params.selectedDocType }),
        ...(params.selectedStatus && { status: params.selectedStatus }),
        ...(params.selectedDate && { date: params.selectedDate }),
      }).toString();

      const response = await apiClient.get<apiResponse>(
        `/api/docs?${queryParams}`
      );
      console.log(response.data.data.content);
      setDocs(response.data.data.content);
    } catch (error) {
      console.error('문서 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleTypeChange = (type: '1' | '2') => {
    setSelectedType(type);
  };

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    fetchDocs(selectedType, params);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    fetchDocs(selectedType);
  }, [selectedType]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="left-0 top-0 z-10 my-10 flex w-full items-center justify-between bg-white">
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
          <SlidersHorizontal
            className="h-7 w-7 cursor-pointer"
            onClick={() => setIsFilterOpen(true)}
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="space-y-4 overflow-y-auto">
          {docs.map((doc) => (
            <div
              key={doc.document_id}
              className="cursor-pointer"
              onClick={() => navigate(`docs/${doc.document_id}`)} // ✅ 클릭 시 라우팅
            >
              <DocsCard
                data={doc}
                calls={selectedType === '1' ? '수신' : '발신'}
              />
            </div>
          ))}
        </div>
      </div>

      <BottomRollup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      >
        <MyPageMainFilter
          onClose={() => setIsFilterOpen(false)}
          onSearch={handleSearch}
          initialValues={searchParams}
        />
      </BottomRollup>
    </div>
  );
};

export default MyPageMain;
