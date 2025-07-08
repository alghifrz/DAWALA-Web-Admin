import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getAdminUser() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // 1. Check user_metadata.role (from Supabase Auth)
  const userRole = user.user_metadata?.role;
  if (userRole === 'admin') {
    return user;
  }

  // 2. Fallback: Check profiles table (if exists)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    // Optionally log error for debugging
    // console.error('Profile role check error:', profileError);
  }

  if (profile && profile.role === 'admin') {
    return user;
  }

  // Not admin
  return null;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  // 1. Check user_metadata.role (from Supabase Auth)
  const userRole = session.user?.user_metadata?.role;
  if (userRole === 'admin') {
    return session;
  }

  // 2. Fallback: Check profiles table (if exists)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    // Optionally log error for debugging
    // console.error('Profile role check error:', profileError);
  }

  if (profile && profile.role === 'admin') {
    return session;
  }

  return null;
} 