# Dawala Web Admin

A modern admin dashboard built with Next.js 15, TypeScript, Tailwind CSS, and Supabase authentication.

## Features

- 🔐 **Secure Authentication** - Supabase-based login system
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Performance** - Built with Next.js 15 and Turbopack
- 🔒 **Protected Routes** - Middleware-based route protection
- 📊 **Dashboard** - Admin dashboard with statistics and activity feed
- 👥 **User Management** - Create and delete admin users

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Development**: Turbopack for fast builds

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dawala-web-admin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Configuration
DATABASE_URL=your_database_url_here

# Admin User Configuration
ADMIN_EMAIL=admin@dawala.com
ADMIN_PASSWORD=your_secure_admin_password_here
```

4. Auto-setup admin user:
   - Start the development server: `npm run dev`
   - Admin user will be created automatically on first run
   - No manual setup required

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── admin/                 # Admin dashboard pages
│   │   ├── components/        # Admin-specific components
│   │   │   └── LogoutButton.tsx
│   │   └── page.tsx          # Admin dashboard
│   ├── api/
│   │   └── delete-admin/      # API route for admin deletion
│   │       └── route.ts
│   ├── login/                # Login page
│   │   └── page.tsx
│   ├── admin-management/     # Admin management page
│   │   └── page.tsx
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page (auto-setup + redirects)
├── components/
│   └── AuthProvider.tsx      # Authentication context
├── lib/
│   ├── supabase.ts           # Client-side Supabase configuration
│   ├── supabase-server.ts    # Server-side Supabase configuration
│   ├── auto-setup.ts         # Auto admin setup utilities
│   └── admin-delete.ts       # Admin user deletion utilities
└── middleware.ts             # Route protection middleware
```

## Authentication Flow

1. **Landing Page** (`/`) - Auto-setup admin user and redirects based on auth status
2. **Login Page** (`/login`) - Admin authentication form
3. **Admin Dashboard** (`/admin`) - Protected admin interface
4. **Admin Management** (`/admin-management`) - Manage admin users
5. **Middleware** - Automatically handles route protection and redirects

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `DATABASE_URL` | Database connection string | Yes |
| `ADMIN_EMAIL` | Admin user email address | Yes |
| `ADMIN_PASSWORD` | Admin user password | Yes |

### How to get Supabase credentials:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon key
4. For the service role key, go to Settings > API and copy the service_role key (keep this secret!)

### Important Notes:

- **Service Role Key**: This is required for admin operations and should NEVER be exposed to the client
- **Admin Credentials**: The admin user will be created automatically on first app startup
- **Database URL**: Required for database connections (if using direct database access)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application can be deployed to Vercel, Netlify, or any other platform that supports Next.js.

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
