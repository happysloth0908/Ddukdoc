interface DocSelectCardProps {
    onToggleClick: (id: string) => void;
    icon?: string;
    isSelected: boolean;
    id: string;
    title: string;
    description: string;
    className?: string;
    disabled?: boolean;
}

export default function DocSelectCard({
  onToggleClick,
  icon,
  isSelected,
  id,
  title,
  description,
  className,
  disabled
}: DocSelectCardProps) {
  // 색상 타입에 따른 배경색 클래스 설정

  const handleClick = () => {
    if (!disabled) {
        onToggleClick(id);
    }
  }

  return (
    <button
      className={`${className} ${isSelected ? 'bg-primary-300 text-gray-white' : ''} relative w-full flex gap-x-10 items-center justify-center cursor-pointer rounded px-5 py-4 border border-gray-400 transition-colors overflow-hidden`}
      onClick={handleClick}
    >
      <img className='w-8 h-8' src={icon} alt="" />
      <div className="text-left flex-1">
        <p className="font-bold">{title}</p>
        <p className={`text-sm ${isSelected ? 'text-white' : 'text-[#757575]'}`}>{description}</p>
      </div>
      {disabled ? <div className="absolute bg-[#00000050] w-full h-full z-10 backdrop-blur-sm"></div> : null}
    </button>
  );
}
