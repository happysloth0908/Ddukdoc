interface SmallButtonProps {
  imageSrc: string;
  title: string;
  subtitle: string;
}

const SmallButton = ({ imageSrc, title, subtitle }: SmallButtonProps) => {
  return (
    <div className="relative flex h-48 w-full max-w-xs flex-col items-center overflow-hidden rounded-xl shadow-md">
      <div className="absolute inset-0 rounded-xl bg-white"></div>

      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <div className="mb-4 w-16 ">
          <img className="h-16 w-auto object-contain" src={imageSrc} alt="User Icon" />
        </div>

        <div className="mb-2 text-center text-xl font-extrabold">{title}</div>
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
