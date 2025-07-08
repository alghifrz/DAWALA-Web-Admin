import { TempatIbadah, TempatIbadahFormData, ApiResponse, PaginatedResponse } from '../types/admin';

const API_BASE_URL = '/api/admin/tempat-ibadah';

export async function getTempatIbadahList(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<TempatIbadah>> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tempat ibadah list');
  }

  return response.json();
}

export async function getTempatIbadahById(id: string): Promise<TempatIbadah> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tempat ibadah');
  }

  const result: ApiResponse<TempatIbadah> = await response.json();
  return result.data!;
}

export async function createTempatIbadah(data: TempatIbadahFormData): Promise<TempatIbadah> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create tempat ibadah');
  }

  const result: ApiResponse<TempatIbadah> = await response.json();
  return result.data!;
}

export async function updateTempatIbadah(id: string, data: Partial<TempatIbadahFormData>): Promise<TempatIbadah> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update tempat ibadah');
  }

  const result: ApiResponse<TempatIbadah> = await response.json();
  return result.data!;
}

export async function deleteTempatIbadah(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete tempat ibadah');
  }
} 