import { TempatIbadah, TempatIbadahFormData } from '@/lib/types/admin';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export async function getTempatIbadahList(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  data: TempatIbadah[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);

  const response = await fetch(`/api/admin/tempat-ibadah?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tempat ibadah list');
  }

  const result: ApiResponse<TempatIbadah[]> = await response.json();
  return {
    data: result.data!,
    total: result.total!,
    page: result.page!,
    limit: result.limit!,
    totalPages: result.totalPages!,
  };
}

export async function getTempatIbadahById(id: string): Promise<TempatIbadah> {
  const response = await fetch(`/api/admin/tempat-ibadah/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tempat ibadah');
  }

  const result: ApiResponse<TempatIbadah> = await response.json();
  return result.data!;
}

export async function createTempatIbadah(data: TempatIbadahFormData): Promise<TempatIbadah> {
  const response = await fetch('/api/admin/tempat-ibadah', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create tempat ibadah');
  }

  const result: ApiResponse<TempatIbadah> = await response.json();
  return result.data!;
}

export async function updateTempatIbadah(id: string, data: TempatIbadahFormData): Promise<TempatIbadah> {
  const response = await fetch(`/api/admin/tempat-ibadah/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update tempat ibadah');
  }

  const result: ApiResponse<TempatIbadah> = await response.json();
  return result.data!;
}

export async function deleteTempatIbadah(id: string): Promise<void> {
  const response = await fetch(`/api/admin/tempat-ibadah/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete tempat ibadah');
  }
} 