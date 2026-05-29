import React, { useEffect, useState } from 'react';
import { Loader2, Users, CheckCircle, XCircle, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import type { Profile } from '../../lib/types';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('');

  const fetch = async () => {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data } = await query;
    setUsers((data as Profile[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const approveVendor = async (id: string) => {
    await supabase.from('profiles').update({ is_approved: true }).eq('id', id);
    showToast('Vendor approved!', 'success');
    fetch();
  };

  const revokeVendor = async (id: string) => {
    await supabase.from('profiles').update({ is_approved: false }).eq('id', id);
    showToast('Vendor access revoked', 'info');
    fetch();
  };

  const deleteUser = async () => {
    if (!deleteId) return;
    await supabase.from('profiles').delete().eq('id', deleteId);
    showToast('User removed', 'info');
    setDeleteId(null);
    fetch();
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 w-48"
            />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400">
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-rose-400" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {filtered.length} users
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Joined</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-gray-800">{u.full_name || 'No name'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge label={u.role} variant={u.role} />
                        {u.role === 'vendor' && !u.is_approved && <Badge label="Pending" variant="pending-approval" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {u.role === 'vendor' && !u.is_approved && (
                          <button
                            onClick={() => approveVendor(u.id)}
                            title="Approve Vendor"
                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {u.role === 'vendor' && u.is_approved && (
                          <button
                            onClick={() => revokeVendor(u.id)}
                            title="Revoke Access"
                            className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => setDeleteId(u.id)}
                            title="Delete User"
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User">
        <p className="text-sm text-gray-600 mb-5">This will permanently remove the user and all their data. This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
          <button onClick={deleteUser} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold">Delete User</button>
        </div>
      </Modal>
    </div>
  );
}
