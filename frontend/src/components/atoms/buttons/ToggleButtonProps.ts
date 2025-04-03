import ButtonProps from './ButtonProps';

export default interface ToggleButtonProps extends ButtonProps {
  id: string;
  isSelected: boolean;
  icon?: string;
  onToggleClick: (id: string) => void;
}
