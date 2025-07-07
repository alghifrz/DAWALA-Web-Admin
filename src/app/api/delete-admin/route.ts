import { NextRequest, NextResponse } from 'next/server'
import { deleteAdminUser, listAllUsers } from '@/lib/admin-delete'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    const result = await deleteAdminUser(email)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        deletedUser: result.deletedUser
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Delete admin error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await listAllUsers()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        users: result.users
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }
  } catch (error) {
    console.error('List users error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 