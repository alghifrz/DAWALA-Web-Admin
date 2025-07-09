'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './Button';

interface DeleteButtonProps {
  action: string;
  confirmMessage?: string;
}

export function DeleteButton({ action, confirmMessage = 'Apakah Anda yakin ingin menghapus item ini?' }: DeleteButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!confirm(confirmMessage)) {
      e.preventDefault();
    }
  };

  return (
    <form action={action} method="POST" className="inline">
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-800"
        onClick={handleClick}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
} 