'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { TempatIbadahForm } from '@/components/admin/forms/TempatIbadahForm';
import { TempatIbadahFormData } from '@/lib/types/admin';

export default function TempatIbadahCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: TempatIbadahFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/tempat-ibadah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menambah tempat ibadah');
      }

      const result = await response.json();
      
      if (result.success) {
        alert(result.message || 'Tempat ibadah berhasil ditambahkan!');
        router.push('/admin/tempat-ibadah');
      } else {
        alert(result.error || 'Gagal menambah tempat ibadah');
      }
    } catch (error) {
      console.error('Error creating tempat ibadah:', error);
      alert(error instanceof Error ? error.message : 'Gagal menambah tempat ibadah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tambah Tempat Ibadah Baru</h1>
        <p className="text-gray-600">Isi form di bawah untuk menambahkan tempat ibadah baru</p>
      </div>
      <TempatIbadahForm onSubmit={handleSubmit} loading={loading} />
    </AdminLayout>
  );
} 