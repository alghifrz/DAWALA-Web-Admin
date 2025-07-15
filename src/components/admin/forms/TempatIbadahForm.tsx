'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TempatIbadahFormData } from '@/lib/types/admin';
import { getFasilitasList, deleteFasilitas, updateFasilitas } from '@/lib/api/fasilitas-tempat-ibadah';
import { FasilitasTempatIbadah } from '@/lib/types/admin';

const tempatIbadahSchema = z.object({
  nama: z.string().min(1, 'Nama tempat ibadah harus diisi'),
  jam_buka: z.string().min(1, 'Jam buka harus diisi'),
  fasilitas: z.array(z.string()).min(1, 'Minimal satu fasilitas harus dipilih'),
  lokasi: z.string().min(1, 'Lokasi harus diisi'),
  url_lokasi: z.string().url('URL lokasi harus valid').optional().or(z.literal('')),
});

interface TempatIbadahFormProps {
  initialData?: Partial<TempatIbadahFormData>;
  onSubmit: (data: TempatIbadahFormData) => Promise<void>;
  loading?: boolean;
}

export function TempatIbadahForm({ initialData, onSubmit, loading = false }: TempatIbadahFormProps) {
  const [fasilitasOptions, setFasilitasOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [fasilitasList, setFasilitasList] = useState<FasilitasTempatIbadah[]>([]);
  const [editingFasilitas, setEditingFasilitas] = useState<FasilitasTempatIbadah | null>(null);
  const [editNama, setEditNama] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newFasilitasNama, setNewFasilitasNama] = useState('');

  const [selectedFasilitas, setSelectedFasilitas] = useState<string[]>(
    Array.isArray(initialData?.fasilitas) ? initialData.fasilitas : []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TempatIbadahFormData>({
    resolver: zodResolver(tempatIbadahSchema),
    defaultValues: initialData || {
      nama: '',
      jam_buka: '',
      fasilitas: [],
      lokasi: '',
      url_lokasi: '',
    } as TempatIbadahFormData,
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const fasilitasList = await getFasilitasList();
        setFasilitasList(fasilitasList);
        setFasilitasOptions(
          fasilitasList.map((fasilitas) => ({
            value: fasilitas.id_fasilitas_tempat_ibadah,
            label: fasilitas.nama,
          }))
        );
      } catch (error) {
        console.error('Error loading fasilitas options:', error);
        // Set default options if database is not available
        setFasilitasList([]);
        setFasilitasOptions([]);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Update form value when fasilitas change
  useEffect(() => {
    setValue('fasilitas', selectedFasilitas);
  }, [selectedFasilitas, setValue]);

  // Update form values when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setValue('nama', initialData.nama || '');
      setValue('jam_buka', initialData.jam_buka || '');
      setValue('lokasi', initialData.lokasi || '');
      setValue('url_lokasi', initialData.url_lokasi || '');
      
      // Set selected fasilitas if they exist
      if (initialData.fasilitas && Array.isArray(initialData.fasilitas)) {
        setSelectedFasilitas(initialData.fasilitas);
      }
    }
  }, [initialData, setValue]);

  const handleFasilitasSuccess = () => {
    // Reload fasilitas options after adding new one
    const loadOptions = async () => {
      try {
        const fasilitasList = await getFasilitasList();
        setFasilitasList(fasilitasList);
        setFasilitasOptions(
          fasilitasList.map((fasilitas) => ({
            value: fasilitas.id_fasilitas_tempat_ibadah,
            label: fasilitas.nama,
          }))
        );
      } catch (error) {
        console.error('Error reloading fasilitas options:', error);
      }
    };

    loadOptions();
  };

  const handleAddFasilitas = async () => {
    if (!newFasilitasNama.trim()) return;

    try {
      const response = await fetch('/api/admin/fasilitas-tempat-ibadah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama: newFasilitasNama.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create fasilitas');
      }

      alert('Fasilitas berhasil ditambahkan!');
      setNewFasilitasNama('');
      handleFasilitasSuccess();
    } catch (error) {
      console.error('Error creating fasilitas:', error);
      alert(error instanceof Error ? error.message : 'Gagal menambah fasilitas');
    }
  };

  const handleEditFasilitas = (fasilitas: FasilitasTempatIbadah) => {
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
      handleFasilitasSuccess();
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

  const handleDeleteFasilitas = async (id: string) => {
    try {
      await deleteFasilitas(id);
      alert('Fasilitas berhasil dihapus!');
      handleFasilitasSuccess();
    } catch (error) {
      console.error('Error deleting fasilitas:', error);
      alert(error instanceof Error ? error.message : 'Gagal menghapus fasilitas');
    }
  };

  const handleFasilitasChange = (fasilitasValue: string) => {
    setSelectedFasilitas(prev => {
      if (prev.includes(fasilitasValue)) {
        return prev.filter(f => f !== fasilitasValue);
      } else {
        return [...prev, fasilitasValue];
      }
    });
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data as TempatIbadahFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (isLoadingOptions) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Tempat Ibadah
          </label>
          <input
            {...register('nama')}
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nama tempat ibadah"
          />
          {errors.nama && (
            <p className="mt-1 text-sm text-red-600">{errors.nama.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jam Buka
          </label>
          <input
            {...register('jam_buka')}
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 24 Jam atau 05:00 - 22:00"
          />
          {errors.jam_buka && (
            <p className="mt-1 text-sm text-red-600">{errors.jam_buka.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi
          </label>
          <input
            {...register('lokasi')}
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan alamat lokasi tempat ibadah"
          />
          {errors.lokasi && (
            <p className="mt-1 text-sm text-red-600">{errors.lokasi.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Lokasi
          </label>
          <input
            {...register('url_lokasi')}
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan URL Google Maps (opsional)"
          />
          {errors.url_lokasi && (
            <p className="mt-1 text-sm text-red-600">{errors.url_lokasi.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Fasilitas yang Tersedia
        </label>
        
        {/* Tabel Fasilitas */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Daftar Fasilitas</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFasilitasNama}
                    onChange={(e) => setNewFasilitasNama(e.target.value)}
                    placeholder="Nama fasilitas baru"
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddFasilitas}
                    disabled={!newFasilitasNama.trim()}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
            
            {isLoadingOptions ? (
              <div className="p-4 text-center text-gray-500">
                Loading fasilitas...
              </div>
            ) : fasilitasList.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-2">Belum ada fasilitas yang ditambahkan</p>
                <p className="text-sm text-gray-400">
                  Tambahkan fasilitas pertama di atas untuk memulai
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Nama Fasilitas
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fasilitasList.map((fasilitas) => (
                      <tr key={fasilitas.id_fasilitas_tempat_ibadah} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          {isEditing && editingFasilitas?.id_fasilitas_tempat_ibadah === fasilitas.id_fasilitas_tempat_ibadah ? (
                            <input
                              type="text"
                              value={editNama}
                              onChange={(e) => setEditNama(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <span className="text-sm text-gray-900">{fasilitas.nama}</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            {isEditing && editingFasilitas?.id_fasilitas_tempat_ibadah === fasilitas.id_fasilitas_tempat_ibadah ? (
                              <>
                                <button
                                  type="button"
                                  onClick={handleSaveEdit}
                                  className="text-xs text-green-600 hover:text-green-900 font-medium"
                                >
                                  Simpan
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                                >
                                  Batal
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleEditFasilitas(fasilitas)}
                                  className="text-xs text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
                                      handleDeleteFasilitas(fasilitas.id_fasilitas_tempat_ibadah);
                                    }
                                  }}
                                  className="text-xs text-red-600 hover:text-red-900 font-medium"
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
              </div>
            )}
          </div>
        </div>

        {/* Form Fasilitas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {fasilitasOptions.map((fasilitas) => (
            <label key={fasilitas.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFasilitas.includes(fasilitas.value)}
                onChange={() => handleFasilitasChange(fasilitas.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{fasilitas.label}</span>
            </label>
          ))}
        </div>
        {errors.fasilitas && (
          <p className="mt-1 text-sm text-red-600">{errors.fasilitas.message}</p>
        )}
        {selectedFasilitas.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Fasilitas yang dipilih: {selectedFasilitas.length} item
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
} 