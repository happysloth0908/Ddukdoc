interface BadgeProps {
    type: string;
    title?: string;
}

export const Badge = ({type, title}: BadgeProps) => {
    // 차용증, 근로계약서
    if (type === "contract") {
        return (
            <div className="flex w-14 border border-secondary-g2 rounded-md bg-secondary-g1 justify-center items-center">
                <span className="text-[10px] text-secondary-g3 font-bold">{title}</span>
            </div>
        )
    }
    // 서명 대기
    else if (type === "waiting") {
        return (
            <div className="flex w-14 border border-gray-400 rounded-md bg-gray-100 justify-center items-center">
                <span className="text-[10px] text-[#4F4F4F] font-bold">서명 대기</span>
            </div>
        )
    }
    // 반송
    else if (type === "reject") {
        return (
            <div className="flex w-14 border border-secondary-y2 rounded-md bg-[#FFF3C2] justify-center items-center">
                <span className="text-[10px] text-[#4F4F4F] font-bold">반송</span>
            </div>
        )
    }
}