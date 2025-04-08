import atoms from '@/components/atoms';
import { FileData } from '@/types/mypage.ts';
import { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/apis/mypage.ts';
import { useParams } from 'react-router-dom';

interface AdditionalFileProps {
  data: FileData;
  onDelete?: (id: number) => void;
}

export const AdditionalFile = ({ data, onDelete }: AdditionalFileProps) => {
  const formattedDate = new Date(data.updated_at)
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '.');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();

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

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/api/material/${id}/${data.material_id}`);
      setIsMenuOpen(false);
      if (onDelete) onDelete(data.material_id);
    } catch (error) {
      console.error('파일 삭제 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className="relative grid w-full grid-cols-4 grid-rows-2 rounded-lg border border-bg-card p-5">
      <div className="row-span-2 flex justify-center">
        <atoms.RoundIcon isRejected={false} />
      </div>
      <div className="col-span-3 row-span-2 flex flex-col gap-y-[6px]">
        <div className="text-l font-bold">
          {data.title.length > 10
            ? `${data.title.substring(0, 10)}...`
            : data.title}
          .{data.format}
        </div>
        <div className="text-s text-[#828282]">
          {data.user_name} | {formattedDate}
        </div>
      </div>
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
