import atoms from "@/components/atoms"

interface AdditionalFileProps {
    data: {
        id : number // number - 증빙자료 ID
        title: string,      // string - 파일 제목
        user_id: number,          // number - 사용자 ID
        user_name: string,     // string - 사진 저장 주체 이름
        created_at: string, // string (ISO 8601) - 생성 시간
        updated_at: string  // string (ISO 8601) - 수정 시간
        format: string // string - 기타 자료 확장자 
    };
}

export const AdditionalFile = ({data}: AdditionalFileProps) => {
    const formattedDate = new Date(data.updated_at).toISOString().split("T")[0].replace(/-/g, '.');

    return (
        <div className="relative w-full p-5 grid grid-cols-4 grid-rows-2 border border-bg-card rounded-lg">
            <div className="flex justify-center row-span-2">
                <atoms.RoundIcon isRejected={false} />
            </div>
            <div className="col-span-3 row-span-2 flex flex-col gap-y-[6px]">
                <div className="font-bold text-l">{data.title}</div>
                <div className="text-[#828282] text-s">{data.user_name} | {formattedDate}</div>
            </div>
            <div className="absolute right-6 top-6 flex flex-col gap-y-[2px]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#B6B6B6]"></div>
                <div className="w-[5px] h-[5px] rounded-full bg-[#B6B6B6]"></div>
                <div className="w-[5px] h-[5px] rounded-full bg-[#B6B6B6]"></div>
            </div>
        </div>
    )
}