import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';

import ShortButton from '@/components/atoms/buttons/ShortButton';
import { DocsCard } from '@/components/molecules/cards/DocsCard';
import BottomRollup from '@/components/atoms/inputs/BottomRollup';
import MyPageMainFilter from './MyPageMainFilter';
import Spinner from '@/components/atoms/feedback/Spinner';

import { apiClient } from '@/apis/mypage';
import { useDocStore, SearchParams } from '@/store/useDocStore';
import { DocData, ApiResponse } from '@/types/mypage';

interface ApiDocsResponse extends ApiResponse {
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

const MyPageMain = () => {
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ selectedType: 로컬 (수신='1', 발신='2')
  const [selectedType, setSelectedType] = useState<'1' | '2'>('1');

  const {
    // 수신
    receiveDocs,
    receivePage,
    isLastReceivePage,
    isFirstReceiveLoad,
    receiveSearchParams,

    // 발신
    sendDocs,
    sendPage,
    isLastSendPage,
    isFirstSendLoad,
    sendSearchParams,

    isLoading,
    setReceiveDocs,
    appendReceiveDocs,
    setSendDocs,
    appendSendDocs,
    setReceivePage,
    setSendPage,
    setLoading,
    setReceiveSearchParams,
    setSendSearchParams,
    setIsFirstReceiveLoad,
    setIsFirstSendLoad,
    // ✅ 부분 리셋
    resetReceive,
    resetSend,
  } = useDocStore();

  // ✅ current state
  const currentDocs = selectedType === '1' ? receiveDocs : sendDocs;
  const currentPage = selectedType === '1' ? receivePage : sendPage;
  const isLastPage = selectedType === '1' ? isLastReceivePage : isLastSendPage;
  // const isFirstLoad =
  //   selectedType === '1' ? isFirstReceiveLoad : isFirstSendLoad;
  const currentSearchParams =
    selectedType === '1' ? receiveSearchParams : sendSearchParams;

  // 분기 set 함수들
  const setCurrentDocs = useCallback(
    (docs: DocData[], last: boolean) => {
      if (selectedType === '1') {
        setReceiveDocs(docs, last);
      } else {
        setSendDocs(docs, last);
      }
    },
    [selectedType]
  );

  const appendCurrentDocs = useCallback(
    (docs: DocData[], last: boolean) => {
      if (selectedType === '1') {
        appendReceiveDocs(docs, last);
      } else {
        appendSendDocs(docs, last);
      }
    },
    [selectedType]
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      if (selectedType === '1') setReceivePage(page);
      else setSendPage(page);
    },
    [selectedType]
  );

  const setCurrentFirstLoad = useCallback(
    (val: boolean) => {
      if (selectedType === '1') setIsFirstReceiveLoad(val);
      else setIsFirstSendLoad(val);
    },
    [selectedType]
  );

  // const setCurrentSearchParamsCB = useCallback(
  //   (params: SearchParams) => {
  //     if (selectedType === '1') {
  //       setReceiveSearchParams(params);
  //     } else {
  //       setSendSearchParams(params);
  //     }
  //   },
  //   [selectedType]
  // );

  // ✅ fetchDocs
  const fetchDocs = useCallback(
    async (
      pageNumber: number,
      isNewSearch = false,
      overrideParams?: SearchParams
    ) => {
      try {
        if (isLoading || (isLastPage && !isNewSearch)) return;
        setLoading(true);

        const effectiveParams = overrideParams ?? currentSearchParams;
        const queryParams = new URLSearchParams({
          sendReceiveStatus: selectedType,
          page: pageNumber.toString(),
          ...(effectiveParams.keyword && { keyword: effectiveParams.keyword }),
          ...(effectiveParams.templateCode && {
            doc_type: effectiveParams.templateCode,
          }),
          ...(effectiveParams.status && { status: effectiveParams.status }),
          ...(effectiveParams.createdAt && { date: effectiveParams.createdAt }),
        }).toString();

        const response = await apiClient.get<ApiDocsResponse>(
          `/api/docs?${queryParams}`
        );

        const { content, last } = response.data.data;
        if (isNewSearch || pageNumber === 1) {
          setCurrentDocs(content, last);
        } else {
          appendCurrentDocs(content, last);
        }

        setCurrentPage(pageNumber + 1);
        setCurrentFirstLoad(false);
      } catch (error) {
        console.error('문서 목록 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    },
    [
      selectedType,
      currentSearchParams,
      isLoading,
      isLastPage,
      setLoading,
      setCurrentDocs,
      appendCurrentDocs,
      setCurrentPage,
      setCurrentFirstLoad,
    ]
  );

  // ✅ handleTypeChange
  const handleTypeChange = (type: '1' | '2') => {
    if (type === selectedType) return;
    setSelectedType(type);
  };

  // ✅ 첫 로드 시
  useEffect(() => {
    if (selectedType === '1' && isFirstReceiveLoad) {
      fetchDocs(1, true);
    } else if (selectedType === '2' && isFirstSendLoad) {
      fetchDocs(1, true);
    }
  }, [selectedType, isFirstReceiveLoad, isFirstSendLoad, fetchDocs]);

  // ✅ 필터 검색
  const handleSearch = (params: SearchParams) => {
    // ✅ 현재 탭만 리셋
    if (selectedType === '1') {
      resetReceive();
      setReceiveSearchParams(params);
    } else {
      resetSend();
      setSendSearchParams(params);
    }

    fetchDocs(1, true, params);
  };

  // ✅ 필터 초기화
  // const handleResetFilter = () => {
  //   // 여기서도 "현재 탭만" 리셋
  //   if (selectedType === '1') {
  //     resetReceive();
  //   } else {
  //     resetSend();
  //   }
  //   fetchDocs(1, true, {});
  // };

  // ✅ 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          fetchDocs(currentPage);
        }
      },
      {
        rootMargin: '300px 0px 0px 0px', // 예: 하단 300px 남았을 때만 intersect
      }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchDocs, currentPage, isLoading]);

  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden">
      <div className="z-10 my-10 flex w-full items-center justify-between">
        <div className="flex space-x-2">
          <ShortButton
            children="수신"
            colorType={selectedType === '1' ? 'black' : 'gray'}
            onClick={() => handleTypeChange('1')}
            className="flex h-9 items-center justify-center"
          />
          <ShortButton
            children="발신"
            colorType={selectedType === '2' ? 'black' : 'gray'}
            onClick={() => handleTypeChange('2')}
            className="flex h-9 items-center justify-center"
          />
        </div>

        <div className="flex items-center space-x-4">
          <SlidersHorizontal
            className="h-7 w-7 cursor-pointer"
            onClick={() => setIsFilterOpen(true)}
          />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {currentDocs.length === 0 && !isLoading ? (
          <div className="py-20 text-center text-gray-400">
            문서가 없습니다.
          </div>
        ) : (
          <>
            {currentDocs.map((doc) => (
              <div
                key={doc.document_id}
                className="cursor-pointer"
                onClick={() => navigate(`docs/${doc.document_id}`)}
              >
                <DocsCard
                  data={doc}
                  calls={selectedType === '1' ? '수신' : '발신'}
                />
              </div>
            ))}
            {isLoading && <Spinner />}
            <div ref={observerRef} className="h-10" />
          </>
        )}
      </div>

      <BottomRollup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      >
        <MyPageMainFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onSearch={handleSearch}
          initialValues={currentSearchParams}
        />
      </BottomRollup>
    </div>
  );
};

export default MyPageMain;
