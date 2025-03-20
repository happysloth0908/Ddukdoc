import ButtonProps from './buttonProps';

export default function LongButton({
  onClick,
  className,
  children,
}: ButtonProps) {
  return (
    <div
      className={`${className} bg-primary-300 mx-20 rounded-md py-3 text-center`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
