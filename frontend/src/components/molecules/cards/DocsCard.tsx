import atoms from "@/components/atoms"

interface DocsCardProps {
    data: {
        id: number,                  // number - 문서 고유 식별자
        template_id: number,        // number - 문서 종류 번호
        template_code : string,  //String - 문서 종류 코드
        template_name: string, // string - 문서 종류 이름
        title: string,     // string - 문서 제목
        status: string,      // string - 문서 현재 상태
        creator_id: number,          // number - 발신자 ID
        creator_name: string,   // string - 발신자 이름
        recipient_id: number,       // number - 수신자 ID
        recipient_name: string, // string - 수신자 이름
        created_at: string, // string (ISO 8601) - 생성 시간
        updated_at: string, // string (ISO 8601) - 수정 시간
        return_reason: string | null     // string | null - 반송 사유 (없을 경우 null)
    };
    calls: string;  // 보는 입장에서 수신자인지 발신자인지
}

export const DocsCard = ({data, calls}: DocsCardProps) => {
    const formattedDate = new Date(data.updated_at).toISOString().split("T")[0].replace(/-/g, '.');

    return (
        <div className="relative w-full p-5 grid grid-cols-4 grid-rows-2 border border-bg-card rounded-lg">
            <div className="flex justify-center row-span-2">
                <atoms.RoundIcon isRejected={data.status === "반송" ? true : false} />
            </div>
            <div className="col-span-3 row-span-2 flex flex-col gap-y-[6px]">
                <div className="font-bold text-l">{data.title}</div>
                <div className="text-[#5355353] text-xs">{calls == "수신" ? "발송인 : " + data.creator_name : "수신인 : " + data.recipient_name}</div>
                <div className="text-[#828282] text-s">작성일 | {formattedDate}</div>
                <div className="flex gap-x-1">
                    <atoms.Badge type={data.template_code} title={data.template_name} />
                    <atoms.Badge type={data.status} />
                </div>
            </div>
            <div className="absolute right-6 top-6 flex flex-col gap-y-[2px]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#B6B6B6]"></div>
                <div className="w-[5px] h-[5px] rounded-full bg-[#B6B6B6]"></div>
                <div className="w-[5px] h-[5px] rounded-full bg-[#B6B6B6]"></div>
            </div>
        </div>
    )
}

