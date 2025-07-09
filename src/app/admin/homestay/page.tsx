import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { HomestayTable } from '@/components/admin/tables/HomestayTable';

interface HomestayPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

export default async function HomestayPage({ searchParams }: HomestayPageProps) {
  return (
    <AdminLayout>
      <HomestayTable searchParams={searchParams} />
    </AdminLayout>
  );
} 