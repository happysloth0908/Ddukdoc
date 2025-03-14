interface SsafyMyInfoBoxProps {
    name: string;
    email: string;
    locate: string;
    pid: number;
    status: string;
}

export const SsafyMyInfoBox = ({name, email, locate, pid, status}: SsafyMyInfoBoxProps) => {
    return (
        <div className="w-full px-2 py-4 text-lg font-bold text-text-default">
            <div>
                <p>{name}</p>
                <p className="text-text-description font-normal">{email}</p>
            </div>
            <div className="flex justify-between">
                <div className="relative">{locate}</div>
                <div className="w-px h-11 bg-gray-400"></div>
                <div className="relative">{pid}</div>
                <div className="w-px h-11 bg-gray-400"></div>
                <div className="relative">{status}</div>
            </div>
        </div>
    )
}