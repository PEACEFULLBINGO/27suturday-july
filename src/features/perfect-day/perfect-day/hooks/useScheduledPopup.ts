import { useEffect, useState } from 'react';

export function useScheduledPopup(isComplete: boolean) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 7 || hour > 22) return;
    const t = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isComplete && new Date().getHours() >= 7) setOpen(true);
    }, 2 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  // Auto-hide after 9s, matching the original's transient toast-like behavior.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 9000);
    return () => clearTimeout(t);
  }, [open]);

  return { open, setOpen };
}
