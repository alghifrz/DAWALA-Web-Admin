import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    // Check if all required environment variables are set
    if (!supabaseUrl || !supabaseServiceKey || !adminEmail || !adminPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required environment variables. Please check ADMIN_EMAIL, ADMIN_PASSWORD, and SUPABASE_SERVICE_ROLE_KEY' 
      }, { status: 400 })
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if admin user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      return NextResponse.json({ success: false, error: listError.message }, { status: 500 })
    }

    // Check if admin email already exists
    const adminExists = existingUsers.users.some((user: any) => user.email === adminEmail)
    
    if (adminExists) {
      return NextResponse.json({ 
        success: true, 
        message: 'Admin user already exists' 
      })
    }

    // Create admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto confirm email
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    })

    if (createError) {
      return NextResponse.json({ success: false, error: createError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully', 
      user: newUser.user 
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup admin user' 
    }, { status: 500 })
  }
} 