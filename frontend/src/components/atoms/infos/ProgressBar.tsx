interface ProgressBarProps {
    curStage: number;
    totalStage: number;
}

export const ProgressBar = ({curStage, totalStage}: ProgressBarProps) => {
    const progress = Math.min((curStage / totalStage)*100, 100);

    return (
        <div className="relative w-[90%] h-2 rounded-[20px] bg-gray-300">
            <div style={{ width: `${progress}%` }} className="absolute h-2 left-0 top-0 bg-status-info"></div>
        </div>
    )
}