# 🚀 Quick Start: Admin Seeder

## What is Admin Seeder?

Admin Seeder adalah fitur untuk membuat akun admin secara otomatis di database Supabase. Fitur ini memungkinkan kamu untuk:

- ✅ Membuat admin default dengan kredensial yang sudah ditentukan
- ✅ Membuat admin custom dengan kredensial sendiri
- ✅ Interface web yang mudah digunakan
- ✅ Script CLI untuk otomatisasi
- ✅ Mencegah duplikasi (skip user yang sudah ada)

## Default Admin Users

Seeder sudah menyediakan 2 admin default:

| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@dawala.com | admin123456 | admin | Super Admin |
| superadmin@dawala.com | superadmin123 | super_admin | Super Administrator |

## Cara Menggunakan

### 🖥️ Method 1: Web Interface (Paling Mudah)

1. **Jalankan development server:**
   ```bash
   npm run dev
   ```

2. **Buka browser dan akses:**
   ```
   http://localhost:3000/admin-seeder
   ```

3. **Klik "Run Default Seeder"** untuk membuat admin default

4. **Atau gunakan custom admin:**
   - Centang "Use custom admins"
   - Isi detail admin (email, password, name, role)
   - Klik "Run Custom Seeder"

### 💻 Method 2: CLI Script (Otomatis)

1. **Jalankan development server:**
   ```bash
   npm run dev
   ```

2. **Di terminal baru, jalankan seeder:**
   ```bash
   npm run seed:admin
   ```

3. **Hasil yang diharapkan:**
   ```
   🌱 Dawala Admin Seeder
   ======================

   ✅ Environment variables loaded successfully

   🚀 Starting admin seeder...

   ✅ Seeder completed successfully!

   📊 Summary:
      Total: 2
      Created: 2
      Skipped: 0
      Failed: 0

   🎉 Admin users have been created successfully!
   You can now log in with the default credentials:
      - admin@dawala.com / admin123456
      - superadmin@dawala.com / superadmin123
   ```

### 🔧 Method 3: API Endpoint (Untuk Developer)

```bash
# Buat admin default
curl -X GET http://localhost:3000/api/seed-admin

# Buat admin custom
curl -X POST http://localhost:3000/api/seed-admin \
  -H "Content-Type: application/json" \
  -d '{
    "adminUsers": [
      {
        "email": "admin@example.com",
        "password": "password123",
        "name": "Admin Name",
        "role": "admin"
      }
    ]
  }'
```

## Environment Variables

Pastikan file `.env` sudah berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

### ❌ Error: "Server is not running"
**Solusi:** Jalankan `npm run dev` terlebih dahulu

### ❌ Error: "Missing environment variables"
**Solusi:** Periksa file `.env.local` dan pastikan variabel sudah diisi

### ❌ Error: "User already exists"
**Solusi:** Ini normal! Seeder akan skip user yang sudah ada

### ❌ Error: "Permission denied"
**Solusi:** Periksa Supabase service role key dan pastikan punya permission admin

## Setelah Seeder Berhasil

1. **Login ke admin dashboard:**
   ```
   http://localhost:3000/login
   ```

2. **Gunakan kredensial default:**
   - Email: `admin@dawala.com`
   - Password: `admin123456`

3. **Atau:**
   - Email: `superadmin@dawala.com`
   - Password: `superadmin123`

## Fitur Tambahan

- **Admin Management:** Kelola semua admin di `/admin-management`
- **Dashboard:** Akses dashboard admin di `/admin`
- **Seeder Page:** Akses halaman seeder di `/admin-seeder`

## Dokumentasi Lengkap

Untuk dokumentasi lengkap, lihat: `docs/ADMIN_SEEDER.md`

---

**🎉 Selamat! Admin users sudah berhasil dibuat di database!** 