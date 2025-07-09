import React from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { DeleteButton } from '@/components/DeleteButton';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils/helpers';

interface PaketWisataTableProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

export async function PaketWisataTable({ searchParams }: PaketWisataTableProps) {
  const page = parseInt(searchParams?.page || '1');
  const limit = parseInt(searchParams?.limit || '10');
  const search = searchParams?.search || '';
  
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = {};
  if (search) {
    where.OR = [
      { nama_paket: { contains: search, mode: 'insensitive' } },
      { deskripsi: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get data from Prisma
  const [paketWisataList, totalItems] = await Promise.all([
    prisma.paket_Wisata.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }).catch(() => []),
    prisma.paket_Wisata.count({ where }).catch(() => 0),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paket Wisata</h2>
          <p className="text-gray-600">Kelola data paket wisata di Desa Wisata Alamendah</p>
        </div>
        <Link href="/admin/paket-wisata/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Paket Wisata
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              name="search"
              placeholder="Cari paket wisata..."
              defaultValue={search}
              className="pl-10"
            />
          </div>
          <select
            name="limit"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            defaultValue={limit.toString()}
          >
            <option value="10">10 item</option>
            <option value="25">25 item</option>
            <option value="50">50 item</option>
          </select>
          <Button type="submit" className="md:col-span-2">
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
                  Nama Paket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fasilitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poin Edukasi
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
              {paketWisataList.map((paketWisata) => (
                <tr key={paketWisata.id_paket_wisata} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {paketWisata.nama_paket}
                      </div>
                      <div className="text-sm text-gray-500">
                        {paketWisata.deskripsi?.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {paketWisata.durasi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {paketWisata.harga?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {(paketWisata.fasilitas as string[] || []).slice(0, 3).map((fasilitas, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {fasilitas}
                        </span>
                      ))}
                      {(paketWisata.fasilitas as string[] || []).length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{(paketWisata.fasilitas as string[] || []).length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {(paketWisata.poin_edukasi as string[] || []).slice(0, 3).map((poin, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {poin}
                        </span>
                      ))}
                      {(paketWisata.poin_edukasi as string[] || []).length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{(paketWisata.poin_edukasi as string[] || []).length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(paketWisata.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/paket-wisata/${paketWisata.id_paket_wisata}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteButton 
                        action={`/admin/api/paket-wisata/${paketWisata.id_paket_wisata}/delete`}
                        confirmMessage="Apakah Anda yakin ingin menghapus paket wisata ini?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {paketWisataList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada data paket wisata
            </h3>
            <p className="text-gray-500">
              {search
                ? 'Coba ubah filter pencarian Anda'
                : 'Mulai dengan menambahkan paket wisata pertama'}
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
              <Link href={`/admin/paket-wisata?page=${page - 1}&limit=${limit}&search=${search}`}>
                <Button variant="outline" size="sm">
                  Sebelumnya
                </Button>
              </Link>
            )}
            <span className="flex items-center px-3 text-sm text-gray-700">
              Halaman {page} dari {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/admin/paket-wisata?page=${page + 1}&limit=${limit}&search=${search}`}>
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