'use client';

import { useFormStatus } from 'react-dom';

interface AdminSubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}

export default function AdminSubmitButton({ children, className = '', pendingText = 'Kaydediliyor...' }: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-busy={pending}
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
