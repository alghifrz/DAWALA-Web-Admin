import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nama } = body;

    // Validate required fields
    if (!nama) {
      return NextResponse.json(
        { error: 'Nama fasilitas harus diisi' },
        { status: 400 }
      );
    }

    // Check if fasilitas already exists with different ID
    const existingFasilitas = await prisma.fasilitas_Tempat_Ibadah.findFirst({
      where: { 
        nama: { equals: nama, mode: 'insensitive' },
        id_fasilitas_tempat_ibadah: { not: id }
      },
    });

    if (existingFasilitas) {
      return NextResponse.json(
        { error: 'Fasilitas dengan nama tersebut sudah ada' },
        { status: 400 }
      );
    }

    // Update fasilitas
    const fasilitas = await prisma.fasilitas_Tempat_Ibadah.update({
      where: { id_fasilitas_tempat_ibadah: id },
      data: { nama },
    });

    return NextResponse.json({
      success: true,
      data: fasilitas,
      message: 'Fasilitas berhasil diupdate',
    });
  } catch (error) {
    console.error('Error updating fasilitas:', error);
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
    const { id } = params;

    // Check if fasilitas is being used by any tempat ibadah
    const usedByTempatIbadah = await prisma.tempat_Ibadah_Fasilitas.findFirst({
      where: { id_fasilitas_tempat_ibadah: id },
    });

    if (usedByTempatIbadah) {
      return NextResponse.json(
        { error: 'Fasilitas tidak dapat dihapus karena masih digunakan oleh tempat ibadah' },
        { status: 400 }
      );
    }

    // Delete fasilitas
    await prisma.fasilitas_Tempat_Ibadah.delete({
      where: { id_fasilitas_tempat_ibadah: id },
    });

    return NextResponse.json({
      success: true,
      message: 'Fasilitas berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting fasilitas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 