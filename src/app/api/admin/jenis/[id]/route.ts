import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient, withRetry } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const body = await request.json();
    const { nama } = body;

    if (!nama || nama.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Nama jenis harus diisi' },
        { status: 400 }
      );
    }

    const jenis = await withRetry(() => prisma.jenis.update({
      where: { id_jenis: params.id },
      data: { nama: nama.trim() },
    }));

    return NextResponse.json({
      success: true,
      data: jenis,
    });
  } catch (error) {
    console.error('Error updating jenis:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    // Check if jenis is being used by any kuliner
    const kulinerCount = await withRetry(() => prisma.kuliner.count({
      where: { id_jenis: params.id },
    }));

    if (kulinerCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Jenis ini sedang digunakan oleh ${kulinerCount} kuliner. Hapus kuliner terlebih dahulu.` 
        },
        { status: 400 }
      );
    }

    await withRetry(() => prisma.jenis.delete({
      where: { id_jenis: params.id },
    }));

    return NextResponse.json({
      success: true,
      message: 'Jenis berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting jenis:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 