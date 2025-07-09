import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete tempat ibadah
    await prisma.tempat_Ibadah.delete({
      where: { id_tempat_ibadah: id },
    });

    // Redirect back to tempat ibadah page
    return NextResponse.redirect(new URL('/admin/tempat-ibadah', request.url));
  } catch (error) {
    console.error('Error deleting tempat ibadah:', error);
    return NextResponse.redirect(new URL('/admin/tempat-ibadah?error=delete_failed', request.url));
  }
} 