import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete pemesanan
    await prisma.pemesanan.delete({
      where: { id_pemesanan: id },
    });

    // Redirect back to pemesanan page
    return NextResponse.redirect(new URL('/admin/pemesanan', request.url));
  } catch (error) {
    console.error('Error deleting pemesanan:', error);
    return NextResponse.redirect(new URL('/admin/pemesanan?error=delete_failed', request.url));
  }
} 