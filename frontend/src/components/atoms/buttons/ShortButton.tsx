import React from 'react';
import ButtonProps from './ButtonProps';

interface LongButtonProps extends ButtonProps {
  colorType?: 'primary' | 'gray' | 'black' | 'warning';
}

export default function LongButton({
  onClick,
  className,
  children,
  colorType = 'primary',
}: LongButtonProps) {
  // 색상 타입에 따른 배경색 클래스 설정
  const getColorClass = () => {
    switch (colorType) {
      case 'primary':
        return 'bg-primary-300';
      case 'gray':
        return 'bg-gray-300';
      case 'warning':
        return 'bg-status-warning';
      case 'black':
        return 'bg-text-default text-gray-white';
      default:
        return 'bg-primary-300';
    }
  };

  return (
    <button
      className={`${className} ${getColorClass()} mx-20 cursor-pointer rounded-md px-5 py-3 text-center font-medium transition-colors`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
