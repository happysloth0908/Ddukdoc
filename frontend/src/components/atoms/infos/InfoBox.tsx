import React from "react";

interface InfoBoxProps {
    context: string;
}

export const InfoBox = ({context}: InfoBoxProps) => {
    return (
        <div className="w-full p-4 bg-[#E8F1FF] rounded-[10px] text-primary-400">
            <p className="font-bold font-xs">Tip!</p>
            <p className="break-keep font-[10px]">
                {context.split("<br/>").map((line, index) => (
                    <React.Fragment key={index}>
                    {line}
                    <br />
                    </React.Fragment>
                ))}
            </p>
        </div>
    )
}