'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { KulinerForm } from '@/components/admin/forms/KulinerForm';
import { getKulinerById, updateKuliner } from '@/lib/api/kuliner';
import { KulinerFormData } from '@/lib/types/admin';

interface EditKulinerPageProps {
  params: {
    id: string;
  };
}

export default function EditKulinerPage({ params }: EditKulinerPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<KulinerFormData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadKuliner = async () => {
      try {
        const kuliner = await getKulinerById(params.id);
        setInitialData({
          nama: kuliner.nama,
          deskripsi: kuliner.deskripsi,
          status: kuliner.status,
          jam_buka: kuliner.jam_buka,
          foto: kuliner.foto,
          id_jenis: kuliner.id_jenis,
          id_alamat: kuliner.id_alamat,
        });
      } catch (error) {
        console.error('Error loading kuliner:', error);
        alert('Gagal memuat data kuliner');
        router.push('/admin/kuliner');
      } finally {
        setLoadingData(false);
      }
    };

    loadKuliner();
  }, [params.id, router]);

  const handleSubmit = async (data: KulinerFormData) => {
    try {
      setLoading(true);
      await updateKuliner(params.id, data);
      router.push('/admin/kuliner');
    } catch (error) {
      console.error('Error updating kuliner:', error);
      alert('Gagal mengupdate kuliner');
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
            <p className="mt-2 text-sm text-gray-600">Memuat data kuliner...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!initialData) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <p className="text-gray-600">Kuliner tidak ditemukan</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Kuliner</h1>
          <p className="text-gray-600">Edit informasi kuliner di bawah ini</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <KulinerForm 
            initialData={initialData}
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        </div>
      </div>
    </AdminLayout>
  );
} 