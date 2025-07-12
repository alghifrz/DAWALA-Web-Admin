'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { JenisKulinerModal } from './JenisKulinerModal';

export function KulinerPageClient() {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div className="mb-4 flex justify-end gap-2">
      <Link href="/admin/kuliner/create">
        <Button>
          Tambah Kuliner
        </Button>
      </Link>
      <Button variant="outline" onClick={() => setModalOpen(true)}>
        Tambah Jenis Kuliner
      </Button>
      <JenisKulinerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
} 