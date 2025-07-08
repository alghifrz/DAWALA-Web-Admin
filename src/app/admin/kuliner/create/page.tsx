'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { KulinerForm } from '@/components/admin/forms/KulinerForm';
import { createKuliner } from '@/lib/api/kuliner';
import { KulinerFormData } from '@/lib/types/admin';

export default function CreateKulinerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: KulinerFormData) => {
    try {
      setLoading(true);
      await createKuliner(data);
      router.push('/admin/kuliner');
    } catch (error) {
      console.error('Error creating kuliner:', error);
      alert('Gagal membuat kuliner baru');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Kuliner Baru</h1>
          <p className="text-gray-600">Isi form di bawah untuk menambahkan kuliner baru</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <KulinerForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </AdminLayout>
  );
} 