import { Kuliner, Jenis, KulinerFormData } from '@/lib/types/admin';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export async function getKulinerList(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{
  data: Kuliner[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.status) searchParams.append('status', params.status);

  const response = await fetch(`/api/admin/kuliner?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch kuliner list');
  }

  const result: ApiResponse<Kuliner[]> = await response.json();
  return {
    data: result.data!,
    total: result.total!,
    page: result.page!,
    limit: result.limit!,
    totalPages: result.totalPages!,
  };
}

export async function getKulinerById(id: string): Promise<Kuliner> {
  const response = await fetch(`/api/admin/kuliner/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch kuliner');
  }

  const result: ApiResponse<Kuliner> = await response.json();
  return result.data!;
}

export async function createKuliner(data: KulinerFormData): Promise<Kuliner> {
  const response = await fetch('/api/admin/kuliner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create kuliner');
  }

  const result: ApiResponse<Kuliner> = await response.json();
  return result.data!;
}

export async function updateKuliner(id: string, data: KulinerFormData): Promise<Kuliner> {
  const response = await fetch(`/api/admin/kuliner/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update kuliner');
  }

  const result: ApiResponse<Kuliner> = await response.json();
  return result.data!;
}

export async function deleteKuliner(id: string): Promise<void> {
  const response = await fetch(`/api/admin/kuliner/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete kuliner');
  }
}

export async function getJenisList(): Promise<Jenis[]> {
  const response = await fetch('/api/admin/jenis');
  
  if (!response.ok) {
    throw new Error('Failed to fetch jenis list');
  }

  const result: ApiResponse<Jenis[]> = await response.json();
  return result.data!;
} 