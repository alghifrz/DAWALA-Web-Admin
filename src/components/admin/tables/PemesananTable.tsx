import React from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { DeleteButton } from '@/components/DeleteButton';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils/helpers';

interface PemesananTableProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  };
}

export async function PemesananTable({ searchParams }: PemesananTableProps) {
  const page = parseInt(searchParams?.page || '1');
  const limit = parseInt(searchParams?.limit || '10');
  const search = searchParams?.search || '';
  const status = searchParams?.status || '';
  
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = {};
  if (search) {
    where.OR = [
      { paket_wisata: { nama_paket: { contains: search, mode: 'insensitive' } } },
      { catatan_opsional: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) {
    where.status_pemesanan = status;
  }

  // Get data from Prisma
  const [pemesananList, totalItems] = await Promise.all([
    prisma.pemesanan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        paket_wisata: true,
      },
    }).catch(() => []),
    prisma.pemesanan.count({ where }).catch(() => 0),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'pending':
        return 'Menunggu';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pemesanan</h2>
          <p className="text-gray-600">Kelola data pemesanan paket wisata di Desa Wisata Alamendah</p>
        </div>
        <Link href="/admin/pemesanan/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pemesanan
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              name="search"
              placeholder="Cari pemesanan..."
              defaultValue={search}
              className="pl-10"
            />
          </div>
          <select
            name="status"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            defaultValue={status}
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
          <select
            name="limit"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            defaultValue={limit.toString()}
          >
            <option value="10">10 item</option>
            <option value="25">25 item</option>
            <option value="50">50 item</option>
          </select>
          <Button type="submit" className="md:col-span-3">
            Filter
          </Button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paket Wisata
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Pemesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pemesananList.map((pemesanan) => (
                <tr key={pemesanan.id_pemesanan} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {pemesanan.paket_wisata?.nama_paket || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pemesanan.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(pemesanan.tanggal_pemesanan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(pemesanan.status_pemesanan)}>
                      {getStatusLabel(pemesanan.status_pemesanan)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate">
                      {pemesanan.catatan_opsional || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(pemesanan.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/pemesanan/${pemesanan.id_pemesanan}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteButton 
                        action={`/admin/api/pemesanan/${pemesanan.id_pemesanan}/delete`}
                        confirmMessage="Apakah Anda yakin ingin menghapus pemesanan ini?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {pemesananList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada data pemesanan
            </h3>
            <p className="text-gray-500">
              {search || status
                ? 'Coba ubah filter pencarian Anda'
                : 'Mulai dengan menambahkan pemesanan pertama'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border rounded-lg">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Menampilkan {((page - 1) * limit) + 1} sampai{' '}
              {Math.min(page * limit, totalItems)} dari {totalItems} item
            </span>
          </div>
          <div className="flex space-x-2">
            {page > 1 && (
              <Link href={`/admin/pemesanan?page=${page - 1}&limit=${limit}&search=${search}&status=${status}`}>
                <Button variant="outline" size="sm">
                  Sebelumnya
                </Button>
              </Link>
            )}
            <span className="flex items-center px-3 text-sm text-gray-700">
              Halaman {page} dari {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/admin/pemesanan?page=${page + 1}&limit=${limit}&search=${search}&status=${status}`}>
                <Button variant="outline" size="sm">
                  Selanjutnya
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 