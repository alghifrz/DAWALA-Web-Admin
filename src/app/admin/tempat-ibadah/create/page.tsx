'use client';

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { TempatIbadahForm } from '@/components/admin/forms/TempatIbadahForm';
import { TempatIbadahFormData } from '@/lib/types/admin';

export default function TempatIbadahCreatePage() {
  const handleSubmit = async (data: TempatIbadahFormData) => {
    alert('Data submitted: ' + JSON.stringify(data));
  };

  return (
    <AdminLayout>
      <TempatIbadahForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
} 