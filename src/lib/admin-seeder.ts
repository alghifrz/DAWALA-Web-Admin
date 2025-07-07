import { createClient } from '@supabase/supabase-js'

interface AdminUser {
  email: string
  password: string
  name: string
  role?: string
}

export async function seedAdminUsers(adminUsers: AdminUser[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return { 
      success: false, 
      error: 'Missing Supabase configuration. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY' 
    }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const results = []
  
  for (const adminUser of adminUsers) {
    try {
      // Check if user already exists
      const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        results.push({
          email: adminUser.email,
          success: false,
          error: listError.message
        })
        continue
      }

      const userExists = existingUsers.users.some((user: any) => user.email === adminUser.email)
      
      if (userExists) {
        results.push({
          email: adminUser.email,
          success: true,
          message: 'User already exists',
          action: 'skipped'
        })
        continue
      }

      // Create new admin user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminUser.email,
        password: adminUser.password,
        email_confirm: true, // Auto confirm email
        user_metadata: {
          role: adminUser.role || 'admin',
          name: adminUser.name
        }
      })

      if (createError) {
        results.push({
          email: adminUser.email,
          success: false,
          error: createError.message
        })
      } else {
        results.push({
          email: adminUser.email,
          success: true,
          message: 'Admin user created successfully',
          user: {
            id: newUser.user?.id,
            email: newUser.user?.email
          },
          action: 'created'
        })
      }
    } catch (error) {
      results.push({
        email: adminUser.email,
        success: false,
        error: 'Unexpected error occurred'
      })
    }
  }

  return {
    success: true,
    results,
    summary: {
      total: adminUsers.length,
      created: results.filter(r => r.action === 'created').length,
      skipped: results.filter(r => r.action === 'skipped').length,
      failed: results.filter(r => !r.success && r.action !== 'skipped').length
    }
  }
}

// Default admin users to seed
export const defaultAdminUsers: AdminUser[] = [
  {
    email: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAIL || 'admin@dawala.com',
    password: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_PASSWORD || 'admin123456',
    name: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_NAME || 'Dawala Admin',
    role: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_ROLE || 'admin'
  },
]

// Function to seed with default users
export async function seedDefaultAdmins() {
  return await seedAdminUsers(defaultAdminUsers)
} 