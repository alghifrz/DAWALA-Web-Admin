import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tempatIbadah = await prisma.tempat_Ibadah.findUnique({
      where: { id_tempat_ibadah: params.id },
    });

    if (!tempatIbadah) {
      return NextResponse.json(
        { error: 'Tempat ibadah tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tempatIbadah,
    });
  } catch (error) {
    console.error('Error fetching tempat ibadah:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nama, jam_buka, fasilitas, lokasi } = body;

    // Validate required fields
    if (!nama || !jam_buka || !fasilitas || !lokasi) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Update tempat ibadah
    const tempatIbadah = await prisma.tempat_Ibadah.update({
      where: { id_tempat_ibadah: params.id },
      data: {
        nama,
        jam_buka,
        fasilitas,
        lokasi,
      },
    });

    return NextResponse.json({
      success: true,
      data: tempatIbadah,
    });
  } catch (error) {
    console.error('Error updating tempat ibadah:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if tempat ibadah exists
    const existingTempatIbadah = await prisma.tempat_Ibadah.findUnique({
      where: { id_tempat_ibadah: params.id },
    });

    if (!existingTempatIbadah) {
      return NextResponse.json(
        { error: 'Tempat ibadah tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete tempat ibadah
    await prisma.tempat_Ibadah.delete({
      where: { id_tempat_ibadah: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Tempat ibadah berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting tempat ibadah:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 