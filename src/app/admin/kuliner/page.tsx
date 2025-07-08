import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { KulinerTable } from '@/components/admin/tables/KulinerTable';

export default function KulinerPage() {
  return (
    <AdminLayout>
      <KulinerTable />
    </AdminLayout>
  );
} 