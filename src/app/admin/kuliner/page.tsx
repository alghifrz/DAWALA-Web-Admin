import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { KulinerTable } from '@/components/admin/tables/KulinerTable';

interface KulinerPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  };
}

export default async function KulinerPage({ searchParams }: KulinerPageProps) {
  return (
    <AdminLayout>
      <KulinerTable searchParams={searchParams} />
    </AdminLayout>
  );
} 