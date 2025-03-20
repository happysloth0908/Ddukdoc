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
      className={`${className} w-full cursor-pointer rounded-2xl border-4 border-black bg-primary-300 px-5 py-6 text-center font-medium transition-colors`}
      onClick={() => onClick}
    >
      {icon}
      <div className="flex flex-col">
        <div>{children}</div>
        <div className="text-fontSize-s text-text-description">
          {explanation}
        </div>
      </div>
    </button>
  );
}
