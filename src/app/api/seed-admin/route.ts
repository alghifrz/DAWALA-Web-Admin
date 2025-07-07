import { NextRequest, NextResponse } from 'next/server'
import { seedDefaultAdmins, seedAdminUsers } from '@/lib/admin-seeder'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // If custom admin users are provided, use them
    if (body.adminUsers && Array.isArray(body.adminUsers)) {
      const result = await seedAdminUsers(body.adminUsers)
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Admin users seeded successfully',
          results: result.results,
          summary: result.summary
        })
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 400 })
      }
    }
    
    // Otherwise, use default admin users
    const result = await seedDefaultAdmins()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Default admin users seeded successfully',
        results: result.results,
        summary: result.summary
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Seed admin error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await seedDefaultAdmins()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Default admin users seeded successfully',
        results: result.results,
        summary: result.summary
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Seed admin error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 