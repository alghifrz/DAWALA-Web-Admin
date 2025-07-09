import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete paket wisata
    await prisma.paket_Wisata.delete({
      where: { id_paket_wisata: id },
    });

    // Redirect back to paket wisata page
    return NextResponse.redirect(new URL('/admin/paket-wisata', request.url));
  } catch (error) {
    console.error('Error deleting paket wisata:', error);
    return NextResponse.redirect(new URL('/admin/paket-wisata?error=delete_failed', request.url));
  }
} 