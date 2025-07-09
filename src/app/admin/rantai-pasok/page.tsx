import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { RantaiPasokTable } from '@/components/admin/tables/RantaiPasokTable';

interface RantaiPasokPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

export default async function RantaiPasokPage({ searchParams }: RantaiPasokPageProps) {
  return (
    <AdminLayout>
      <RantaiPasokTable searchParams={searchParams} />
    </AdminLayout>
  );
} 