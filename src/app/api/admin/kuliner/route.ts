import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient, withRetry } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const prisma = createPrismaClient();
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
    const total = await withRetry(() => prisma.kuliner.count({ where }));

    // Get data with relations
    const kulinerList = await withRetry(() => prisma.kuliner.findMany({
      where,
      include: {
        jenis: true,
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }));

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
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
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

    // Create new kuliner
    const kuliner = await withRetry(() => prisma.kuliner.create({
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
      message: 'Kuliner berhasil ditambahkan',
    });
  } catch (error) {
    console.error('Error creating kuliner:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 