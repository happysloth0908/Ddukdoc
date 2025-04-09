interface SmallButtonProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  className?: string;
}

const SmallButton = ({
  imageSrc,
  title,
  subtitle,
  className,
}: SmallButtonProps) => {
  return (
    <div
      className={`${className} relative flex w-full flex-col items-center overflow-hidden rounded-xl`}
    >
      <div className="absolute inset-0 rounded-xl bg-white"></div>

      <div className="relative flex h-full w-full flex-col items-center justify-center py-4">
        <div className="mb-3 w-16">
          <img
            className="h-16 w-auto object-contain"
            src={imageSrc}
            alt={title}
          />
        </div>

        <div className="mb-1 text-center text-xl font-extrabold">{title}</div>
        <div className="text-center text-xs font-light">{subtitle}</div>
      </div>
    </div>
  );
};

// 기본 props 설정
// SmallButton.defaultProps = {
//   imageSrc: '/api/placeholder/74/59',
//   title: '나의 문서',
//   subtitle: '간편하게 빠르게 문서 작성',
// };

export default SmallButton;
