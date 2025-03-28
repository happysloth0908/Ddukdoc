// MyPageMainFilter.tsx
import { useState } from 'react';
import Input from '@/components/atoms/inputs/Input';
import DateInput from '@/components/atoms/inputs/DateInput';
import FilterButton from '@/components/atoms/buttons/FilterButton';
import LongButton from '@/components/atoms/buttons/LongButton';
import { X } from 'lucide-react';

interface MyPageMainFilterProps {
  onClose: () => void;
  onSearch: (params: {
    searchKeyword: string;
    selectedDocType: string;
    selectedStatus: string;
    selectedDate: string;
  }) => void;
  initialValues?: {
    searchKeyword?: string;
    selectedDocType?: string;
    selectedStatus?: string;
    selectedDate?: string;
  };
}

const MyPageMainFilter = ({
  onClose,
  onSearch,
  initialValues = {},
}: MyPageMainFilterProps) => {
  const [searchKeyword, setSearchKeyword] = useState(
    initialValues.searchKeyword || ''
  );
  const [selectedDocType, setSelectedDocType] = useState(
    initialValues.selectedDocType || ''
  );
  const [selectedStatus, setSelectedStatus] = useState(
    initialValues.selectedStatus || ''
  );
  const [selectedDate, setSelectedDate] = useState(
    initialValues.selectedDate || ''
  );

  const handleSearch = () => {
    onSearch({ searchKeyword, selectedDocType, selectedStatus, selectedDate });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-text-default">검색 필터</h2>
        <button className="text-2xl text-text-description" onClick={onClose}>
          <X />
        </button>
      </div>

      <Input
        placeholder="검색어를 입력해주세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="w-full"
      />

      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-text-default">
          문서 유형
        </label>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            selected={selectedDocType === '차용증'}
            onClick={() => setSelectedDocType('차용증')}
          >
            차용증
          </FilterButton>
          <FilterButton
            selected={selectedDocType === '근로계약서'}
            onClick={() => setSelectedDocType('근로계약서')}
          >
            근로계약서
          </FilterButton>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-text-default">
          문서 상태
        </label>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            selected={selectedStatus === '서명 대기'}
            onClick={() => setSelectedStatus('서명 대기')}
          >
            서명 대기
          </FilterButton>
          <FilterButton
            selected={selectedStatus === '서명 요청'}
            onClick={() => setSelectedStatus('서명 요청')}
          >
            서명 요청
          </FilterButton>
          <FilterButton
            selected={selectedStatus === '서명 완료'}
            onClick={() => setSelectedStatus('서명 완료')}
          >
            서명 완료
          </FilterButton>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-text-default">
          날짜 범위
        </label>
        <DateInput
          // value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full"
        />
      </div>

      <LongButton onClick={handleSearch} colorType="black">
        검색
      </LongButton>
    </div>
  );
};

export default MyPageMainFilter;
