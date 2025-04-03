import {
  TextareaHTMLAttributes,
  ChangeEvent,
  forwardRef,
  useRef,
} from 'react';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  // value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e);
      // adjustHeight();
    };

    // const adjustHeight = () => {
    //   const textarea = textareaRef.current;
    //   if (textarea) {
    //     textarea.style.height = 'auto';
    //     textarea.style.height = `${textarea.scrollHeight}px`;
    //   }
    // };


    return (
      <div className="flex w-full justify-center">
        <div className="flex w-full">
          <textarea
            ref={(element) => {
              textareaRef.current = element;
              if (typeof ref === 'function') {
                ref(element);
              } else if (ref) {
                ref.current = element;
              }
            }}
            onChange={handleChange}
            rows={3}
            className={`min-h-[72px] w-full resize-none rounded-md border bg-bg-default px-3 py-2 text-md text-text-default placeholder:text-text-description focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:bg-gray-100 disabled:text-text-description ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
