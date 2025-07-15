import { prisma } from '@/lib/prisma';
import { Button } from '@/components/Button';
import { DeleteButton } from '@/components/DeleteButton';
import Link from 'next/link';

interface TempatIbadahTableProps {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export async function TempatIbadahTable({ searchParams }: TempatIbadahTableProps) {
  const params = await searchParams;
  const page = parseInt(params?.page || '1');
  const limit = parseInt(params?.limit || '10');
  const search = params?.search || '';
  
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = {};
  if (search) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get data from Prisma
  const [tempatIbadahList, totalItems] = await Promise.all([
    prisma.tempat_Ibadah.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        tempat_ibadah_fasilitas: {
          include: {
            fasilitas_tempat_ibadah: true,
          },
        },
      },
    }).catch(() => []),
    prisma.tempat_Ibadah.count({ where }).catch(() => 0),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tempat Ibadah</h1>
          <p className="text-gray-600">Kelola data tempat ibadah</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/fasilitas-tempat-ibadah">
            <Button variant="outline">
              Kelola Fasilitas
            </Button>
          </Link>
          <Link href="/admin/tempat-ibadah/create">
            <Button>
              Tambah Tempat Ibadah
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <form method="GET" className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Cari tempat ibadah..."
            defaultValue={search}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button type="submit" variant="outline">
            Cari
          </Button>
          {search && (
            <Link href="/admin/tempat-ibadah">
              <Button type="button" variant="outline">
                Reset
              </Button>
            </Link>
          )}
        </form>
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jam Buka
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lokasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL Lokasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fasilitas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tempatIbadahList.map((tempatIbadah) => (
            <tr key={tempatIbadah.id_tempat_ibadah} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {tempatIbadah.nama}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tempatIbadah.jam_buka}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tempatIbadah.lokasi}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tempatIbadah.url_lokasi ? (
                  <a
                    href={tempatIbadah.url_lokasi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Lihat Lokasi
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex flex-wrap gap-1">
                  {tempatIbadah.tempat_ibadah_fasilitas.map((fasilitas, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {fasilitas.fasilitas_tempat_ibadah.nama}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link href={`/admin/tempat-ibadah/${tempatIbadah.id_tempat_ibadah}`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <DeleteButton
                    action={`/api/admin/tempat-ibadah/${tempatIbadah.id_tempat_ibadah}/delete`}
                    confirmMessage="Apakah Anda yakin ingin menghapus tempat ibadah ini?"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Link
              href={`/admin/tempat-ibadah?page=${page - 1}&limit=${limit}&search=${search}`}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </Link>
            <Link
              href={`/admin/tempat-ibadah?page=${page + 1}&limit=${limit}&search=${search}`}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page >= totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </Link>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{skip + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(skip + limit, totalItems)}
                </span>{' '}
                of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/admin/tempat-ibadah?page=${pageNum}&limit=${limit}&search=${search}`}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
} 