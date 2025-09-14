import React from 'react';
import { Input, InputProps } from '../atoms/Input';
import { cn } from '@/lib/utils';

interface FormFieldProps extends InputProps {
  label: string;
  description?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  description, 
  required, 
  className,
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-spa-charcoal">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-spa-slate">{description}</p>
      )}
      <Input {...props} />
    </div>
  );
};

export { FormField };
export type { FormFieldProps };