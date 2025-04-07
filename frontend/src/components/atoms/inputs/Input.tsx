import { InputHTMLAttributes, ChangeEvent, forwardRef } from 'react';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  placeholder?: string;
  // value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, placeholder, onChange, className, ...props },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e);
    };

    return (
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col">
          {label && (
            <div className="mb-1 text-xl font-medium text-text-default">
              {label}
            </div>
          )}
          <input
            ref={ref}
            // value={value}
            placeholder={placeholder}
            onChange={handleChange}
            className={`h-12 w-full rounded-md border bg-bg-default px-3 py-2 text-xl text-text-default placeholder:text-text-description focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:bg-gray-100 disabled:text-text-description ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'TaggedInput';

export default Input;
