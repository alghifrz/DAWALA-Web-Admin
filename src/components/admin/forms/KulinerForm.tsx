'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KulinerFormData } from '@/lib/types/admin';
import { getJenisList } from '@/lib/api/kuliner';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const kulinerSchema = z.object({
  nama: z.string().min(1, 'Nama kuliner harus diisi'),
  deskripsi: z.string().min(1, 'Deskripsi harus diisi'),
  status: z.enum(['halal', 'haram']),
  jam_buka: z.string().min(1, 'Jam buka harus diisi'),
  foto: z.array(z.string()).min(1, 'Minimal satu foto harus diupload'),
  lokasi: z.string().min(1, 'Lokasi harus diisi'),
  google_maps_url: z.string().url('URL Google Maps harus valid').optional().or(z.literal('')),
  id_jenis: z.string().min(1, 'Jenis kuliner harus dipilih'),
});

interface KulinerFormProps {
  initialData?: Partial<KulinerFormData>;
  onSubmit: (data: KulinerFormData) => Promise<void>;
  loading?: boolean;
}

export function KulinerForm({ initialData, onSubmit, loading = false }: KulinerFormProps) {
  const [jenisOptions, setJenisOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    Array.isArray(initialData?.foto) ? initialData.foto : initialData?.foto ? [initialData.foto] : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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
      foto: [],
      lokasi: '',
      google_maps_url: '',
      id_jenis: '',
    } as KulinerFormData,
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const jenisList = await getJenisList();
        setJenisOptions(
          jenisList.map((jenis) => ({
            value: jenis.id_jenis,
            label: jenis.nama,
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

  // Update form value when images change
  useEffect(() => {
    setValue('foto', uploadedImages);
  }, [uploadedImages, setValue]);

  // Update form values when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setValue('nama', initialData.nama || '');
      setValue('deskripsi', initialData.deskripsi || '');
      setValue('status', initialData.status || 'halal');
      setValue('jam_buka', initialData.jam_buka || '');
      setValue('lokasi', initialData.lokasi || '');
      setValue('google_maps_url', initialData.google_maps_url || '');
      setValue('id_jenis', initialData.id_jenis || '');
      
      // Set uploaded images if they exist
      if (initialData.foto && Array.isArray(initialData.foto)) {
        setUploadedImages(initialData.foto);
      }
    }
  }, [initialData, setValue]);

  const handleImageUpload = async (files: FileList) => {
    if (uploadedImages.length + files.length > 5) {
      alert('Maksimal 5 gambar yang dapat diupload');
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('File harus berupa gambar');
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Ukuran file maksimal 5MB');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `kuliner/${fileName}`;

        const { data, error } = await supabase.storage
          .from('images') // Nama bucket yang benar
          .upload(filePath, file);

        if (error) {
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images') // Nama bucket yang benar
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Gagal mengupload gambar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  }, []);

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data as KulinerFormData);
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
            Nama Kuliner
          </label>
          <input
            {...register('nama')}
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nama kuliner"
          />
          {errors.nama && (
            <p className="mt-1 text-sm text-red-600">{errors.nama.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="halal">Halal</option>
            <option value="haram">Haram</option>
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
            {...register('jam_buka')}
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 08:00 - 22:00"
          />
          {errors.jam_buka && (
            <p className="mt-1 text-sm text-red-600">{errors.jam_buka.message}</p>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Maps URL
          </label>
          <input
            {...register('google_maps_url')}
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan URL Google Maps (opsional)"
          />
          {errors.google_maps_url && (
            <p className="mt-1 text-sm text-red-600">{errors.google_maps_url.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto Kuliner
        </label>
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                isUploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isUploading ? 'Mengupload...' : 'Pilih Gambar'}
            </label>
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop gambar atau klik untuk memilih (maksimal 5 gambar, max 5MB per gambar)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Format yang didukung: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Kuliner ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.foto && (
          <p className="mt-1 text-sm text-red-600">{errors.foto.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          {...register('deskripsi')}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Masukkan deskripsi kuliner"
        />
        {errors.deskripsi && (
          <p className="mt-1 text-sm text-red-600">{errors.deskripsi.message}</p>
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
          disabled={loading || isUploading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
} 