import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { TempatIbadahTable } from '@/components/admin/tables/TempatIbadahTable';

export default function TempatIbadahPage() {
  return (
    <AdminLayout>
      <TempatIbadahTable />
    </AdminLayout>
  );
} 