import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-ink-light font-medium">{label}</label>}
      <input ref={ref} className={`input-field ${className}`} {...props} />
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
