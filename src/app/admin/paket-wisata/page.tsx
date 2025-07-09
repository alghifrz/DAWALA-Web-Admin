import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { PaketWisataTable } from '@/components/admin/tables/PaketWisataTable';

interface PaketWisataPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

export default async function PaketWisataPage({ searchParams }: PaketWisataPageProps) {
  return (
    <AdminLayout>
      <PaketWisataTable searchParams={searchParams} />
    </AdminLayout>
  );
} 