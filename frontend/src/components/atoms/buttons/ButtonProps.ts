export default interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}
