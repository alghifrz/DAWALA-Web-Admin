'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { TempatIbadahForm } from '@/components/admin/forms/TempatIbadahForm';
import { getTempatIbadahById, updateTempatIbadah } from '@/lib/api/tempat-ibadah';
import { TempatIbadahFormData } from '@/lib/types/admin';

interface EditTempatIbadahPageProps {
  params: {
    id: string;
  };
}

export default function EditTempatIbadahPage({ params }: EditTempatIbadahPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<TempatIbadahFormData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadTempatIbadah = async () => {
      try {
        const tempatIbadah = await getTempatIbadahById(params.id);
        setInitialData({
          nama: tempatIbadah.nama,
          jam_buka: tempatIbadah.jam_buka,
          fasilitas: tempatIbadah.fasilitas,
          id_alamat: tempatIbadah.id_alamat,
        });
      } catch (error) {
        console.error('Error loading tempat ibadah:', error);
        alert('Gagal memuat data tempat ibadah');
        router.push('/admin/tempat-ibadah');
      } finally {
        setLoadingData(false);
      }
    };

    loadTempatIbadah();
  }, [params.id, router]);

  const handleSubmit = async (data: TempatIbadahFormData) => {
    try {
      setLoading(true);
      await updateTempatIbadah(params.id, data);
      router.push('/admin/tempat-ibadah');
    } catch (error) {
      console.error('Error updating tempat ibadah:', error);
      alert('Gagal mengupdate tempat ibadah');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Memuat data tempat ibadah...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!initialData) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <p className="text-gray-600">Tempat ibadah tidak ditemukan</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Tempat Ibadah</h1>
          <p className="text-gray-600">Edit informasi tempat ibadah di bawah ini</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <TempatIbadahForm 
            initialData={initialData}
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        </div>
      </div>
    </AdminLayout>
  );
} 