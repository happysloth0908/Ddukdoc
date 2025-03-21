import ButtonProps from './ButtonProps';

interface SsafyDocSelectCardProps extends ButtonProps {
  explanation: string;
}

export default function SsafyDocSelectCard({
  explanation,
  onClick,
  className,
  children,
  icon,
}: SsafyDocSelectCardProps) {
  // 색상 타입에 따른 배경색 클래스 설정

  return (
    <button
      className={`${className} flex w-full cursor-pointer flex-row items-center justify-center rounded-2xl border-2 border-gray-300 px-5 py-6 text-center font-medium transition-colors`}
      onClick={() => onClick}
    >
      <div className="flex h-12 w-12 items-center justify-center">{icon}</div>
      <div className="flex flex-col pl-3 text-left">
        <div>{children}</div>
        <div className="text-fontSize-xs text-text-description">
          {explanation}
        </div>
      </div>
    </button>
  );
}
