import { createBrowserClient } from '@supabase/ssr'

export async function deleteAdminUser(adminEmail: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'SUPABASE_SERVICE_ROLE_KEY is required for admin operations' }
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseServiceKey)
  
  if (!adminEmail) {
    return { success: false, error: 'Admin email is required' }
  }

  try {
    // Get all users to find the admin user
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      return { success: false, error: listError.message }
    }

    // Find the admin user by email
    const adminUser = users.users.find(user => user.email === adminEmail)
    
    if (!adminUser) {
      return { success: false, error: 'Admin user not found' }
    }

    // Delete the admin user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(adminUser.id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    return { 
      success: true, 
      message: 'Admin user deleted successfully',
      deletedUser: {
        id: adminUser.id,
        email: adminUser.email
      }
    }

  } catch (error) {
    return { success: false, error: 'Unexpected error occurred' }
  }
}

export async function listAllUsers() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'SUPABASE_SERVICE_ROLE_KEY is required for admin operations' }
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { 
      success: true, 
      users: users.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'user',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      }))
    }

  } catch (error) {
    return { success: false, error: 'Unexpected error occurred' }
  }
} 