import atoms from '@/components/atoms';
import { FileData } from '@/types/mypage.ts';

interface AdditionalFileProps {
  data: FileData;
}

export const AdditionalFile = ({ data }: AdditionalFileProps) => {
  const formattedDate = new Date(data.updated_at)
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '.');

  return (
    <div className="relative grid w-full grid-cols-4 grid-rows-2 rounded-lg border border-bg-card p-5">
      <div className="row-span-2 flex justify-center">
        <atoms.RoundIcon isRejected={false} />
      </div>
      <div className="col-span-3 row-span-2 flex flex-col gap-y-[6px]">
        <div className="text-l font-bold">{data.title}</div>
        <div className="text-s text-[#828282]">
          {data.user_name} | {formattedDate}
        </div>
      </div>
      <div className="absolute right-6 top-6 flex flex-col gap-y-[2px]">
        <div className="h-[5px] w-[5px] rounded-full bg-[#B6B6B6]"></div>
        <div className="h-[5px] w-[5px] rounded-full bg-[#B6B6B6]"></div>
        <div className="h-[5px] w-[5px] rounded-full bg-[#B6B6B6]"></div>
      </div>
    </div>
  );
};
