import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { deskripsi: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.kuliner.count({ where });

    // Get data with relations
    const kulinerList = await prisma.kuliner.findMany({
      where,
      include: {
        alamat: true,
        jenis: true,
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: kulinerList,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching kuliner list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { nama, deskripsi, status, jam_buka, foto, id_jenis, id_alamat } = body;

    // Validate required fields
    if (!nama || !deskripsi || !status || !jam_buka || !foto || !id_jenis || !id_alamat) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Create kuliner
    const kuliner = await prisma.kuliner.create({
      data: {
        nama,
        deskripsi,
        status,
        jam_buka,
        foto,
        id_jenis,
        id_alamat,
      },
      include: {
        alamat: true,
        jenis: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: kuliner,
      message: 'Kuliner berhasil dibuat',
    });
  } catch (error) {
    console.error('Error creating kuliner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 