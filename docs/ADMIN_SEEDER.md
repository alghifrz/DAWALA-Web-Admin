# Admin Seeder Documentation

## Overview

The Admin Seeder is a feature that allows you to create admin users in the database with predefined or custom credentials. This is useful for initial setup or when you need to add new admin users to the system.

## Features

- ✅ Create default admin users with predefined credentials
- ✅ Create custom admin users with your own credentials
- ✅ Web interface for easy management
- ✅ CLI script for automated seeding
- ✅ Duplicate prevention (skips existing users)
- ✅ Detailed results and error reporting

## Default Admin Users

The seeder comes with two default admin users:

| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@dawala.com | admin123456 | admin | Super Admin |
| superadmin@dawala.com | superadmin123 | super_admin | Super Administrator |

## Usage

### Method 1: Web Interface

1. **Access the seeder page:**
   - Go to `/admin-seeder` in your browser
   - Or click "Create Admins" from the admin dashboard

2. **Run default seeder:**
   - Click "Run Default Seeder" to create the default admin users
   - This will create both admin@dawala.com and superadmin@dawala.com

3. **Run custom seeder:**
   - Check "Use custom admins" checkbox
   - Fill in the admin details (email, password, name, role)
   - Add more admins if needed
   - Click "Run Custom Seeder"

### Method 2: CLI Script

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Run the seeder script:**
   ```bash
   npm run seed:admin
   ```

3. **Expected output:**
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

   📋 Detailed Results:
      1. ✅ admin@dawala.com - created
         Admin user created successfully
      2. ✅ superadmin@dawala.com - created
         Admin user created successfully

   🎉 Admin users have been created successfully!
   You can now log in with the default credentials:
      - admin@dawala.com / admin123456
      - superadmin@dawala.com / superadmin123
   ```

### Method 3: API Endpoint

You can also call the seeder API directly:

```bash
# Run default seeder
curl -X GET http://localhost:3000/api/seed-admin

# Run custom seeder
curl -X POST http://localhost:3000/api/seed-admin \
  -H "Content-Type: application/json" \
  -d '{
    "adminUsers": [
      {
        "email": "custom@example.com",
        "password": "mypassword123",
        "name": "Custom Admin",
        "role": "admin"
      }
    ]
  }'
```

## API Reference

### GET /api/seed-admin

Creates default admin users.

**Response:**
```json
{
  "success": true,
  "message": "Default admin users seeded successfully",
  "results": [
    {
      "email": "admin@dawala.com",
      "success": true,
      "message": "Admin user created successfully",
      "action": "created",
      "user": {
        "id": "user-uuid",
        "email": "admin@dawala.com"
      }
    }
  ],
  "summary": {
    "total": 2,
    "created": 2,
    "skipped": 0,
    "failed": 0
  }
}
```

### POST /api/seed-admin

Creates custom admin users.

**Request Body:**
```json
{
  "adminUsers": [
    {
      "email": "admin@example.com",
      "password": "password123",
      "name": "Admin Name",
      "role": "admin"
    }
  ]
}
```

**Response:** Same as GET endpoint

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Security Notes

- The seeder uses Supabase's service role key for admin operations
- Passwords are stored securely in Supabase Auth
- The seeder checks for existing users to prevent duplicates
- All admin operations are logged for audit purposes

## Troubleshooting

### Common Issues

1. **"Server is not running" error:**
   - Make sure to start the development server with `npm run dev`
   - The seeder needs the API endpoints to be available

2. **"Missing environment variables" error:**
   - Check your `.env` file
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

3. **"User already exists" message:**
   - This is normal behavior - the seeder skips existing users
   - You can still log in with the existing credentials

4. **"Permission denied" error:**
   - Ensure your Supabase service role key has admin permissions
   - Check your Supabase project settings

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Check the terminal output for CLI errors
3. Verify your Supabase configuration
4. Ensure your database is accessible

## Customization

### Adding More Default Users

To add more default admin users, edit `src/lib/admin-seeder.ts`:

```typescript
export const defaultAdminUsers: AdminUser[] = [
  {
    email: 'admin@dawala.com',
    password: 'admin123456',
    name: 'Super Admin',
    role: 'admin'
  },
  {
    email: 'superadmin@dawala.com',
    password: 'superadmin123',
    name: 'Super Administrator',
    role: 'super_admin'
  },
  // Add your custom users here
  {
    email: 'your-admin@example.com',
    password: 'your-password',
    name: 'Your Admin',
    role: 'admin'
  }
]
```

### Modifying User Roles

Available roles:
- `admin` - Standard admin user
- `super_admin` - Super administrator with full privileges
- `moderator` - Moderator with limited privileges

You can add custom roles by modifying the role validation in the seeder. 