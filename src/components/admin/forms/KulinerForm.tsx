'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
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
        <Input
          label="Nama Kuliner"
          {...register('nama')}
          error={errors.nama?.message}
          placeholder="Masukkan nama kuliner"
        />

        <Select
          label="Status Halal"
          options={STATUS_KULINER}
          {...register('status')}
          error={errors.status?.message}
          placeholder="Pilih status halal"
        />

        <Input
          label="Jam Buka"
          {...register('jam_buka')}
          error={errors.jam_buka?.message}
          placeholder="Contoh: 08:00 - 22:00"
        />

        <Input
          label="URL Foto"
          {...register('foto')}
          error={errors.foto?.message}
          placeholder="https://example.com/foto.jpg"
          helperText="Masukkan URL gambar kuliner"
        />

        <Select
          label="Jenis Kuliner"
          options={jenisOptions}
          {...register('id_jenis')}
          error={errors.id_jenis?.message}
          placeholder="Pilih jenis kuliner"
        />

        <Select
          label="Lokasi"
          options={lokasiOptions}
          {...register('id_alamat')}
          error={errors.id_alamat?.message}
          placeholder="Pilih lokasi"
        />
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
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Batal
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Kuliner' : 'Tambah Kuliner'}
        </Button>
      </div>
    </form>
  );
} 