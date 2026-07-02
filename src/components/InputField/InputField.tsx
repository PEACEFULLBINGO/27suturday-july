import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import './InputField.css';

export function FieldLabel({ children, ...rest }: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return <label className="flbl" {...rest}>{children}</label>;
}

export function TextInput({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`field ${className}`.trim()} {...rest} />;
}

export function TextArea({ className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`field ${className}`.trim()} {...rest} />;
}

export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return <select className={`field ${className}`.trim()} {...rest}>{children}</select>;
}

/** Label + input pair, for the common case where you don't need custom layout. */
export function LabeledInput({
  id, label, ...rest
}: { id: string; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <TextInput id={id} {...rest} />
    </div>
  );
}
