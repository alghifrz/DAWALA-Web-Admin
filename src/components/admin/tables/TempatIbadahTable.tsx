'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { TempatIbadah } from '@/lib/types/admin';
import { getTempatIbadahList, deleteTempatIbadah } from '@/lib/api/tempat-ibadah';
import { formatDate, truncateText } from '@/lib/utils/helpers';
import { TABLE_PAGE_SIZES, DEFAULT_PAGE_SIZE } from '@/lib/utils/constants';

interface TempatIbadahTableProps {
  onEdit?: (tempatIbadah: TempatIbadah) => void;
  onDelete?: (id: string) => void;
}

export function TempatIbadahTable({ onEdit, onDelete }: TempatIbadahTableProps) {
  const [tempatIbadahList, setTempatIbadahList] = useState<TempatIbadah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadTempatIbadahList = async () => {
    try {
      setLoading(true);
      const response = await getTempatIbadahList({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
      });
      
      setTempatIbadahList(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading tempat ibadah list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTempatIbadahList();
  }, [currentPage, pageSize, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tempat ibadah ini?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteTempatIbadah(id);
      await loadTempatIbadahList();
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Error deleting tempat ibadah:', error);
      alert('Gagal menghapus tempat ibadah');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tempat Ibadah</h2>
          <p className="text-gray-600">Kelola data tempat ibadah di Desa Wisata Alamendah</p>
        </div>
        <Link href="/admin/tempat-ibadah/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tempat Ibadah
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari tempat ibadah..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="Jumlah per halaman"
            options={TABLE_PAGE_SIZES.map(size => ({
              value: size.toString(),
              label: `${size} item`
            }))}
            value={pageSize.toString()}
            onChange={(value) => handlePageSizeChange(parseInt(value))}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jam Buka
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fasilitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
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
              {tempatIbadahList.map((tempatIbadah) => (
                <tr key={tempatIbadah.id_tempat_ibadah} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {tempatIbadah.nama}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tempatIbadah.jam_buka}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {tempatIbadah.fasilitas.slice(0, 3).map((fasilitas, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {fasilitas}
                        </span>
                      ))}
                      {tempatIbadah.fasilitas.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{tempatIbadah.fasilitas.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tempatIbadah.alamat?.nama || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(tempatIbadah.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/tempat-ibadah/${tempatIbadah.id_tempat_ibadah}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tempatIbadah.id_tempat_ibadah)}
                        loading={deletingId === tempatIbadah.id_tempat_ibadah}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {tempatIbadahList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada data tempat ibadah
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? 'Coba ubah filter pencarian Anda'
                : 'Mulai dengan menambahkan tempat ibadah pertama'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border rounded-lg">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Menampilkan {((currentPage - 1) * pageSize) + 1} sampai{' '}
              {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} item
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <span className="flex items-center px-3 text-sm text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 