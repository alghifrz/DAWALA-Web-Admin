import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient, withRetry } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const prisma = createPrismaClient();
  try {
    const jenisList = await withRetry(() => prisma.jenis.findMany({
      select: {
        id_jenis: true,
        nama: true,
      },
      orderBy: { nama: 'asc' },
    }));

    return NextResponse.json({
      success: true,
      data: jenisList,
    });
  } catch (error) {
    console.error('Error fetching jenis list:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        data: [] 
      },
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
    const { nama } = body;

    if (!nama || nama.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Nama jenis harus diisi' },
        { status: 400 }
      );
    }

    const jenis = await withRetry(() => prisma.jenis.create({
      data: { nama: nama.trim() },
    }));

    return NextResponse.json({
      success: true,
      data: jenis,
    });
  } catch (error) {
    console.error('Error creating jenis:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 