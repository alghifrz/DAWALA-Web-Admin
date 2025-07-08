import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get counts from all tables
    const [
      totalKuliner,
      totalTempatIbadah,
      totalHomestay,
      totalPaketWisata,
      totalPemesanan,
      totalRantaiPasokHijau,
      pendingPemesanan,
      confirmedPemesanan
    ] = await Promise.all([
      prisma.kuliner.count(),
      prisma.tempat_Ibadah.count(),
      prisma.homestay.count(),
      prisma.paket_Wisata.count(),
      prisma.pemesanan.count(),
      prisma.rantai_Pasok_Hijau.count(),
      prisma.pemesanan.count({
        where: { status_pemesanan: 'pending' }
      }),
      prisma.pemesanan.count({
        where: { status_pemesanan: 'confirmed' }
      })
    ])

    // Get recent activity (latest 5 records from each table)
    const recentKuliner = await prisma.kuliner.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        jenis: true,
        alamat: true
      }
    })

    const recentPemesanan = await prisma.pemesanan.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        paket_wisata: true
      }
    })

    const recentHomestay = await prisma.homestay.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        alamat: true
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalKuliner,
        totalTempatIbadah,
        totalHomestay,
        totalPaketWisata,
        totalPemesanan,
        totalRantaiPasokHijau,
        pendingPemesanan,
        confirmedPemesanan
      },
      recentActivity: {
        kuliner: recentKuliner,
        pemesanan: recentPemesanan,
        homestay: recentHomestay
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
} 