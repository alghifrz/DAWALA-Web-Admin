'use client';

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { KulinerForm } from '@/components/admin/forms/KulinerForm';
import { KulinerFormData } from '@/lib/types/admin';

export default function KulinerCreatePage() {
  const handleSubmit = async (data: KulinerFormData) => {
    alert('Data submitted: ' + JSON.stringify(data));
  };

  return (
    <AdminLayout>
      <KulinerForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
} 