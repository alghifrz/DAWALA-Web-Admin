import { FasilitasTempatIbadah } from '@/lib/types/admin';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function getFasilitasList(): Promise<FasilitasTempatIbadah[]> {
  const response = await fetch('/api/admin/fasilitas-tempat-ibadah');
  
  if (!response.ok) {
    throw new Error('Failed to fetch fasilitas list');
  }

  const result: ApiResponse<FasilitasTempatIbadah[]> = await response.json();
  return result.data!;
}

export async function createFasilitas(nama: string): Promise<FasilitasTempatIbadah> {
  const response = await fetch('/api/admin/fasilitas-tempat-ibadah', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nama }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create fasilitas');
  }

  const result: ApiResponse<FasilitasTempatIbadah> = await response.json();
  return result.data!;
}

export async function updateFasilitas(id: string, nama: string): Promise<FasilitasTempatIbadah> {
  const response = await fetch(`/api/admin/fasilitas-tempat-ibadah/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nama }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update fasilitas');
  }

  const result: ApiResponse<FasilitasTempatIbadah> = await response.json();
  return result.data!;
}

export async function deleteFasilitas(id: string): Promise<void> {
  const response = await fetch(`/api/admin/fasilitas-tempat-ibadah/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete fasilitas');
  }
} 