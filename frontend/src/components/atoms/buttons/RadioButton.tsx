interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  className: string;
}

export const RadioButton = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  className,
}: RadioButtonProps) => {
  return (
    <div className="flex justify-center">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mx-2"
      />
      <label htmlFor={id} className={`${className}text-gray-700`}>
        {label}
      </label>
    </div>
  );
};
