import DefaultImages from '@/assets/images/default';

interface RoundIconProps {
    isRejected: boolean;
}

export const RoundIcon = ({isRejected}: RoundIconProps) => {
    if (isRejected) {
        return (
            <div className="bg-primary-100 w-11 h-11 rounded-full flex justify-center items-center">
                <img className='w-6 h-6' src={DefaultImages.WarningIcon} alt="반송" />
            </div>
        );
    }

    return (
        <div className="bg-primary-100 w-11 h-11 rounded-full flex justify-center items-center">
            <img className='w-6 h-6' src={DefaultImages.FileIcon} alt="파일" />
        </div>
    )
}