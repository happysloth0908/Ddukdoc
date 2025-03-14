interface ProgressBarProps {
    curStage: number;
    totalStage: number;
}

export const ProgressBar = ({curStage, totalStage}: ProgressBarProps) => {
    const progress = Math.min((curStage / totalStage)*100, 100);

    return (
        <div className="relative w-[90%] rounded-[20px] bg-gray-300">
            <div style={{ width: `${progress}%` }} className="absolute left-0 top-1/2 -translate-y-1/2 bg-status-info"></div>
        </div>
    )
}