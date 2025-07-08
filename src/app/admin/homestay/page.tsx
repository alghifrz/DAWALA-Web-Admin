import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function HomestayPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homestay Ramah Muslim</h1>
          <p className="text-gray-600">Kelola data homestay ramah muslim di Desa Wisata Alamendah</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500 text-center py-8">
            Implementasi tabel homestay akan ditambahkan di sini
          </p>
        </div>
      </div>
    </AdminLayout>
  );
} 