import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { KulinerTable } from '@/components/admin/tables/KulinerTable';
import { KulinerPageClient } from '@/components/admin/ui/KulinerPageClient';

interface KulinerPageProps {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function KulinerPage({ searchParams }: KulinerPageProps) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <AdminLayout>
      <KulinerPageClient />
      <KulinerTable searchParams={resolvedSearchParams} />
    </AdminLayout>
  );
} 