import { useState, useEffect } from 'react';
import Input from '@/components/atoms/inputs/Input';
import DateInput from '@/components/atoms/inputs/DateInput';
import FilterButton from '@/components/atoms/buttons/FilterButton';
import LongButton from '@/components/atoms/buttons/LongButton';
import { X } from 'lucide-react';

interface MyPageMainFilterProps {
  onClose: () => void;
  onSearch: (params: {
    keyword: string;
    templateCode: string;
    status: string;
    createdAt: string;
  }) => void;
  initialValues?: {
    keyword?: string;
    templateCode?: string;
    status?: string;
    createdAt?: string;
  };
  isOpen: boolean;
}

const docTypeOptions = [
  { label: '차용증', value: 'G1' },
  { label: '근로계약서', value: 'G2' },
];

const statusOptions = [
  { label: '서명 대기', value: 'WAITING' },
  { label: '서명 완료', value: 'SIGNED' },
  { label: '반송', value: 'RETURNED' },
];

const MyPageMainFilter = ({
  onClose,
  onSearch,
  initialValues = {},
  isOpen,
}: MyPageMainFilterProps) => {
  const [searchKeyword, setSearchKeyword] = useState(
    initialValues.keyword || ''
  );
  const [selectedDocType, setSelectedDocType] = useState(
    initialValues.templateCode || ''
  );
  const [selectedStatus, setSelectedStatus] = useState(
    initialValues.status || ''
  );
  const [selectedDate, setSelectedDate] = useState(
    initialValues.createdAt || ''
  );

  // 바텀시트 닫힐 때 필터 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setSearchKeyword(initialValues.keyword || '');
      setSelectedDocType(initialValues.templateCode || '');
      setSelectedStatus(initialValues.status || '');
      setSelectedDate(initialValues.createdAt || '');
    }
  }, [isOpen, initialValues]);

  // ✅ 초기화 버튼 클릭 시 state를 전부 ""로
  const handleClear = () => {
    setSearchKeyword('');
    setSelectedDocType('');
    setSelectedStatus('');
    setSelectedDate('');
  };

  const handleSearch = () => {
    onSearch({
      keyword: searchKeyword,
      templateCode: selectedDocType,
      status: selectedStatus,
      createdAt: selectedDate,
    });
    onClose();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 상단 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-text-default">검색 필터</h2>
        <div className="flex items-center space-x-3">
          <button
            className="text-md text-text-description underline"
            onClick={handleClear}
          >
            초기화
          </button>
          <button className="text-2xl text-text-description" onClick={onClose}>
            <X />
          </button>
        </div>
      </div>

      {/* 검색어 */}
      <Input
        placeholder="검색어를 입력해주세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="w-full"
      />

      {/* 문서 유형 */}
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-text-default">
          문서 유형
        </label>
        <div className="flex flex-wrap gap-2">
          {docTypeOptions.map((option) => (
            <FilterButton
              key={option.value}
              selected={selectedDocType === option.value}
              onClick={() => setSelectedDocType(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* 문서 상태 */}
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-text-default">
          문서 상태
        </label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <FilterButton
              key={option.value}
              selected={selectedStatus === option.value}
              onClick={() => setSelectedStatus(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* 날짜 */}
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-text-default">
          날짜 범위
        </label>
        <DateInput
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full"
        />
      </div>

      {/* 검색 버튼 */}
      <LongButton onClick={handleSearch} colorType="black">
        검색
      </LongButton>
    </div>
  );
};

export default MyPageMainFilter;
