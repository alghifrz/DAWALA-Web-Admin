import React from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { DeleteButton } from '@/components/DeleteButton';
import { createPrismaClient, withRetry } from '@/lib/prisma';
import { formatDate, truncateText } from '@/lib/utils/helpers';

interface KulinerTableProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  };
}

export async function KulinerTable({ searchParams }: KulinerTableProps) {
  const page = parseInt(searchParams?.page || '1');
  const limit = parseInt(searchParams?.limit || '10');
  const search = searchParams?.search || '';
  const status = searchParams?.status || '';
  
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = {};
  if (search) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
      { deskripsi: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) {
    where.status = status;
  }

  // Get data from Prisma
  const prisma = createPrismaClient();
  const [kulinerList, totalItems] = await Promise.all([
    withRetry(() => prisma.kuliner.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        jenis: true,
      },
    })).catch((error) => {
      console.error('Error fetching kuliner list:', error);
      return [];
    }),
    withRetry(() => prisma.kuliner.count({ where })).catch((error) => {
      console.error('Error counting kuliner:', error);
      return 0;
    }),
  ]);

  // Disconnect the client
  await prisma.$disconnect();

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lokasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jam Buka
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {kulinerList.map((kuliner) => (
            <tr key={kuliner.id_kuliner} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    {kuliner.foto && kuliner.foto.length > 0 ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={kuliner.foto[0]}
                        alt={kuliner.nama}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No img</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {kuliner.nama}
                    </div>
                    <div className="text-sm text-gray-500">
                      {kuliner.deskripsi.substring(0, 50)}...
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {kuliner.jenis?.nama || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={kuliner.status === 'halal' ? 'success' : 'error'}
                >
                  {kuliner.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {kuliner.lokasi}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {kuliner.jam_buka}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link href={`/admin/kuliner/${kuliner.id_kuliner}`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <DeleteButton
                    action={`/api/admin/kuliner/${kuliner.id_kuliner}/delete`}
                    confirmMessage="Apakah Anda yakin ingin menghapus kuliner ini?"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Link
              href={`/admin/kuliner?page=${page - 1}&limit=${limit}&search=${search}&status=${status}`}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </Link>
            <Link
              href={`/admin/kuliner?page=${page + 1}&limit=${limit}&search=${search}&status=${status}`}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page >= totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </Link>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{skip + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(skip + limit, totalItems)}
                </span>{' '}
                of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/admin/kuliner?page=${pageNum}&limit=${limit}&search=${search}&status=${status}`}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}