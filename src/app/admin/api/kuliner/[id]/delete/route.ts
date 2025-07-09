import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete kuliner
    await prisma.kuliner.delete({
      where: { id_kuliner: id },
    });

    // Redirect back to kuliner page
    return NextResponse.redirect(new URL('/admin/kuliner', request.url));
  } catch (error) {
    console.error('Error deleting kuliner:', error);
    return NextResponse.redirect(new URL('/admin/kuliner?error=delete_failed', request.url));
  }
} 