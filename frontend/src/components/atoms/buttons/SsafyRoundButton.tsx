import ButtonProps from './ButtonProps';

export const SsafyRoundButton = ({
  icon,
  className,
  children,
}: ButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <button className={`${className} h-12 w-12 rounded-full bg-gray-100`}>
        {icon}
      </button>
      {children}
    </div>
  );
};
