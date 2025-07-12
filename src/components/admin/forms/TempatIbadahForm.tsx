'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TempatIbadahFormData } from '@/lib/types/admin';

const tempatIbadahSchema = z.object({
  nama: z.string().min(1, 'Nama tempat ibadah harus diisi'),
  jam_buka: z.string().min(1, 'Jam buka harus diisi'),
  fasilitas: z.array(z.string()).min(1, 'Minimal satu fasilitas harus dipilih'),
  lokasi: z.string().min(1, 'Lokasi harus diisi'),
});

interface TempatIbadahFormProps {
  initialData?: Partial<TempatIbadahFormData>;
  onSubmit: (data: TempatIbadahFormData) => Promise<void>;
  loading?: boolean;
}

const FASILITAS_OPTIONS = [
  { value: 'musholla', label: 'Musholla' },
  { value: 'tempat_wudhu', label: 'Tempat Wudhu' },
  { value: 'parkir', label: 'Parkir' },
  { value: 'toilet', label: 'Toilet' },
  { value: 'ac', label: 'AC' },
  { value: 'kipas_angin', label: 'Kipas Angin' },
  { value: 'sound_system', label: 'Sound System' },
  { value: 'perpustakaan', label: 'Perpustakaan' },
];

export function TempatIbadahForm({ initialData, onSubmit, loading = false }: TempatIbadahFormProps) {
  const [selectedFasilitas, setSelectedFasilitas] = useState<string[]>(initialData?.fasilitas || []);

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
    },
  });

  const handleFasilitasChange = (fasilitas: string) => {
    const newFasilitas = selectedFasilitas.includes(fasilitas)
      ? selectedFasilitas.filter(f => f !== fasilitas)
      : [...selectedFasilitas, fasilitas];
    
    setSelectedFasilitas(newFasilitas);
    setValue('fasilitas', newFasilitas);
  };

  const handleFormSubmit = async (data: TempatIbadahFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

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
            placeholder="Contoh: 24 Jam"
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
            placeholder="Masukkan alamat lokasi"
          />
          {errors.lokasi && (
            <p className="mt-1 text-sm text-red-600">{errors.lokasi.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Fasilitas
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FASILITAS_OPTIONS.map((fasilitas) => (
            <label
              key={fasilitas.value}
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
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