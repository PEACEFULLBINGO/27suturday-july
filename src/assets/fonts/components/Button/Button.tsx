import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-p',
  ghost: 'btn-g',
  danger: 'btn-d',
};

/** Buttons across StudyFlow Orbit; pass `variant`/`size`/`fullWidth` instead of raw class names. */
export function Button({
  variant = 'ghost',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    VARIANT_CLASS[variant],
    size === 'sm' ? 'btn-sm' : '',
    fullWidth ? 'w100' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
