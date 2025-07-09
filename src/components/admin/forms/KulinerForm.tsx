'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KulinerFormData } from '@/lib/types/admin';
import { STATUS_KULINER } from '@/lib/utils/constants';
import { getJenisList, getLokasiList } from '@/lib/api/kuliner';

const kulinerSchema = z.object({
  nama: z.string().min(1, 'Nama kuliner harus diisi'),
  deskripsi: z.string().min(1, 'Deskripsi harus diisi'),
  status: z.enum(['halal', 'haram']),
  jam_buka: z.string().min(1, 'Jam buka harus diisi'),
  foto: z.string().min(1, 'URL foto harus diisi'),
  id_jenis: z.string().min(1, 'Jenis kuliner harus dipilih'),
  id_alamat: z.string().min(1, 'Lokasi harus dipilih'),
});

interface KulinerFormProps {
  initialData?: Partial<KulinerFormData>;
  onSubmit: (data: KulinerFormData) => Promise<void>;
  loading?: boolean;
}

export function KulinerForm({ initialData, onSubmit, loading = false }: KulinerFormProps) {
  const [jenisOptions, setJenisOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [lokasiOptions, setLokasiOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<KulinerFormData>({
    resolver: zodResolver(kulinerSchema),
    defaultValues: initialData || {
      nama: '',
      deskripsi: '',
      status: 'halal',
      jam_buka: '',
      foto: '',
      id_jenis: '',
      id_alamat: '',
    },
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [jenisList, lokasiList] = await Promise.all([
          getJenisList(),
          getLokasiList(),
        ]);

        setJenisOptions(
          jenisList.map((jenis) => ({
            value: jenis.id_jenis,
            label: jenis.nama,
          }))
        );

        setLokasiOptions(
          lokasiList.map((lokasi) => ({
            value: lokasi.id_lokasi,
            label: lokasi.nama,
          }))
        );
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const handleFormSubmit = async (data: KulinerFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (isLoadingOptions) {
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Kuliner
          </label>
          <input
            type="text"
            {...register('nama')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nama kuliner"
          />
          {errors.nama && (
            <p className="mt-1 text-sm text-red-600">{errors.nama.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status Halal
          </label>
          <select
            {...register('status')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih status halal</option>
            {STATUS_KULINER.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jam Buka
          </label>
          <input
            type="text"
            {...register('jam_buka')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 08:00 - 22:00"
          />
          {errors.jam_buka && (
            <p className="mt-1 text-sm text-red-600">{errors.jam_buka.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Foto
          </label>
          <input
            type="url"
            {...register('foto')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/foto.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">Masukkan URL gambar kuliner</p>
          {errors.foto && (
            <p className="mt-1 text-sm text-red-600">{errors.foto.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Kuliner
          </label>
          <select
            {...register('id_jenis')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih jenis kuliner</option>
            {jenisOptions.map((jenis) => (
              <option key={jenis.value} value={jenis.value}>
                {jenis.label}
              </option>
            ))}
          </select>
          {errors.id_jenis && (
            <p className="mt-1 text-sm text-red-600">{errors.id_jenis.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi
          </label>
          <select
            {...register('id_alamat')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih lokasi</option>
            {lokasiOptions.map((lokasi) => (
              <option key={lokasi.value} value={lokasi.value}>
                {lokasi.label}
              </option>
            ))}
          </select>
          {errors.id_alamat && (
            <p className="mt-1 text-sm text-red-600">{errors.id_alamat.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          {...register('deskripsi')}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Masukkan deskripsi kuliner..."
        />
        {errors.deskripsi && (
          <p className="mt-1 text-sm text-red-600">{errors.deskripsi.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </div>
          ) : (
            initialData ? 'Update Kuliner' : 'Tambah Kuliner'
          )}
        </button>
      </div>
    </form>
  );
} 