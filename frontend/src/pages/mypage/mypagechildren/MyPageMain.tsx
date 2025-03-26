import ShortButton from '@/components/atoms/buttons/ShortButton';
import { DocsCard } from '@/components/molecules/cards/DocsCard';
import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/apis/mypage';
import MyPageMainFilter from './MyPageMainFilter';
import BottomRollup from '@/components/atoms/inputs/BottomRollup'; // ⬅️ 추가!

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

  const fetchDocs = async (type: '1' | '2', params: SearchParams = {}) => {
    try {
      const queryParams = new URLSearchParams({
        send_receive_status: type,
        ...(params.searchKeyword && { keyword: params.searchKeyword }),
        ...(params.selectedDocType && { doc_type: params.selectedDocType }),
        ...(params.selectedStatus && { status: params.selectedStatus }),
        ...(params.selectedDate && { date: params.selectedDate }),
      }).toString();

      const response = await apiClient.get<ApiResponse>(
        `/api/docs?${queryParams}`
      );
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
          <SlidersHorizontal
            className="h-7 w-7 cursor-pointer"
            onClick={() => setIsFilterOpen(true)}
          />
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

      {/* ✅ BottomRollup 적용 */}
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
