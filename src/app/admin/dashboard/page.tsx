import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Badge } from '@/components/admin/ui/Badge';

export default function DashboardPage() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Kuliner',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      color: 'bg-blue-500',
    },
    {
      title: 'Tempat Ibadah',
      value: '8',
      change: '+2',
      changeType: 'increase',
      color: 'bg-green-500',
    },
    {
      title: 'Homestay',
      value: '15',
      change: '+5',
      changeType: 'increase',
      color: 'bg-purple-500',
    },
    {
      title: 'Paket Wisata',
      value: '12',
      change: '+3',
      changeType: 'increase',
      color: 'bg-orange-500',
    },
    {
      title: 'Rantai Pasok',
      value: '18',
      change: '+8',
      changeType: 'increase',
      color: 'bg-emerald-500',
    },
    {
      title: 'Pemesanan',
      value: '156',
      change: '+23%',
      changeType: 'increase',
      color: 'bg-red-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'kuliner',
      action: 'ditambahkan',
      item: 'Warung Makan Sederhana',
      time: '2 jam yang lalu',
    },
    {
      id: 2,
      type: 'pemesanan',
      action: 'dikonfirmasi',
      item: 'Paket Wisata Alam',
      time: '4 jam yang lalu',
    },
    {
      id: 3,
      type: 'homestay',
      action: 'diupdate',
      item: 'Homestay Bunga',
      time: '6 jam yang lalu',
    },
    {
      id: 4,
      type: 'tempat_ibadah',
      action: 'ditambahkan',
      item: 'Masjid Al-Ikhlas',
      time: '1 hari yang lalu',
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'kuliner':
        return 'text-blue-600 bg-blue-100';
      case 'pemesanan':
        return 'text-green-600 bg-green-100';
      case 'homestay':
        return 'text-purple-600 bg-purple-100';
      case 'tempat_ibadah':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Selamat datang di Admin Panel Desa Wisata Alamendah
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <div className="h-6 w-6 text-white flex items-center justify-center">
                    {stat.title.charAt(0)}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge
                  variant={stat.changeType === 'increase' ? 'success' : 'error'}
                  size="sm"
                >
                  {stat.change}
                </Badge>
                <span className="ml-2 text-sm text-gray-500">
                  dari bulan lalu
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Aktivitas Terbaru
            </h2>
            <p className="text-sm text-gray-600">
              Aktivitas terbaru di sistem
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    <div className="h-4 w-4 flex items-center justify-center font-bold">
                      {activity.type.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="capitalize">{activity.type.replace('_', ' ')}</span>{' '}
                      <span className="font-normal">{activity.action}</span>
                    </p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Aksi Cepat
            </h3>
            <div className="space-y-3">
              <a
                href="/admin/kuliner/create"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="h-5 w-5 text-blue-600 mr-3 flex items-center justify-center font-bold">
                  K
                </div>
                <span className="text-sm font-medium">Tambah Kuliner</span>
              </a>
              <a
                href="/admin/paket-wisata/create"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="h-5 w-5 text-orange-600 mr-3 flex items-center justify-center font-bold">
                  P
                </div>
                <span className="text-sm font-medium">Tambah Paket Wisata</span>
              </a>
              <a
                href="/admin/homestay/create"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="h-5 w-5 text-purple-600 mr-3 flex items-center justify-center font-bold">
                  H
                </div>
                <span className="text-sm font-medium">Tambah Homestay</span>
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistik Pengunjung
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pengunjung Hari Ini</span>
                <span className="text-lg font-semibold text-gray-900">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pengunjung Minggu Ini</span>
                <span className="text-lg font-semibold text-gray-900">892</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pengunjung Bulan Ini</span>
                <span className="text-lg font-semibold text-gray-900">3,456</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 