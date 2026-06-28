import { useToast } from './ToastContext';

export function Toast() {
  const { message, visible } = useToast();
  return (
    <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
