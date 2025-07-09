import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Badge } from '@/components/Badge';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  // Ambil jumlah data dari database
  const [totalKuliner, totalTempatIbadah, totalHomestay, totalPaketWisata, totalRantaiPasok, totalPemesanan] = await Promise.all([
    prisma.kuliner.count().catch(() => 0),
    prisma.tempat_Ibadah.count().catch(() => 0),
    prisma.homestay.count().catch(() => 0),
    prisma.paket_Wisata.count().catch(() => 0),
    prisma.rantai_Pasok_Hijau.count().catch(() => 0),
    prisma.pemesanan.count().catch(() => 0),
  ]);

  const stats = [
    {
      title: 'Total Kuliner',
      value: totalKuliner,
      change: '+12%',
      changeType: 'increase',
      color: 'bg-blue-500',
      icon: 'K',
    },
    {
      title: 'Tempat Ibadah',
      value: totalTempatIbadah,
      change: '+2',
      changeType: 'increase',
      color: 'bg-green-500',
      icon: 'T',
    },
    {
      title: 'Homestay',
      value: totalHomestay,
      change: '+5',
      changeType: 'increase',
      color: 'bg-purple-500',
      icon: 'H',
    },
    {
      title: 'Paket Wisata',
      value: totalPaketWisata,
      change: '+3',
      changeType: 'increase',
      color: 'bg-orange-500',
      icon: 'P',
    },
    {
      title: 'Rantai Pasok',
      value: totalRantaiPasok,
      change: '+8',
      changeType: 'increase',
      color: 'bg-emerald-500',
      icon: 'R',
    },
    {
      title: 'Pemesanan',
      value: totalPemesanan,
      change: '+23%',
      changeType: 'increase',
      color: 'bg-red-500',
      icon: 'S',
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600 text-base">Selamat datang di Admin Panel Desa Wisata Alamendah</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <span className="h-6 w-6 text-white flex items-center justify-center font-bold text-lg">
                    {stat.icon}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <Badge
                  variant={stat.changeType === 'increase' ? 'success' : 'error'}
                  size="sm"
                >
                  {stat.change}
                </Badge>
                <span className="ml-2 text-sm text-gray-500">dari bulan lalu</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Aktivitas Terbaru</h2>
            <p className="text-sm text-gray-600">Aktivitas terbaru di sistem</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    <span className="h-4 w-4 flex items-center justify-center font-bold">
                      {activity.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="capitalize">{activity.type.replace('_', ' ')}</span>{' '}
                      <span className="font-normal">{activity.action}</span>
                    </p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <a
                href="/admin/kuliner/create"
                className="flex items-center p-3 rounded-lg border hover:bg-blue-50 transition-colors group"
              >
                <span className="h-5 w-5 text-blue-600 mr-3 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">K</span>
                <span className="text-sm font-medium">Tambah Kuliner</span>
              </a>
              <a
                href="/admin/paket-wisata/create"
                className="flex items-center p-3 rounded-lg border hover:bg-orange-50 transition-colors group"
              >
                <span className="h-5 w-5 text-orange-600 mr-3 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">P</span>
                <span className="text-sm font-medium">Tambah Paket Wisata</span>
              </a>
              <a
                href="/admin/homestay/create"
                className="flex items-center p-3 rounded-lg border hover:bg-purple-50 transition-colors group"
              >
                <span className="h-5 w-5 text-purple-600 mr-3 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">H</span>
                <span className="text-sm font-medium">Tambah Homestay</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 