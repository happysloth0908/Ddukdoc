import ToggleButtonProps from './ToggleButtonProps';

export default function DocSelectCard({
  onToggleClick,
  className,
  children,
  id,
  isSelected,
  icon,
  disabled
}: ToggleButtonProps) {
  // 색상 타입에 따른 배경색 클래스 설정

  const handleClick = () => {
    if (!disabled) {
      onToggleClick(id);
    }
  }

  return (
    <button
      className={`${className} ${isSelected ? 'bg-primary-300 text-gray-white' : 'bg-gray-200'} relative w-full flex items-center justify-center cursor-pointer rounded-2xl px-5 py-6 text-center font-medium transition-colors overflow-hidden`}
      onClick={handleClick}
    >
      {children}
      <img className='w-12 h-12' src={icon} alt="" />
      {disabled ? <div className="absolute bg-[#00000050] w-full h-full z-10 backdrop-blur-sm"></div> : null}
    </button>
  );
}
