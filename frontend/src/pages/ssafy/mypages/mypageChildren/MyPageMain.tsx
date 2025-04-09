import { DocsDescription } from '@/components/atoms/infos/DocsDescription';
import { SsafyDocsCard } from '@/components/molecules/cards/SsafyDocsCard';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSsafyDocs } from '@/apis/ssafy/mypage';
import Spinner from '@/components/atoms/feedback/Spinner';
import { SsafyDocData } from '@/types/mypage';

const MyPageMain = () => {
  const navigate = useNavigate();
  const [currentDocs, setCurrentDocs] = useState<SsafyDocData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  // 무한 스크롤을 위한 observer ref
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isFirstLoad) return;

      setIsLoading(true);
      try {
        const response = await getSsafyDocs(1);
        setCurrentDocs(response?.data.content || []);
        setPage(2);
        setIsFirstLoad(false);
      } catch (error) {
        console.error('문서 목록 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [isFirstLoad]);

  // Intersection Observer 설정
  useEffect(() => {
    if (isFirstLoad) return;

    const handleIntersect = async (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isLoading && !isLastPage) {
        setIsLoading(true);
        try {
          if (observerRef.current) {
            observer.current?.unobserve(observerRef.current);
          }

          const nextPage = page;
          const response = await getSsafyDocs(nextPage);
          const newDocs = response?.data.content || [];

          setCurrentDocs((prev) => [...prev, ...newDocs]);
          setPage((prev) => prev + 1);

          if (newDocs.length === 0) {
            setIsLastPage(true);
          }
        } catch (error) {
          console.error('문서 목록 로딩 실패:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    observer.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '300px 0px',
    });

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.current.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.current?.unobserve(currentRef);
      }
    };
  }, [isFirstLoad, isLoading, isLastPage]);

  const handlePatch = async (docId: number) => {
    // currentDocs 배열에서 해당 docId를 가진 문서 찾기
    const targetDoc = currentDocs.find((doc) => doc.document_id === docId);
    navigate(`/ssafy/mypage/patch/${docId}`, {
      state: { templateCode: targetDoc?.template_code },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="flex w-full flex-col space-y-4 pt-4">
        <DocsDescription
          title={'김소운'}
          subTitle={''}
          description={'sozzy@naver.com'}
        />
        <div className="flex items-center justify-between">
          <span className="text-lg font-normal text-black">대전</span>
          <span className="text-2xl text-gray-400">|</span>
          <span className="text-lg font-normal text-black">12333494</span>
          <span className="text-2xl text-gray-400">|</span>
          <span className="text-lg font-normal text-black">재학 중</span>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col space-y-4 overflow-y-auto pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-lg font-bold text-black">작성한 문서</div>
            <div className="text-lg font-bold text-gray-500">
              {currentDocs.length}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col space-y-4 overflow-y-auto pt-2">
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
                  onClick={() => {
                    navigate(`/ssafy/mypage/detail/${doc.document_id}`);
                  }}
                >
                  <SsafyDocsCard
                    data={doc}
                    onPatch={(id) => {
                      handlePatch(id);
                    }}
                  />
                </div>
              ))}
              {isLoading && <Spinner />}
              {/* 무한 스크롤 관찰 대상 */}
              <div ref={observerRef} className="h-10" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPageMain;
