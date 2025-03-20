import ToggleButtonProps from './ToggleButtonProps';

export default function DocSelectCard({
  onToggleClick,
  className,
  children,
  id,
  isSelected,
  icon,
}: ToggleButtonProps) {
  // 색상 타입에 따른 배경색 클래스 설정

  return (
    <button
      className={`${className} ${isSelected ? 'text-gray-white bg-primary-300' : 'bg-gray-200'} mx-20 w-full cursor-pointer rounded-2xl px-5 py-6 text-center font-medium transition-colors`}
      onClick={() => onToggleClick(id)}
    >
      {children}
      {icon}
    </button>
  );
}
