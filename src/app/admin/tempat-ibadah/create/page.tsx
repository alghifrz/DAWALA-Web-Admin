'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { TempatIbadahForm } from '@/components/admin/forms/TempatIbadahForm';
import { createTempatIbadah } from '@/lib/api/tempat-ibadah';
import { TempatIbadahFormData } from '@/lib/types/admin';

export default function CreateTempatIbadahPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: TempatIbadahFormData) => {
    try {
      setLoading(true);
      await createTempatIbadah(data);
      router.push('/admin/tempat-ibadah');
    } catch (error) {
      console.error('Error creating tempat ibadah:', error);
      alert('Gagal membuat tempat ibadah baru');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Tempat Ibadah Baru</h1>
          <p className="text-gray-600">Isi form di bawah untuk menambahkan tempat ibadah baru</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <TempatIbadahForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </AdminLayout>
  );
} 