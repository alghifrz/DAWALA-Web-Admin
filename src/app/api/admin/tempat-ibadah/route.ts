import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.tempat_Ibadah.count({ where });

    // Get data with relations
    const tempatIbadahList = await prisma.tempat_Ibadah.findMany({
      where,
      include: {
        alamat: true,
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: tempatIbadahList,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching tempat ibadah list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { nama, jam_buka, fasilitas, id_alamat } = body;

    // Validate required fields
    if (!nama || !jam_buka || !fasilitas || !id_alamat) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Create tempat ibadah
    const tempatIbadah = await prisma.tempat_Ibadah.create({
      data: {
        nama,
        jam_buka,
        fasilitas,
        id_alamat,
      },
      include: {
        alamat: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: tempatIbadah,
      message: 'Tempat ibadah berhasil dibuat',
    });
  } catch (error) {
    console.error('Error creating tempat ibadah:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 