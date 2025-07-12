'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { KulinerForm } from '@/components/admin/forms/KulinerForm';
import { KulinerFormData } from '@/lib/types/admin';

export default function KulinerEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<KulinerFormData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchKuliner = async () => {
      try {
        const response = await fetch(`/api/admin/kuliner/${params.id}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data kuliner');
        }
        const result = await response.json();
        if (result.success) {
          setInitialData(result.data);
        } else {
          alert(result.error || 'Gagal mengambil data kuliner');
          router.push('/admin/kuliner');
        }
      } catch (error) {
        console.error('Error fetching kuliner:', error);
        alert('Gagal mengambil data kuliner');
        router.push('/admin/kuliner');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (params.id) {
      fetchKuliner();
    }
  }, [params.id, router]);

  const handleSubmit = async (data: KulinerFormData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/kuliner/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengupdate kuliner');
      }

      const result = await response.json();
      
      if (result.success) {
        alert(result.message || 'Kuliner berhasil diupdate!');
        router.push('/admin/kuliner');
      } else {
        alert(result.error || 'Gagal mengupdate kuliner');
      }
    } catch (error) {
      console.error('Error updating kuliner:', error);
      alert(error instanceof Error ? error.message : 'Gagal mengupdate kuliner');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!initialData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Data kuliner tidak ditemukan</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Kuliner</h1>
        <p className="text-gray-600">Edit informasi kuliner di bawah ini</p>
      </div>
      <KulinerForm onSubmit={handleSubmit} initialData={initialData} loading={loading} />
    </AdminLayout>
  );
} 