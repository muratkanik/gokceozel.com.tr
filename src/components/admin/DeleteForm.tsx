'use client';

import React from 'react';

type DeleteFormProps = {
  action: (formData: FormData) => void;
  confirmMessage: string;
  children: React.ReactNode;
};

export default function DeleteForm({ action, confirmMessage, children }: DeleteFormProps) {
  return (
    <form action={action}>
      {children}
      <button 
        type="submit" 
        onClick={(e) => {
          if (!confirm(confirmMessage)) {
            e.preventDefault();
          }
        }} 
        style={{ 
          background: '#ff4757', 
          color: '#fff', 
          border: 'none', 
          padding: '8px 15px', 
          borderRadius: '4px', 
          cursor: 'pointer', 
          fontSize: '14px' 
        }}
      >
        Sil
      </button>
    </form>
  );
}
