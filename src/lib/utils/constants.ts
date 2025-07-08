export const ADMIN_NAVIGATION = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'LayoutDashboard',
    description: 'Overview dan statistik'
  },
  {
    title: 'Kuliner Halal',
    href: '/admin/kuliner',
    icon: 'Utensils',
    description: 'Kelola kuliner halal'
  },
  {
    title: 'Tempat Ibadah',
    href: '/admin/tempat-ibadah',
    icon: 'Building',
    description: 'Kelola tempat ibadah'
  },
  {
    title: 'Homestay',
    href: '/admin/homestay',
    icon: 'Home',
    description: 'Kelola homestay ramah muslim'
  },
  {
    title: 'Paket Wisata',
    href: '/admin/paket-wisata',
    icon: 'Map',
    description: 'Kelola paket wisata'
  },
  {
    title: 'Rantai Pasok Hijau',
    href: '/admin/rantai-pasok',
    icon: 'Leaf',
    description: 'Kelola konten rantai pasok hijau'
  },
  {
    title: 'Pemesanan',
    href: '/admin/pemesanan',
    icon: 'ShoppingCart',
    description: 'Kelola pemesanan paket wisata'
  }
] as const;

export const STATUS_KULINER = [
  { value: 'halal', label: 'Halal' },
  { value: 'haram', label: 'Haram' }
] as const;

export const STATUS_PEMESANAN = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'confirmed', label: 'Dikonfirmasi', color: 'green' },
  { value: 'cancelled', label: 'Dibatalkan', color: 'red' }
] as const;

export const FASILITAS_MUSLIM_OPTIONS = [
  'Musholla',
  'Tempat Wudhu',
  'Arah Kiblat',
  'Makanan Halal',
  'Tidak Ada Alkohol',
  'Kamar Terpisah',
  'Kebersihan Tinggi'
] as const;

export const TABLE_PAGE_SIZES = [10, 25, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = 25;

export const DATE_FORMAT = 'dd/MM/yyyy HH:mm';

export const CURRENCY_FORMAT = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
}); 