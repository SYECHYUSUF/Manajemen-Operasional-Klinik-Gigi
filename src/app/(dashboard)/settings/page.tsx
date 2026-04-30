"use client";

import { useState, useMemo, useEffect } from "react";
import { PlusCircle, Activity, TrendingUp, Clock, Download, Edit, Trash2, Upload, Percent, RefreshCw, BarChart2, Shapes, Search, X, Save, ShieldAlert, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { ServiceCategory } from "@/types";
import { useRole } from "@/contexts/role-context";
import { useRouter } from "next/navigation";

// ─── AddServiceForm ───────────────────────────────────────────────────────
function AddServiceForm({ initial, categories, onSave, onClose }: {
  initial?: any;
  categories: ServiceCategory[];
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    code: initial?.code || "",
    description: initial?.description || "",
    base_price: initial?.base_price?.toString() || "",
    category_id: initial?.category_id || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.code) return;
    setSaving(true);
    await onSave({ ...form, base_price: Number(form.base_price) || 0 });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1000);
  };

  return (
    <>
      <div className="p-6 space-y-4">
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg font-semibold text-center">✓ Berhasil disimpan!</div>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Nama Layanan *</label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="cth: Scaling & Root Planing" className="h-10 rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Kode *</label>
            <Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="SRP-001" className="h-10 rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Kategori</label>
            <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30">
              <option value="">Pilih Kategori</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Harga Dasar (Rp)</label>
            <Input type="number" value={form.base_price} onChange={e => setForm(p => ({ ...p, base_price: e.target.value }))} placeholder="350000" className="h-10 rounded-xl" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Deskripsi prosedur..." className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30 resize-none" />
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button onClick={handleSave} disabled={saving || !form.name || !form.code} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold gap-2 px-6">
          <Save className="h-4 w-4" />{saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </>
  );
}




export default function SettingsPage() {
  const { isAdmin, isLoading: roleLoading } = useRole();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Semua Layanan");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // RBAC guard — redirect non-admin
  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [roleLoading, isAdmin, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: catData } = await supabase.from("service_categories").select("*");
      if (catData) setCategories(catData as ServiceCategory[]);
      const { data: svcData } = await supabase.from("services").select("*, service_categories(name)");
      if (svcData) setServices(svcData);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (roleLoading) return <div className="flex items-center justify-center h-64 text-slate-400">Memuat...</div>;
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
      <ShieldAlert className="h-12 w-12 text-red-400" />
      <p className="font-semibold">Akses ditolak. Halaman ini hanya untuk Admin.</p>
    </div>
  );


  const categoryNames = ["Semua Layanan", ...categories.map(c => c.name)];

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const catName = service.service_categories?.name || "Lainnya";
      const matchCategory = activeCategory === "Semua Layanan" || catName === activeCategory;
      const matchSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [services, activeCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-7xl mx-auto">
      {/* ── Add Service Modal ── */}
      {(showAddModal || editService) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => { setShowAddModal(false); setEditService(null); }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editService ? "Edit Layanan" : "Tambah Layanan Baru"}</h2>
              <button onClick={() => { setShowAddModal(false); setEditService(null); }} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <AddServiceForm
              initial={editService}
              categories={categories}
              onSave={async (data) => {
                try {
                  if (editService) {
                    await supabase.from("services").update(data).eq("id", editService.id);
                  } else {
                    await supabase.from("services").insert({ ...data, is_active: true });
                  }
                  await fetchData();
                } catch (err) { console.error(err); }
                setShowAddModal(false); setEditService(null);
              }}
              onClose={() => { setShowAddModal(false); setEditService(null); }}
            />
          </div>
        </div>
      )}

      {/* ── Page Actions Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94]">Master Data Layanan</h2>
          <p className="text-slate-500 mt-1">Kelola daftar layanan klinik, strategi harga, dan deskripsi prosedur.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold shadow-lg shadow-blue-900/10 gap-2 h-11 px-6">
          <PlusCircle className="h-5 w-5" /> Layanan Baru
        </Button>
      </div>

      {/* ── Dashboard Stats Summary ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-blue-50 text-[#0D5A94] rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Layanan</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{services.length}</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-green-50 text-[#006b57] rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-rata Tarif</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">Rp 350K</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Shapes className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{categories.length}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Terakhir Diperbarui</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">Hari Ini</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Data Table Container ── */}
      <Card className="border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <div className="flex gap-4 overflow-x-auto w-full md:w-auto hide-scrollbar pb-2 md:pb-0">
            {categoryNames.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm whitespace-nowrap pb-1 px-1 transition-colors ${activeCategory === cat ? 'font-bold text-[#0D5A94] border-b-2 border-[#0D5A94]' : 'font-medium text-slate-500 hover:text-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input 
                 placeholder="Cari layanan, kode..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 h-9 text-sm rounded-full bg-white border-slate-200" 
               />
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"><Filter className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"><Download className="h-5 w-5" /></Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Layanan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Harga Dasar</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada layanan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{service.name}</div>
                      <div className="text-[10px] text-[#0D5A94] font-bold mt-0.5">KODE: {service.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-[#0D5A94] text-xs font-bold rounded-full">
                        {service.service_categories?.name || "Lainnya"}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-slate-600 line-clamp-1">{service.description || "-"}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(service.base_price)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${service.is_active ? "bg-green-50 text-[#006b57] border-green-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {service.is_active ? "AKTIF" : "NONAKTIF"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]" onClick={() => setEditService(service)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={async () => {
                          if (confirm(`Hapus layanan "${service.name}"?`)) {
                            await supabase.from("services").delete().eq("id", service.id);
                            await fetchData();
                          }
                        }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Menampilkan {filteredServices.length} dari {services.length} layanan</p>
          {filteredServices.length > 10 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">Sebelumnya</Button>
              <Button className="h-8 w-8 bg-[#0D5A94] text-white text-xs font-bold p-0">1</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">Selanjutnya</Button>
            </div>
          )}
        </div>
      </Card>

      {/* ── Management Section (Asymmetric / Glassmorphism Concept) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0D5A94] to-[#004271] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 ">
            <h4 className="text-3xl font-extrabold mb-4">Pricing Analytics</h4>
            <p className="text-blue-100 text-sm mb-8 opacity-90 leading-relaxed ">
              Tinjau bagaimana tarif layanan Anda dibandingkan dengan tolok ukur klinis sekitar dan optimalkan siklus pendapatan klinik Anda.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-[#0D5A94] hover:bg-blue-50 font-bold px-6">Lihat Laporan</Button>
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white font-bold backdrop-blur-sm px-6">Benchmarks</Button>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute right-8 top-12 opacity-20 transform rotate-12 pointer-events-none">
            <BarChart2 className="w-40 h-40" />
          </div>
        </div>

        <Card className="border-slate-100 shadow-sm rounded-2xl">
          <CardContent className="p-8">
            <h4 className="text-lg font-bold text-slate-900 mb-6">Aksi Cepat</h4>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-[#006b57]" />
                  <span className="font-semibold text-slate-700 text-sm">Impor Layanan</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 8.75L7.5 5L3.75 1.25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <Percent className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-slate-700 text-sm">Kelola Aturan Pajak</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 8.75L7.5 5L3.75 1.25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold text-slate-700 text-sm">Pembaruan Harga Massal</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 8.75L7.5 5L3.75 1.25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
