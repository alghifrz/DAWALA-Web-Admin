import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { TempatIbadahTable } from '@/components/admin/tables/TempatIbadahTable';

interface TempatIbadahPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

export default async function TempatIbadahPage({ searchParams }: TempatIbadahPageProps) {
  return (
    <AdminLayout>
      <TempatIbadahTable searchParams={searchParams} />
    </AdminLayout>
  );
} 