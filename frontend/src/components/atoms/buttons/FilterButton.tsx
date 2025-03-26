import ButtonProps from './ButtonProps';

interface FilterButtonProps extends ButtonProps {
  selected?: boolean;
}

export default function FilterButton({
  onClick,
  className,
  children,
  selected = false,
}: FilterButtonProps) {
  return (
    <button
      className={`rounded-full border px-4 py-2 text-md transition-colors ${
        selected
          ? 'border-text-default bg-gray-200 font-bold text-text-default'
          : 'border-gray-300 bg-gray-white text-text-default hover:bg-gray-100'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
