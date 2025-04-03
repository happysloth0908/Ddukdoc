import { forwardRef, ChangeEvent, InputHTMLAttributes } from 'react';

export interface DateInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type' | 'value'
  > {
  label?: string;
  helperText?: string;
  // value: string; // YYYY-MM-DD 형식
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  minDate?: string;
  maxDate?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      // helperText,
      className,
      // value,
      onChange,
      minDate,
      maxDate,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
    };

    return (
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col">
          {label && (
            <div className="mb-1 text-md font-medium text-text-default">
              {label}
            </div>
          )}
          <input
            ref={ref}
            type="date"
            // value={value}
            onChange={handleChange}
            min={minDate}
            max={maxDate}
            className={`h-12 w-full rounded-md border bg-bg-default px-3 py-2 text-md text-text-default focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:bg-gray-100 disabled:text-text-description ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export default DateInput;
