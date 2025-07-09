import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { PemesananTable } from '@/components/admin/tables/PemesananTable';

interface PemesananPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  };
}

export default async function PemesananPage({ searchParams }: PemesananPageProps) {
  return (
    <AdminLayout>
      <PemesananTable searchParams={searchParams} />
    </AdminLayout>
  );
} 