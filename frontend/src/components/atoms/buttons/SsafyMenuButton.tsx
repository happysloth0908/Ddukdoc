import ButtonProps from './ButtonProps';

export default function SsafyMenuButton({
  onClick,
  className,
  children,
  icon,
}: ButtonProps) {
  // 색상 타입에 따른 배경색 클래스 설정

  return (
    <button
      className={`${className} mx-20 flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-ssafy-default px-5 py-6 text-center font-medium transition-colors`}
      onClick={onClick}
    >
      <div className="mb-2 flex h-12 w-12 items-center justify-center">
        {icon}
      </div>
      <div>{children}</div>
    </button>
  );
}
