import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function PemesananPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pemesanan Paket Wisata</h1>
          <p className="text-gray-600">Kelola semua pemesanan paket wisata oleh pengunjung</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500 text-center py-8">
            Implementasi tabel pemesanan akan ditambahkan di sini
          </p>
        </div>
      </div>
    </AdminLayout>
  );
} 