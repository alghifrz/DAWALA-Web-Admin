import { requireAdmin } from '@/lib/auth/admin-auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to login if user is not admin
  await requireAdmin();

  return <>{children}</>;
} 