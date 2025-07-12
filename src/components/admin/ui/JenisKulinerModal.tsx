import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Jenis {
  id_jenis: string;
  nama: string;
}

interface JenisKulinerModalProps {
  open: boolean;
  onClose: () => void;
}

export function JenisKulinerModal({ open, onClose }: JenisKulinerModalProps) {
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [loading, setLoading] = useState(false);
  const [newJenis, setNewJenis] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const fetchJenis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jenis');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const response = await res.json();
      if (response.success) {
        setJenisList(response.data || []);
      } else {
        console.error('API error:', response.error);
        setJenisList([]);
      }
    } catch (e) {
      console.error('Error fetching jenis:', e);
      setJenisList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchJenis();
  }, [open]);

  const handleAdd = async () => {
    if (!newJenis.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jenis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newJenis }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menambah jenis');
      }
      
      const response = await res.json();
      if (response.success) {
        setNewJenis('');
        fetchJenis();
      } else {
        alert(response.error || 'Gagal menambah jenis');
      }
    } catch (error) {
      console.error('Error adding jenis:', error);
      alert(error instanceof Error ? error.message : 'Gagal menambah jenis');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editValue.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jenis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: editValue }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal mengupdate jenis');
      }
      
      const response = await res.json();
      if (response.success) {
        setEditId(null);
        setEditValue('');
        fetchJenis();
      } else {
        alert(response.error || 'Gagal mengupdate jenis');
      }
    } catch (error) {
      console.error('Error updating jenis:', error);
      alert(error instanceof Error ? error.message : 'Gagal mengupdate jenis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus jenis kuliner ini?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jenis/${id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menghapus jenis');
      }
      
      const response = await res.json();
      if (response.success) {
        fetchJenis();
      } else {
        alert(response.error || 'Gagal menghapus jenis');
      }
    } catch (error) {
      console.error('Error deleting jenis:', error);
      alert(error instanceof Error ? error.message : 'Gagal menghapus jenis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Kelola Jenis Kuliner">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newJenis}
            onChange={e => setNewJenis(e.target.value)}
            placeholder="Jenis kuliner baru"
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={loading || !newJenis.trim()}>
            Tambah
          </Button>
        </div>
        <div className="max-h-64 overflow-y-auto border rounded">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : jenisList.length === 0 ? (
            <div className="p-4 text-center text-gray-400">Belum ada jenis kuliner</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jenisList.map(jenis => (
                  <tr key={jenis.id_jenis} className="border-t">
                    <td className="p-2">
                      {editId === jenis.id_jenis ? (
                        <Input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        jenis.nama
                      )}
                    </td>
                    <td className="p-2 flex gap-2">
                      {editId === jenis.id_jenis ? (
                        <>
                          <Button size="sm" onClick={() => handleEdit(jenis.id_jenis)} disabled={loading || !editValue.trim()}>
                            Simpan
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditId(null); setEditValue(''); }}>
                            Batal
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => { setEditId(jenis.id_jenis); setEditValue(jenis.nama); }}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(jenis.id_jenis)}>
                            Hapus
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
} 