'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { TempatIbadahFormData } from '@/lib/types/admin';
import { getLokasiList } from '@/lib/api/kuliner'; // Reuse lokasi API

const tempatIbadahSchema = z.object({
  nama: z.string().min(1, 'Nama tempat ibadah harus diisi'),
  jam_buka: z.string().min(1, 'Jam buka harus diisi'),
  fasilitas: z.array(z.string()).min(1, 'Minimal satu fasilitas harus dipilih'),
  id_alamat: z.string().min(1, 'Lokasi harus dipilih'),
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
  const [lokasiOptions, setLokasiOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
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
      id_alamat: '',
    },
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const lokasiList = await getLokasiList();
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
        <Input
          label="Nama Tempat Ibadah"
          {...register('nama')}
          error={errors.nama?.message}
          placeholder="Masukkan nama tempat ibadah"
        />

        <Input
          label="Jam Buka"
          {...register('jam_buka')}
          error={errors.jam_buka?.message}
          placeholder="Contoh: 24 Jam / 05:00 - 22:00"
        />

        <Select
          label="Lokasi"
          options={lokasiOptions}
          value={watch('id_alamat')}
          onChange={(value) => setValue('id_alamat', value)}
          error={errors.id_alamat?.message}
          placeholder="Pilih lokasi"
        />
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

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Batal
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Tempat Ibadah' : 'Tambah Tempat Ibadah'}
        </Button>
      </div>
    </form>
  );
} 