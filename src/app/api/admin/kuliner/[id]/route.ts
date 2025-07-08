import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const kuliner = await prisma.kuliner.findUnique({
      where: { id_kuliner: params.id },
      include: {
        alamat: true,
        jenis: true,
      },
    });

    if (!kuliner) {
      return NextResponse.json(
        { error: 'Kuliner tidak ditemukan' },
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
    
    const { nama, deskripsi, status, jam_buka, foto, id_jenis, id_alamat } = body;

    // Check if kuliner exists
    const existingKuliner = await prisma.kuliner.findUnique({
      where: { id_kuliner: params.id },
    });

    if (!existingKuliner) {
      return NextResponse.json(
        { error: 'Kuliner tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update kuliner
    const kuliner = await prisma.kuliner.update({
      where: { id_kuliner: params.id },
      data: {
        ...(nama && { nama }),
        ...(deskripsi && { deskripsi }),
        ...(status && { status }),
        ...(jam_buka && { jam_buka }),
        ...(foto && { foto }),
        ...(id_jenis && { id_jenis }),
        ...(id_alamat && { id_alamat }),
      },
      include: {
        alamat: true,
        jenis: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: kuliner,
      message: 'Kuliner berhasil diupdate',
    });
  } catch (error) {
    console.error('Error updating kuliner:', error);
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
    // Check if kuliner exists
    const existingKuliner = await prisma.kuliner.findUnique({
      where: { id_kuliner: params.id },
    });

    if (!existingKuliner) {
      return NextResponse.json(
        { error: 'Kuliner tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete kuliner
    await prisma.kuliner.delete({
      where: { id_kuliner: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Kuliner berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting kuliner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 