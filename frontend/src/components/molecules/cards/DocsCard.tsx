import { useEffect, useRef, useState } from 'react';
import atoms from '@/components/atoms';
import { DocData } from '@/types/mypage.ts';

interface DocsCardProps {
  data: DocData;
  calls: string;
  onDelete?: (id: number) => void; // 삭제 핸들러 props (선택)
}

export const DocsCard = ({ data, calls, onDelete }: DocsCardProps) => {
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

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (onDelete) onDelete(data.document_id);
  };

  return (
    <div className="relative grid w-full grid-cols-4 grid-rows-2 rounded-lg border border-bg-card p-5">
      <div className="row-span-2 flex justify-center">
        <atoms.RoundIcon isRejected={data.status === '반송'} />
      </div>
      <div className="col-span-3 row-span-2 flex flex-col gap-y-[6px]">
        <div className="text-l font-bold">
          {data.title.length > 10
            ? data.title.slice(0, 15) + '...'
            : data.title}
        </div>
        <div className="text-xs text-[#5355353]">
          {calls === '수신'
            ? `발송인 : ${data.creator_name}`
            : data.recipient_name === null
              ? '수신대기중'
              : `수신인 : ${data.recipient_name}`}
        </div>
        <div className="text-s text-[#828282]">작성일 | {formattedDate}</div>
        <div className="flex gap-x-1">
          <atoms.Badge type={data.template_code} title={data.template_name} />
          <atoms.Badge type={data.status} />
        </div>
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
              onClick={handleDelete}
              className="flex w-full items-center justify-center px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
