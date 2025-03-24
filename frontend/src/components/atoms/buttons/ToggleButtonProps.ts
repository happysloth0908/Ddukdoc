import ButtonProps from './ButtonProps';

export default interface ToggleButtonProps extends ButtonProps {
  id: string;
  isSelected: boolean;
  icon?: React.ReactNode;
  onToggleClick: (id: string) => void;
}
