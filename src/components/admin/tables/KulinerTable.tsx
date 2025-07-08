'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Kuliner } from '@/lib/types/admin';
import { getKulinerList, deleteKuliner } from '@/lib/api/kuliner';
import { formatDate, truncateText, getStatusColor } from '@/lib/utils/helpers';
import { STATUS_KULINER, TABLE_PAGE_SIZES, DEFAULT_PAGE_SIZE } from '@/lib/utils/constants';

interface KulinerTableProps {
  onEdit?: (kuliner: Kuliner) => void;
  onDelete?: (id: string) => void;
}

export function KulinerTable({ onEdit, onDelete }: KulinerTableProps) {
  const [kulinerList, setKulinerList] = useState<Kuliner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadKulinerList = async () => {
    try {
      setLoading(true);
      const response = await getKulinerList({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });
      
      setKulinerList(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading kuliner list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKulinerList();
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kuliner ini?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteKuliner(id);
      await loadKulinerList();
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Error deleting kuliner:', error);
      alert('Gagal menghapus kuliner');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
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
          <h2 className="text-2xl font-bold text-gray-900">Kuliner Halal</h2>
          <p className="text-gray-600">Kelola data kuliner halal di Desa Wisata Alamendah</p>
        </div>
        <Link href="/admin/kuliner/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kuliner
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari kuliner..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="Filter status"
            options={[
              { value: '', label: 'Semua Status' },
              ...STATUS_KULINER
            ]}
            value={statusFilter}
            onChange={handleStatusFilter}
          />
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jam Buka
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
              {kulinerList.map((kuliner) => (
                <tr key={kuliner.id_kuliner} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {kuliner.nama}
                      </div>
                      <div className="text-sm text-gray-500">
                        {truncateText(kuliner.deskripsi, 50)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={kuliner.status === 'halal' ? 'success' : 'error'}
                    >
                      {kuliner.status === 'halal' ? 'Halal' : 'Haram'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {kuliner.jam_buka}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {kuliner.alamat?.nama || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(kuliner.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/kuliner/${kuliner.id_kuliner}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(kuliner.id_kuliner)}
                        loading={deletingId === kuliner.id_kuliner}
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
        {kulinerList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada data kuliner
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter
                ? 'Coba ubah filter pencarian Anda'
                : 'Mulai dengan menambahkan kuliner pertama'}
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