import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check database connection first
    await prisma.$connect();
    
    const fasilitasList = await prisma.fasilitas_Tempat_Ibadah.findMany({
      orderBy: { nama: 'asc' },
    });

    return NextResponse.json({
      data: fasilitasList,
    });
  } catch (error) {
    console.error('Error fetching fasilitas list:', error);
    
    // Check if it's a connection error
    if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your database configuration.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama } = body;

    // Validate required fields
    if (!nama) {
      return NextResponse.json(
        { error: 'Nama fasilitas harus diisi' },
        { status: 400 }
      );
    }

    // Check if fasilitas already exists
    const existingFasilitas = await prisma.fasilitas_Tempat_Ibadah.findFirst({
      where: { nama: { equals: nama, mode: 'insensitive' } },
    });

    if (existingFasilitas) {
      return NextResponse.json(
        { error: 'Fasilitas dengan nama tersebut sudah ada' },
        { status: 400 }
      );
    }

    // Create new fasilitas
    const fasilitas = await prisma.fasilitas_Tempat_Ibadah.create({
      data: {
        nama,
      },
    });

    return NextResponse.json({
      success: true,
      data: fasilitas,
      message: 'Fasilitas berhasil ditambahkan',
    });
  } catch (error) {
    console.error('Error creating fasilitas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 