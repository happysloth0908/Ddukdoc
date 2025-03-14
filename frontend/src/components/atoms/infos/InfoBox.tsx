interface InfoBoxProps {
    context: string;
}

export const InfoBox = ({context}: InfoBoxProps) => {
    return (
        <div className="w-[90%] p-4 bg-[#E8F1FF] rounded-[10px] text-primary-400">
            <p className="font-bold font-xs">Tip!</p>
            <p className="break-keep font-[10px]">{context}</p>
        </div>
    )
}