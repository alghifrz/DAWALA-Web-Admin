import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete rantai pasok
    await prisma.rantai_Pasok_Hijau.delete({
      where: { id_rantai_pasok_hijau: id },
    });

    // Redirect back to rantai pasok page
    return NextResponse.redirect(new URL('/admin/rantai-pasok', request.url));
  } catch (error) {
    console.error('Error deleting rantai pasok:', error);
    return NextResponse.redirect(new URL('/admin/rantai-pasok?error=delete_failed', request.url));
  }
} 