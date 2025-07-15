import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { FasilitasTempatIbadahTable } from '@/components/admin/tables/FasilitasTempatIbadahTable';

export default function FasilitasTempatIbadahPage() {
  return (
    <AdminLayout>
      <FasilitasTempatIbadahTable />
    </AdminLayout>
  );
} 