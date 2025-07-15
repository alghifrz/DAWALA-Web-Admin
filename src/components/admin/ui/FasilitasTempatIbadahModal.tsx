'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/Button';
import { createFasilitas } from '@/lib/api/fasilitas-tempat-ibadah';

interface FasilitasTempatIbadahModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FasilitasTempatIbadahModal({ isOpen, onClose, onSuccess }: FasilitasTempatIbadahModalProps) {
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nama.trim()) {
      alert('Nama fasilitas harus diisi');
      return;
    }

    setLoading(true);
    try {
      await createFasilitas(nama.trim());
      alert('Fasilitas berhasil ditambahkan!');
      setNama('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating fasilitas:', error);
      alert(error instanceof Error ? error.message : 'Gagal menambah fasilitas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Tambah Fasilitas Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Fasilitas
          </label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nama fasilitas"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={loading || !nama.trim()}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 