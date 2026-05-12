"use client";

import { useState, useMemo, useEffect } from "react";
import { useRole } from "@/contexts/role-context";
import { useRouter } from "next/navigation";
import { RefreshCw, PlusCircle, Package, AlertTriangle, AlertCircle, DollarSign, Download, MoreVertical, Search, ScanLine, ChevronLeft, ChevronRight, Activity, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const MOCK_PRODUCTS = [
  { id: "1", name: "Amoxicillin 500mg", sku: "PH-AMX-500", category: "Obat", stock: 450, unit: "Box", status: "ok" },
  { id: "2", name: "Sterile Latex Gloves (M)", sku: "EQ-GLV-LAT-M", category: "Alat", stock: 12, unit: "Box", status: "low" },
  { id: "3", name: "Dental Composite Resin A2", sku: "DN-CMP-A2", category: "Alat", stock: 0, unit: "Syringe", status: "empty" },
  { id: "4", name: "Chlorhexidine 0.12%", sku: "PH-CHX-012", category: "Obat", stock: 85, unit: "Botol", status: "ok" },
  { id: "5", name: "Dental Alginate", sku: "DN-ALG-001", category: "Alat", stock: 3, unit: "Kg", status: "low" },
  { id: "6", name: "Ibuprofen 400mg", sku: "PH-IBU-400", category: "Obat", stock: 200, unit: "Strip", status: "ok" },
];

function AddProductModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", sku: "", category: "Obat", stock: "", unit: "", price: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.sku) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); onClose(); setForm({ name: "", sku: "", category: "Obat", stock: "", unit: "", price: "" }); }, 1200);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 md:pl-[276px]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Produk Baru</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg font-semibold text-center">✓ Produk berhasil ditambahkan!</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Nama Produk *</label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="cth: Amoxicillin 500mg" className="h-10 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">SKU / Kode *</label>
              <Input value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} placeholder="PH-AMX-500" className="h-10 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Kategori</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30">
                <option>Obat</option><option>Alat</option><option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Stok Awal</label>
              <Input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} placeholder="0" className="h-10 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Satuan</label>
              <Input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} placeholder="Box, Botol, Pcs..." className="h-10 rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Harga Beli (Rp)</label>
              <Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="50000" className="h-10 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={saving || !form.name || !form.sku} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold px-6">
            {saving ? "Menyimpan..." : "Tambah Produk"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RestockModal({ open, onClose, products }: { open: boolean; onClose: () => void; products: typeof MOCK_PRODUCTS }) {
  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selected || !qty) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); onClose(); setSelected(""); setQty(""); }, 1200);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 md:pl-[276px]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Restock Produk</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg font-semibold text-center">✓ Restock berhasil dicatat!</div>}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Pilih Produk</label>
            <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30">
              <option value="">-- Pilih Produk --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock} {p.unit})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Jumlah Tambahan</label>
            <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Masukkan jumlah..." className="h-10 rounded-xl" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={saving || !selected || !qty} className="bg-[#006b57] hover:bg-[#004a3c] text-white font-bold gap-2 px-6">
            <RefreshCw className="h-4 w-4" />{saving ? "Menyimpan..." : "Konfirmasi Restock"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { isDoctor, isLoading: roleLoading } = useRole();
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  useEffect(() => {
    if (!roleLoading && !isDoctor) router.replace("/dashboard");
  }, [roleLoading, isDoctor, router]);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchCat = activeCategory === "Semua" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  if (roleLoading) return <div className="flex items-center justify-center h-64 text-slate-400">Memuat...</div>;
  if (!isDoctor) return null;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const statusBadge = (s: string) => {
    if (s === "ok") return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Tersedia</span>;
    if (s === "low") return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-orange-100 text-orange-700 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />Stok Menipis</span>;
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Habis</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-[1440px] mx-auto">
      <AddProductModal open={showAdd} onClose={() => setShowAdd(false)} />
      <RestockModal open={showRestock} onClose={() => setShowRestock(false)} products={MOCK_PRODUCTS} />

      {/* Header — breadcrumb dihapus */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#004271] dark:text-white">Manajemen Inventaris</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Pantau stok bahan klinis dan farmasi secara real-time.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button onClick={() => setShowRestock(true)} variant="outline" className="flex-1 md:flex-none border-2 border-[#006b57] text-[#006b57] dark:text-green-400 font-bold hover:bg-[#006b57]/5 gap-2">
            <RefreshCw className="h-4 w-4" /> Restock
          </Button>
          <Button onClick={() => setShowAdd(true)} className="flex-1 md:flex-none bg-[#0D5A94] hover:bg-[#004271] text-white font-bold shadow-lg shadow-blue-900/20 gap-2">
            <PlusCircle className="h-4 w-4" /> Tambah Produk
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm"><CardContent className="p-6">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-[#0D5A94] dark:text-blue-400 mb-4"><Package className="h-5 w-5" /></div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Produk</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{MOCK_PRODUCTS.length}</h3>
          <p className="text-[10px] text-slate-400 mt-2">Dari 3 kategori</p>
        </CardContent></Card>
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm"><CardContent className="p-6">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4"><AlertTriangle className="h-5 w-5" /></div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Stok Menipis</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{MOCK_PRODUCTS.filter(p => p.status === "low").length}</h3>
          <p className="text-[10px] text-slate-400 mt-2">Perlu segera restock</p>
        </CardContent></Card>
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm"><CardContent className="p-6">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 mb-4"><AlertCircle className="h-5 w-5" /></div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Stok Habis</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{MOCK_PRODUCTS.filter(p => p.status === "empty").length}</h3>
          <p className="text-[10px] text-slate-400 mt-2">Perlu pengadaan segera</p>
        </CardContent></Card>
        <Card className="bg-[#0D5A94] border-transparent shadow-xl text-white"><CardContent className="p-6">
          <div className="w-10 h-10 bg-white dark:bg-slate-900/10 rounded-lg flex items-center justify-center text-white mb-4"><DollarSign className="h-5 w-5" /></div>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Nilai Inventaris</p>
          <h3 className="text-2xl font-black mt-1">{formatCurrency(425000000)}</h3>
          <div className="w-full bg-white dark:bg-slate-900/20 h-1.5 rounded-full mt-4 overflow-hidden"><div className="bg-[#76f9d6] w-3/4 h-full rounded-full" /></div>
        </CardContent></Card>
      </div>

      {/* Katalog Produk */}
      <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider whitespace-nowrap">Katalog Produk</h3>
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
              {["Semua", "Obat", "Alat"].map(cat => (
                <Button key={cat} variant="ghost" onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={`px-4 py-1.5 h-auto text-xs font-bold rounded-none ${activeCategory === cat ? "bg-[#0D5A94] text-white hover:bg-[#004271] hover:text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700"}`}>
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} placeholder="Cari barang, SKU..." className="pl-9 h-9 text-sm rounded-full bg-white dark:bg-slate-800" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                {["Nama Produk", "Kategori", "Stok", "Satuan", "Status", "Aksi"].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest ${i === 2 ? "text-center" : i === 5 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paged.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">Tidak ada produk yang sesuai.</td></tr>
              ) : paged.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group even:bg-slate-50 dark:bg-slate-800 dark:even:bg-slate-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {item.category === "Obat" ? <Activity className="h-4 w-4 text-slate-400" /> : <Package className="h-4 w-4 text-slate-400" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-400">SKU: {item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${item.category === "Obat" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600"}`}>{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-slate-900 dark:text-white">{item.stock}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-medium">{item.unit}</td>
                  <td className="px-6 py-4">{statusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button onClick={() => setShowRestock(true)} variant="ghost" size="sm" className="h-7 text-xs text-[#006b57] dark:text-green-400 hover:bg-emerald-50 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Restock</Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94] dark:text-blue-400"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination — hanya tampil jika > 1 halaman */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Menampilkan <span className="text-slate-900 dark:text-white font-bold">{Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)}</span> dari {filtered.length} produk
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Button key={p} onClick={() => setPage(p)} className={`h-8 w-8 text-xs font-bold p-0 ${page === p ? "bg-[#0D5A94] text-white hover:bg-[#004271]" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}>{p}</Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </Card>

      {/* Pergerakan Stok */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pergerakan Stok Terakhir</h4>
              <Button variant="link" className="text-xs text-[#0D5A94] dark:text-blue-400 font-bold p-0 h-auto">Lihat Semua</Button>
            </div>
            <div className="space-y-5">
              {[
                { dot: "bg-green-50 dark:bg-green-900/200", title: "Stok Masuk: Amoxicillin 500mg", sub: "+200 Box oleh Admin Sarah", time: "2 jam lalu" },
                { dot: "bg-red-500", title: "Stok Keluar: Sterile Latex Gloves", sub: "-5 Box untuk Ruang Operasi 4", time: "4 jam lalu" },
                { dot: "bg-blue-50 dark:bg-blue-900/200", title: "Audit Inventaris Selesai", sub: "Kategori: Obat - Tidak ada selisih", time: "Kemarin" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Distribusi Vendor</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Ringkasan sumber pasokan dan keandalan pengadaan.</p>
            <div className="space-y-3">
              {[["Medline Industries", "bg-[#0D5A94]", "45%"], ["Patterson Dental", "bg-[#006b57]", "30%"], ["Lainnya", "bg-slate-200", "25%"]].map(([name, color, pct]) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{pct}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAB Scan */}
      <button
        onClick={() => alert("Fitur scan barcode akan segera hadir.")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#0D5A94] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50"
        title="Scan Barcode"
      >
        <ScanLine className="h-6 w-6" />
      </button>
    </div>
  );
}
