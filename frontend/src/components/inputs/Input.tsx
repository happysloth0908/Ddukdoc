import { InputHTMLAttributes, ChangeEvent, forwardRef } from 'react';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, helperText, placeholder, className, value, onChange, ...props },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="flex w-full justify-center">
        <div className="flex w-4/5 flex-col">
          {label && (
            <div className="mb-1 text-md font-medium text-text-default">
              {label}
            </div>
          )}
          <input
            ref={ref}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            className={`h-12 w-full rounded-md border bg-bg-default px-3 py-2 text-md text-text-default placeholder:text-text-description focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:bg-gray-100 disabled:text-text-description ${className}`}
            {...props}
          />
        </div>
      </div>
    );
    <div className="relative h-12 w-80">
      <div className="absolute left-0 top-0 h-12 w-80 rounded-[10px] border border-zinc-300 bg-white" />
    </div>;
  }
);

Input.displayName = 'TaggedInput';

export default Input;
