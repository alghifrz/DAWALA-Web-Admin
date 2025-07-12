import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient, withRetry } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const kuliner = await withRetry(() => prisma.kuliner.findUnique({
      where: { id_kuliner: params.id },
      include: {
        jenis: true,
      },
    }));

    if (!kuliner) {
      return NextResponse.json(
        { success: false, error: 'Kuliner tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: kuliner,
    });
  } catch (error) {
    console.error('Error fetching kuliner:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const body = await request.json();
    const { nama, deskripsi, status, jam_buka, foto, id_jenis, lokasi, google_maps_url } = body;

    // Validate required fields
    if (!nama || !deskripsi || !status || !jam_buka || !foto || !id_jenis || !lokasi) {
      return NextResponse.json(
        { success: false, error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Validate foto is an array
    if (!Array.isArray(foto) || foto.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Minimal satu foto harus diupload' },
        { status: 400 }
      );
    }

    // Check if kuliner exists
    const existingKuliner = await withRetry(() => prisma.kuliner.findUnique({
      where: { id_kuliner: params.id },
    }));

    if (!existingKuliner) {
      return NextResponse.json(
        { success: false, error: 'Kuliner tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update kuliner
    const kuliner = await withRetry(() => prisma.kuliner.update({
      where: { id_kuliner: params.id },
      data: {
        nama,
        deskripsi,
        status,
        jam_buka,
        foto,
        id_jenis,
        lokasi,
        google_maps_url: google_maps_url || null,
      },
      include: {
        jenis: true,
      },
    }));

    return NextResponse.json({
      success: true,
      data: kuliner,
      message: 'Kuliner berhasil diupdate',
    });
  } catch (error) {
    console.error('Error updating kuliner:', error);
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
    // Check if kuliner exists
    const existingKuliner = await withRetry(() => prisma.kuliner.findUnique({
      where: { id_kuliner: params.id },
    }));

    if (!existingKuliner) {
      return NextResponse.json(
        { success: false, error: 'Kuliner tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete kuliner
    await withRetry(() => prisma.kuliner.delete({
      where: { id_kuliner: params.id },
    }));

    return NextResponse.json({
      success: true,
      message: 'Kuliner berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting kuliner:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 