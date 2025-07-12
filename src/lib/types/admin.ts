export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  created_at: string;
}

export interface Jenis {
  id_jenis: string;
  nama: string;
  created_at: string;
  updated_at: string;
}

export interface Kuliner {
  id_kuliner: string;
  nama: string;
  deskripsi: string;
  status: 'halal' | 'haram';
  jam_buka: string;
  foto: string[];
  lokasi: string;
  google_maps_url?: string;
  id_jenis: string;
  created_at: string;
  updated_at: string;
  jenis?: Jenis;
}

export interface TempatIbadah {
  id_tempat_ibadah: string;
  nama: string;
  jam_buka: string;
  fasilitas: string[];
  lokasi: string;
  created_at: string;
  updated_at: string;
}

export interface Homestay {
  id_homestay: string;
  nama: string;
  deskripsi: string;
  harga: number;
  kontak: string;
  foto: string;
  lokasi: string;
  created_at: string;
  updated_at: string;
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
  homestay?: Homestay;
}

// Form data interfaces
export interface KulinerFormData {
  nama: string;
  deskripsi: string;
  status: 'halal' | 'haram';
  jam_buka: string;
  foto: string[];
  lokasi: string;
  google_maps_url?: string;
  id_jenis: string;
}

export interface TempatIbadahFormData {
  nama: string;
  jam_buka: string;
  fasilitas: string[];
  lokasi: string;
}

export interface HomestayFormData {
  nama: string;
  deskripsi: string;
  harga: number;
  kontak: string;
  foto: string;
  lokasi: string;
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

export interface RantaiPasokHijauFormData {
  konten: string;
  id_paket_wisata: string;
}

export interface PemesananFormData {
  id_paket_wisata: string;
  user_id: string;
  tanggal_pemesanan: string;
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