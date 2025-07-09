import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete homestay
    await prisma.homestay.delete({
      where: { id_homestay: id },
    });

    // Redirect back to homestay page
    return NextResponse.redirect(new URL('/admin/homestay', request.url));
  } catch (error) {
    console.error('Error deleting homestay:', error);
    return NextResponse.redirect(new URL('/admin/homestay?error=delete_failed', request.url));
  }
} 