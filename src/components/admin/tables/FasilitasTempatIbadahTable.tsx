'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { FasilitasTempatIbadahModal } from '@/components/admin/ui/FasilitasTempatIbadahModal';
import { getFasilitasList, deleteFasilitas, updateFasilitas } from '@/lib/api/fasilitas-tempat-ibadah';
import { FasilitasTempatIbadah } from '@/lib/types/admin';

export function FasilitasTempatIbadahTable() {
  const [fasilitasList, setFasilitasList] = useState<FasilitasTempatIbadah[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFasilitas, setEditingFasilitas] = useState<FasilitasTempatIbadah | null>(null);
  const [editNama, setEditNama] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loadFasilitas = async () => {
    try {
      const data = await getFasilitasList();
      setFasilitasList(data);
    } catch (error) {
      console.error('Error loading fasilitas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFasilitas();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteFasilitas(id);
      alert('Fasilitas berhasil dihapus!');
      loadFasilitas();
    } catch (error) {
      console.error('Error deleting fasilitas:', error);
      alert(error instanceof Error ? error.message : 'Gagal menghapus fasilitas');
    }
  };

  const handleFasilitasSuccess = () => {
    loadFasilitas();
  };

  const handleEdit = (fasilitas: FasilitasTempatIbadah) => {
    setEditingFasilitas(fasilitas);
    setEditNama(fasilitas.nama);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editingFasilitas || !editNama.trim()) return;

    try {
      await updateFasilitas(editingFasilitas.id_fasilitas_tempat_ibadah, editNama.trim());
      alert('Fasilitas berhasil diupdate!');
      setIsEditing(false);
      setEditingFasilitas(null);
      setEditNama('');
      loadFasilitas();
    } catch (error) {
      console.error('Error updating fasilitas:', error);
      alert(error instanceof Error ? error.message : 'Gagal mengupdate fasilitas');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingFasilitas(null);
    setEditNama('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fasilitas Tempat Ibadah</h1>
          <p className="text-gray-600">Kelola fasilitas yang tersedia di tempat ibadah</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Tambah Fasilitas
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Fasilitas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Dibuat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fasilitasList.map((fasilitas) => (
              <tr key={fasilitas.id_fasilitas_tempat_ibadah} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing && editingFasilitas?.id_fasilitas_tempat_ibadah === fasilitas.id_fasilitas_tempat_ibadah ? (
                    <input
                      type="text"
                      value={editNama}
                      onChange={(e) => setEditNama(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">
                      {fasilitas.nama}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(fasilitas.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {isEditing && editingFasilitas?.id_fasilitas_tempat_ibadah === fasilitas.id_fasilitas_tempat_ibadah ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(fasilitas)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
                              handleDelete(fasilitas.id_fasilitas_tempat_ibadah);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {fasilitasList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Belum ada fasilitas yang ditambahkan
          </div>
        )}
      </div>

      <FasilitasTempatIbadahModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFasilitasSuccess}
      />
    </div>
  );
} 