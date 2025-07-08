import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const lokasiList = await prisma.lokasi.findMany({
      select: {
        id_lokasi: true,
        nama: true,
      },
      orderBy: { nama: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: lokasiList,
    });
  } catch (error) {
    console.error('Error fetching lokasi list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 