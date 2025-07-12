'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { KulinerForm } from '@/components/admin/forms/KulinerForm';
import { KulinerFormData } from '@/lib/types/admin';

export default function KulinerCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: KulinerFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/kuliner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menambah kuliner');
      }

      const result = await response.json();
      
      if (result.success) {
        alert(result.message || 'Kuliner berhasil ditambahkan!');
        router.push('/admin/kuliner');
      } else {
        alert(result.error || 'Gagal menambah kuliner');
      }
    } catch (error) {
      console.error('Error creating kuliner:', error);
      alert(error instanceof Error ? error.message : 'Gagal menambah kuliner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tambah Kuliner Baru</h1>
        <p className="text-gray-600">Isi form di bawah untuk menambahkan kuliner baru</p>
      </div>
      <KulinerForm onSubmit={handleSubmit} loading={loading} />
    </AdminLayout>
  );
} 