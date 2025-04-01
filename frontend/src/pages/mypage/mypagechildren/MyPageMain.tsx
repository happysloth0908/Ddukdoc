import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const MyPageMain: React.FC = () => {
  const navigate = useNavigate();

  // 관찰 대상 ref
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 필터 오픈 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // "수신='1' / 발신='2'" 탭 상태
  const [selectedType, setSelectedType] = useState<'1' | '2'>('1');

  // ========= store로부터 필요한 상태들 =========
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

    // 공통
    isLoading,

    // Setter, Appender
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

    // 탭별 리셋
    resetReceive,
    resetSend,
  } = useDocStore();

  // ========= 현재 탭에 따른 상태 분기 =========
  const currentDocs = selectedType === '1' ? receiveDocs : sendDocs;
  const currentPage = selectedType === '1' ? receivePage : sendPage;
  const isLastPage = selectedType === '1' ? isLastReceivePage : isLastSendPage;
  const currentSearchParams =
    selectedType === '1' ? receiveSearchParams : sendSearchParams;

  // Setter/Append/Reset 분기 함수들
  const setCurrentDocs = useCallback(
    (docs: DocData[], last: boolean) => {
      if (selectedType === '1') {
        setReceiveDocs(docs, last);
      } else {
        setSendDocs(docs, last);
      }
    },
    [selectedType, setReceiveDocs, setSendDocs]
  );

  const appendCurrentDocs = useCallback(
    (docs: DocData[], last: boolean) => {
      if (selectedType === '1') {
        appendReceiveDocs(docs, last);
      } else {
        appendSendDocs(docs, last);
      }
    },
    [selectedType, appendReceiveDocs, appendSendDocs]
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      if (selectedType === '1') setReceivePage(page);
      else setSendPage(page);
    },
    [selectedType, setReceivePage, setSendPage]
  );

  const setCurrentFirstLoad = useCallback(
    (val: boolean) => {
      if (selectedType === '1') setIsFirstReceiveLoad(val);
      else setIsFirstSendLoad(val);
    },
    [selectedType, setIsFirstReceiveLoad, setIsFirstSendLoad]
  );

  // ========= 문서 목록 Fetch 로직 =========
  const fetchDocs = useCallback(
    async (
      pageNumber: number,
      isNewSearch = false,
      overrideParams?: SearchParams
    ) => {
      // 1) 이미 로딩 중이거나(중복요청 방지)
      //    마지막 페이지이며(추가 데이터 없음),
      //    새로운 검색도 아니라면 요청 중단
      if (isLoading) return;
      if (isLastPage && !isNewSearch) return;

      setLoading(true);

      try {
        // 2) IntersectionObserver 해제: 로딩 중 중복요청 방지
        unobserve(observerRef);

        const effectiveParams = overrideParams ?? currentSearchParams;
        const queryParams = new URLSearchParams({
          sendReceiveStatus: selectedType,
          page: pageNumber.toString(),
          ...(effectiveParams.keyword && {
            keyword: effectiveParams.keyword,
          }),
          ...(effectiveParams.templateCode && {
            doc_type: effectiveParams.templateCode,
          }),
          ...(effectiveParams.status && { status: effectiveParams.status }),
          ...(effectiveParams.createdAt && {
            date: effectiveParams.createdAt,
          }),
        }).toString();

        const response = await apiClient.get<ApiDocsResponse>(
          `/api/docs?${queryParams}`
        );

        const { content, last } = response.data.data;

        // 새로운 검색(isNewSearch) 이거나, page=1이면 리스트를 새로 세팅
        if (isNewSearch || pageNumber === 1) {
          setCurrentDocs(content, last);
        } else {
          // 기존에 있던 목록에 이어붙이기
          appendCurrentDocs(content, last);
        }

        // 다음 페이지 번호로 갱신
        setCurrentPage(pageNumber + 1);

        // 첫 로드 상태 해제
        setCurrentFirstLoad(false);
      } catch (error) {
        console.error('문서 목록 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    },
    [
      selectedType,
      isLoading,
      isLastPage,
      currentSearchParams,
      setLoading,
      setCurrentDocs,
      appendCurrentDocs,
      setCurrentPage,
      setCurrentFirstLoad,
    ]
  );

  // ========= 탭 변경 =========
  const handleTypeChange = (type: '1' | '2') => {
    if (type === selectedType) return;
    setSelectedType(type);
  };

  // ========= 첫 로드 or 탭 전환 시 초기 Fetch =========
  useEffect(() => {
    // 수신 탭 & 수신 첫 로드
    if (selectedType === '1' && isFirstReceiveLoad) {
      fetchDocs(1, true);
    }
    // 발신 탭 & 발신 첫 로드
    else if (selectedType === '2' && isFirstSendLoad) {
      fetchDocs(1, true);
    }
  }, [selectedType, isFirstReceiveLoad, isFirstSendLoad, fetchDocs]);

  // ========= 필터 검색 =========
  const handleSearch = (params: SearchParams) => {
    // 현재 탭만 리셋 후, 새 검색
    if (selectedType === '1') {
      resetReceive();
      setReceiveSearchParams(params);
    } else {
      resetSend();
      setSendSearchParams(params);
    }

    // 새롭게 page=1부터 다시 가져오기
    fetchDocs(1, true, params);
  };

  // ========= IntersectionObserver 로직 =========
  useEffect(() => {
    // 로딩 중이면 굳이 오브저버 등록 X
    if (isLoading) return;

    // 마지막 페이지면 등록 X
    if (isLastPage) return;

    // 생성
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isLastPage) {
          // 현재 page 기준으로 fetchDocs 호출
          fetchDocs(currentPage);
        }
      },
      {
        rootMargin: '300px 0px', // 하단 300px 정도 여유 시점에서 fetching
      }
    );

    // 등록
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // 언마운트/업데이트 시 해제
    return () => {
      if (observer && observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchDocs, currentPage, isLoading, isLastPage]);

  // ========= IntersectionObserver 해제 함수 =========
  const unobserve = (ref: React.RefObject<HTMLDivElement | null>) => {
    // 로딩을 시작할 때, 혹은 fetchDocs 호출 직후 observer를 끊어주기
    if (!ref.current) return;
    // 새로 만들어진 observer가 있다면 해제할 수 있도록
    // 별도의 observer 저장 로직(Ref나 State)이 필요할 수도 있음
    // 여기서는 간단히 한번 해제 시도
    const tempObserver = new IntersectionObserver(() => {});
    tempObserver.unobserve(ref.current);
  };

  // ========= JSX =========
  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden">
      {/* 상단 탭 & 필터 버튼 */}
      <div className="z-10 my-10 flex w-full items-center justify-between">
        <div className="flex space-x-2">
          <ShortButton
            colorType={selectedType === '1' ? 'black' : 'gray'}
            onClick={() => handleTypeChange('1')}
            className="flex h-9 items-center justify-center"
          >
            수신
          </ShortButton>
          <ShortButton
            colorType={selectedType === '2' ? 'black' : 'gray'}
            onClick={() => handleTypeChange('2')}
            className="flex h-9 items-center justify-center"
          >
            발신
          </ShortButton>
        </div>

        <div className="flex items-center space-x-4">
          <SlidersHorizontal
            className="h-7 w-7 cursor-pointer"
            onClick={() => setIsFilterOpen(true)}
          />
        </div>
      </div>

      {/* 문서 리스트 영역 */}
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
            {/* 무한 스크롤 관찰 대상 */}
            <div ref={observerRef} className="h-10" />
          </>
        )}
      </div>

      {/* 필터 BottomSheet */}
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
