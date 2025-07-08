import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const jenisList = await prisma.jenis.findMany({
      select: {
        id_jenis: true,
        nama: true,
      },
      orderBy: { nama: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: jenisList,
    });
  } catch (error) {
    console.error('Error fetching jenis list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 