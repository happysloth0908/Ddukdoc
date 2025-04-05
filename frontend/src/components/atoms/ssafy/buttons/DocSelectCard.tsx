interface DocSelectCardProps {
    onToggleClick: (id: string) => void;
    icon?: string;
    isSelected: boolean;
    id: string;
    title: string;
    description: string;
    className?: string;
}

export default function DocSelectCard({
  onToggleClick,
  icon,
  isSelected,
  id,
  title,
  description,
  className,
}: DocSelectCardProps) {
  // 색상 타입에 따른 배경색 클래스 설정

  return (
    <button
      className={`${className} ${isSelected ? 'bg-primary-300 text-gray-white' : ''} w-full flex gap-x-10 items-center justify-center cursor-pointer rounded px-5 py-4 border border-gray-400 transition-colors`}
      onClick={() => onToggleClick(id)}
    >
      <img className='w-8 h-8' src={icon} alt="" />
      <div className="text-left">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
}
