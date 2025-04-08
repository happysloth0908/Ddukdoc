import { useEffect, useRef, useState } from 'react';
import atoms from '@/components/atoms';
import { SsafyDocData } from '@/types/mypage';

interface DocsCardProps {
  data: SsafyDocData;
  onPatch?: (id: number) => void; // 수정 핸들러 props (선택)
}

export const SsafyDocsCard = ({ data, onPatch }: DocsCardProps) => {
  const formattedDate = new Date(data.updated_at)
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '.');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePatch = () => {
    setIsMenuOpen(false);
    if (onPatch) onPatch(data.document_id);
  };

  return (
    <div className="relative grid w-full grid-cols-4 grid-rows-2 rounded-lg border border-bg-card p-5">
      <div className="row-span-2 flex justify-center">
        <atoms.RoundIcon isRejected={data.status === '반송'} />
      </div>
      <div className="col-span-3 row-span-2 flex flex-col gap-y-[6px]">
        <div className="text-l font-bold">
          {data.title.length > 15
            ? `${data.title.substring(0, 15)}...`
            : data.title}
        </div>
        <div className="text-s text-[#828282]">작성일 | {formattedDate}</div>
        <atoms.Badge type={data.template_code} />
      </div>

      {/* 점 세 개 버튼 + 메뉴 */}
      <div
        className="absolute right-6 top-6"
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-6 w-6 cursor-pointer flex-col items-center justify-center gap-y-[2px]"
        >
          <div className="h-[5px] w-[5px] rounded-full bg-[#B6B6B6]"></div>
          <div className="h-[5px] w-[5px] rounded-full bg-[#B6B6B6]"></div>
          <div className="h-[5px] w-[5px] rounded-full bg-[#B6B6B6]"></div>
        </div>

        {isMenuOpen && (
          <div className="absolute right-4 top-2 z-10 mt-2 w-20 rounded border border-gray-200 bg-white shadow-md">
            <button
              onClick={handlePatch}
              className="flex w-full items-center justify-center px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              수정
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
