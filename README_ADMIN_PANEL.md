# Admin Panel - Desa Wisata Alamendah

## 🎯 Overview

Admin panel untuk Website Pariwisata Halal Desa Wisata Alamendah yang memungkinkan pengelola desa (role admin) untuk melakukan CRUD semua fitur layanan wisata halal.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **UI Components**: Custom components dengan TailwindCSS
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📁 Struktur Folder

```
src/
├── app/
│   ├── admin/                    # Admin panel routes
│   │   ├── dashboard/           # Dashboard overview
│   │   ├── kuliner/            # Kuliner management
│   │   ├── tempat-ibadah/      # Tempat ibadah management
│   │   ├── homestay/           # Homestay management
│   │   ├── paket-wisata/       # Paket wisata management
│   │   ├── rantai-pasok/       # Rantai pasok hijau management
│   │   ├── pemesanan/          # Pemesanan management
│   │   └── layout.tsx          # Admin layout with auth
│   └── api/
│       └── admin/              # Admin API routes
├── components/
│   └── admin/
│       ├── layout/             # Admin layout components
│       ├── ui/                 # Reusable UI components
│       ├── forms/              # Form components
│       └── tables/             # Table components
├── lib/
│   ├── auth/                   # Authentication utilities
│   ├── api/                    # API service functions
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
└── hooks/                      # Custom React hooks
```

## 🔐 Authentication & Authorization

### Role-Based Access Control

- **Admin**: Full CRUD access ke semua fitur
- **User**: Read access + pemesanan paket wisata

### Implementation

```typescript
// Check admin access
import { requireAdmin } from '@/lib/auth/admin-auth';

export default async function AdminPage() {
  await requireAdmin(); // Redirects to login if not admin
  return <AdminContent />;
}
```

## 🎨 UI Components

### Reusable Components

- **Button**: Multiple variants (primary, secondary, outline, ghost, destructive)
- **Input**: With label, error handling, and helper text
- **Select**: Dropdown with options
- **Badge**: Status indicators
- **Table**: Data tables with pagination
- **Form**: Form components with validation

### Design System

- **Colors**: Consistent color palette dengan TailwindCSS
- **Typography**: Responsive text sizing
- **Spacing**: Consistent spacing system
- **Responsive**: Mobile-first design

## 📊 Fitur Utama

### 1. Manajemen Kuliner Halal

**Fields:**
- Nama kuliner
- Deskripsi
- Status halal (enum: halal/haram)
- Jam buka
- Foto (URL)
- Jenis kuliner (relasi)
- Lokasi (relasi)

**Features:**
- List dengan search dan filter
- Create, edit, delete
- Pagination
- Status badges

### 2. Manajemen Tempat Ibadah

**Fields:**
- Nama tempat ibadah
- Alamat (lokasi)
- Jam buka
- Fasilitas (array)

### 3. Manajemen Homestay Ramah Muslim

**Fields:**
- Nama homestay
- Deskripsi
- Fasilitas ramah Muslim (multiple select)
- Harga
- Kontak
- Foto

### 4. Manajemen Paket Wisata

**Fields:**
- Nama paket
- Deskripsi
- Durasi
- Harga
- Fasilitas (array)
- Poin edukasi/spiritual (array)
- Foto

### 5. Manajemen Rantai Pasok Hijau

**Fields:**
- Konten text
- Relasi ke paket wisata

### 6. Manajemen Pemesanan

**Fields:**
- Nama paket
- Nama user
- Tanggal pemesanan
- Status pemesanan (pending, confirmed, cancelled)
- Catatan opsional

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Supabase account

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Setup environment variables:**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
```

3. **Setup database:**
```bash
npx prisma generate
npx prisma db push
```

4. **Seed admin user:**
```bash
npm run seed:admin
```

5. **Run development server:**
```bash
npm run dev
```

### Database Schema

Prisma schema sudah tersedia di `prisma/schema.prisma` dengan semua tabel yang diperlukan:

- `Paket_Wisata`
- `Kuliner`
- `Tempat_Ibadah`
- `Homestay`
- `Rantai_Pasok_Hijau`
- `Pemesanan`
- `Lokasi`
- `Jenis`
- `Fasilitas_Muslim`
- `Fasilitas_Homestay`

## 📱 Responsive Design

Admin panel fully responsive dengan:
- Mobile-first approach
- Collapsible sidebar di mobile
- Responsive tables
- Touch-friendly interactions

## 🔧 Customization

### Adding New Features

1. **Create types** di `src/lib/types/admin.ts`
2. **Create API service** di `src/lib/api/`
3. **Create form component** di `src/components/admin/forms/`
4. **Create table component** di `src/components/admin/tables/`
5. **Create pages** di `src/app/admin/`
6. **Add navigation** di `src/lib/utils/constants.ts`

### Styling

- Gunakan TailwindCSS classes
- Ikuti design system yang sudah ada
- Gunakan `cn()` utility untuk conditional classes

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login sebagai admin
- [ ] Navigasi sidebar
- [ ] CRUD operations untuk setiap fitur
- [ ] Search dan filter
- [ ] Pagination
- [ ] Responsive design
- [ ] Form validation
- [ ] Error handling

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Pastikan semua environment variables sudah diset di production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

## 📈 Future Enhancements

### Planned Features

1. **Real-time notifications** menggunakan Supabase realtime
2. **File upload** untuk foto (Supabase Storage)
3. **Export data** ke Excel/PDF
4. **Advanced analytics** dan reporting
5. **Bulk operations** (bulk delete, bulk update)
6. **Activity logs** untuk audit trail
7. **Multi-language support**
8. **Dark mode**

### Scalability Considerations

- **Database indexing** untuk performa query
- **Caching** untuk data yang sering diakses
- **API rate limiting**
- **Image optimization**
- **Code splitting** untuk bundle size

## 🤝 Contributing

### Code Style

- Gunakan TypeScript strict mode
- Ikuti ESLint rules
- Gunakan Prettier untuk formatting
- Write meaningful commit messages

### Git Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request
5. Code review
6. Merge to main

## 📞 Support

Untuk pertanyaan atau bantuan:
- Check documentation ini
- Review code comments
- Create issue di repository

---

**Dibuat dengan ❤️ untuk Desa Wisata Alamendah** 