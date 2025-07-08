import { Kuliner, KulinerFormData, ApiResponse, PaginatedResponse } from '../types/admin';

const API_BASE_URL = '/api/admin/kuliner';

export async function getKulinerList(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<Kuliner>> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.status) searchParams.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch kuliner list');
  }

  return response.json();
}

export async function getKulinerById(id: string): Promise<Kuliner> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch kuliner');
  }

  const result: ApiResponse<Kuliner> = await response.json();
  return result.data!;
}

export async function createKuliner(data: KulinerFormData): Promise<Kuliner> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create kuliner');
  }

  const result: ApiResponse<Kuliner> = await response.json();
  return result.data!;
}

export async function updateKuliner(id: string, data: Partial<KulinerFormData>): Promise<Kuliner> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update kuliner');
  }

  const result: ApiResponse<Kuliner> = await response.json();
  return result.data!;
}

export async function deleteKuliner(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete kuliner');
  }
}

export async function getJenisList(): Promise<Array<{ id_jenis: string; nama: string }>> {
  const response = await fetch('/api/admin/jenis');
  
  if (!response.ok) {
    throw new Error('Failed to fetch jenis list');
  }

  const result: ApiResponse<Array<{ id_jenis: string; nama: string }>> = await response.json();
  return result.data!;
}

export async function getLokasiList(): Promise<Array<{ id_lokasi: string; nama: string }>> {
  const response = await fetch('/api/admin/lokasi');
  
  if (!response.ok) {
    throw new Error('Failed to fetch lokasi list');
  }

  const result: ApiResponse<Array<{ id_lokasi: string; nama: string }>> = await response.json();
  return result.data!;
} 