export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  created_at: string;
}

export interface Kuliner {
  id_kuliner: string;
  nama: string;
  deskripsi: string;
  status: 'halal' | 'haram';
  jam_buka: string;
  foto: string;
  id_jenis: string;
  id_alamat: string;
  created_at: string;
  updated_at: string;
  alamat?: Lokasi;
  jenis?: Jenis;
}

export interface TempatIbadah {
  id_tempat_ibadah: string;
  nama: string;
  jam_buka: string;
  fasilitas: string[];
  id_alamat: string;
  created_at: string;
  updated_at: string;
  alamat?: Lokasi;
}

export interface Homestay {
  id_homestay: string;
  nama: string;
  deskripsi: string;
  harga: number;
  kontak: string;
  foto: string;
  id_alamat: string;
  created_at: string;
  updated_at: string;
  alamat?: Lokasi;
  fasilitas_homestay?: FasilitasHomestay[];
}

export interface PaketWisata {
  id_paket_wisata: string;
  nama_paket: string;
  deskripsi: string;
  durasi: string;
  harga: number;
  fasilitas: string[];
  poin_edukasi: string[];
  foto: string;
  created_at: string;
  updated_at: string;
}

export interface RantaiPasokHijau {
  id_rantai_pasok_hijau: string;
  konten: string;
  id_paket_wisata: string;
  created_at: string;
  updated_at: string;
  paket_wisata?: PaketWisata;
}

export interface Pemesanan {
  id_pemesanan: string;
  id_paket_wisata: string;
  user_id: string;
  tanggal_pemesanan: string;
  status_pemesanan: 'pending' | 'confirmed' | 'cancelled';
  catatan_opsional?: string;
  created_at: string;
  updated_at: string;
  paket_wisata?: PaketWisata;
}

export interface Lokasi {
  id_lokasi: string;
  nama: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface Jenis {
  id_jenis: string;
  nama: string;
  created_at: string;
  updated_at: string;
}

export interface FasilitasMuslim {
  id_fasilitas_muslim: string;
  nama: string;
  created_at: string;
  updated_at: string;
}

export interface FasilitasHomestay {
  id_fasilitas_homestay: string;
  id_homestay: string;
  id_fasilitas_muslim: string;
  created_at: string;
  fasilitas_muslim?: FasilitasMuslim;
}

// Form types
export interface KulinerFormData {
  nama: string;
  deskripsi: string;
  status: 'halal' | 'haram';
  jam_buka: string;
  foto: string;
  id_jenis: string;
  id_alamat: string;
}

export interface TempatIbadahFormData {
  nama: string;
  jam_buka: string;
  fasilitas: string[];
  id_alamat: string;
}

export interface HomestayFormData {
  nama: string;
  deskripsi: string;
  harga: number;
  kontak: string;
  foto: string;
  id_alamat: string;
  fasilitas_muslim_ids: string[];
}

export interface PaketWisataFormData {
  nama_paket: string;
  deskripsi: string;
  durasi: string;
  harga: number;
  fasilitas: string[];
  poin_edukasi: string[];
  foto: string;
}

export interface RantaiPasokFormData {
  konten: string;
  id_paket_wisata: string;
}

export interface PemesananUpdateData {
  status_pemesanan: 'pending' | 'confirmed' | 'cancelled';
  catatan_opsional?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 