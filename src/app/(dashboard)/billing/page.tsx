"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CreditCard, Download, FileText, Filter, PlusCircle, Search,
  DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle,
  X, ChevronDown, User, Stethoscope, CheckSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// ─── Modal Buat Tagihan Baru ────────────────────────────────────────────────
function CreateInvoiceModal({ open, onClose, onSuccess }: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [patients, setPatients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    patient_id: "",
    service_ids: [] as string[],
    payment_method: "tunai",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!open) return;
    supabase.from("patients").select("id, full_name, patient_code").order("full_name").then(({ data }) => {
      if (data) setPatients(data);
    });
    supabase.from("services").select("id, name, base_price, code").eq("is_active", true).order("name").then(({ data }) => {
      if (data) setServices(data);
    });
  }, [open]);

  const selectedServices = services.filter(s => form.service_ids.includes(s.id));
  const totalAmount = selectedServices.reduce((sum, s) => sum + Number(s.base_price), 0);

  const toggleService = (id: string) => {
    setForm(prev => ({
      ...prev,
      service_ids: prev.service_ids.includes(id)
        ? prev.service_ids.filter(x => x !== id)
        : [...prev.service_ids, id],
    }));
  };

  const handleSubmit = async () => {
    if (!form.patient_id) { setToast("Pilih pasien terlebih dahulu!"); return; }
    if (form.service_ids.length === 0) { setToast("Pilih minimal 1 layanan!"); return; }
    setIsSaving(true);
    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const { error } = await supabase.from("invoices").insert({
        invoice_number: invoiceNumber,
        patient_id: form.patient_id,
        total_amount: totalAmount,
        status: "pending",
        issued_at: new Date().toISOString(),
        notes: form.notes || null,
      });
      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err: any) {
      setToast(err.message || "Gagal menyimpan tagihan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose}>
      <div

        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Buat Tagihan Baru</h2>
            <p className="text-xs text-slate-500 mt-0.5">Isi data pasien dan layanan yang diberikan</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {toast && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg flex items-center justify-between">
              {toast}
              <button onClick={() => setToast("")}><X className="h-4 w-4" /></button>
            </div>
          )}

          {/* Pilih Pasien */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              <User className="inline h-3.5 w-3.5 mr-1" /> Pasien
            </label>
            <select
              value={form.patient_id}
              onChange={e => setForm(p => ({ ...p, patient_id: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0D5A94]/30"
            >
              <option value="">-- Pilih Pasien --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.full_name} ({p.patient_code})</option>
              ))}
            </select>
          </div>

          {/* Pilih Layanan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              <Stethoscope className="inline h-3.5 w-3.5 mr-1" /> Layanan Diberikan
            </label>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
              {services.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Memuat layanan...</p>
              ) : services.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-colors text-left border-b border-slate-100 dark:border-slate-800 last:border-0 ${
                    form.service_ids.includes(s.id)
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.code}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#0D5A94]">{formatCurrency(s.base_price)}</span>
                    {form.service_ids.includes(s.id) && (
                      <CheckSquare className="h-4 w-4 text-[#0D5A94]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Metode Pembayaran
            </label>
            <div className="flex gap-2">
              {["tunai", "transfer", "kartu"].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, payment_method: m }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors capitalize ${
                    form.payment_method === m
                      ? "bg-[#0D5A94] text-white border-[#0D5A94]"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0D5A94]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Catatan (opsional)
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={2}
              placeholder="Tambahkan catatan untuk tagihan ini..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0D5A94]/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total</p>
            <p className="text-2xl font-black text-[#0D5A94]">{formatCurrency(totalAmount)}</p>
            <p className="text-[10px] text-slate-400">{form.service_ids.length} layanan dipilih</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="border-slate-200 text-slate-600">
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold px-6"
            >
              {isSaving ? "Menyimpan..." : "Simpan Tagihan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ──────────────────────────────────────────────────────────
export default function BillingPage() {
  const [activeStatus, setActiveStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from("invoices")
        .select("*, patients(full_name)")
        .order("issued_at", { ascending: false });
      if (data) setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const displayStatus = inv.status === "paid" ? "Lunas" : "Pending";
      const name = inv.patients?.full_name || "";
      const matchStatus = activeStatus === "Semua" || displayStatus === activeStatus;
      const matchSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.invoice_number || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [invoices, activeStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PER_PAGE));
  const pagedInvoices = filteredInvoices.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(() => {
    let revenue = 0, outstanding = 0, successfulCount = 0;
    invoices.forEach(inv => {
      if (inv.status === "paid") { revenue += Number(inv.total_amount || 0); successfulCount++; }
      else { outstanding += Number(inv.total_amount || 0); }
    });
    return { revenue, outstanding, successfulCount };
  }, [invoices]);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-[1440px] mx-auto">
      <CreateInvoiceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchInvoices}
      />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94]">Kasir & Pembayaran</h2>
          <p className="text-slate-500 mt-1">Kelola transaksi pasien, faktur, dan laporan pendapatan klinik.</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold shadow-lg shadow-blue-900/10 gap-2 h-11 px-6"
        >
          <PlusCircle className="h-5 w-5" /> Buat Tagihan Baru
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#0D5A94] border-transparent shadow-xl shadow-blue-900/10 text-white relative overflow-hidden">
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-500">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-300 bg-white/10 px-2 py-1 rounded flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> 12.5%
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pendapatan (Bulan Ini)</p>
            <h3 className="text-3xl font-black text-black mt-1">{formatCurrency(stats.revenue)}</h3>
          </CardContent>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Belum Dibayar</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{formatCurrency(stats.outstanding)}</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Dari {invoices.length - stats.successfulCount} tagihan aktif</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Transaksi Berhasil</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.successfulCount}</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Transaksi lunas</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="h-5 w-5" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pengeluaran Operasional</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{formatCurrency(32100000)}</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Pembelian inventaris & gaji</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabel Tagihan ── */}
      <Card className="border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider whitespace-nowrap">
              Daftar Tagihan
            </h3>
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
              {["Semua", "Lunas", "Pending"].map(status => (
                <Button
                  key={status}
                  variant="ghost"
                  onClick={() => { setActiveStatus(status); setPage(1); }}
                  className={`px-4 py-1.5 h-auto text-xs font-bold rounded-none ${
                    activeStatus === status
                      ? "bg-[#0D5A94] text-white hover:bg-[#004271] hover:text-white"
                      : "text-slate-500 hover:bg-slate-50 border-l border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64 mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari pasien, no. invoice..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-9 h-9 text-sm rounded-full bg-white dark:bg-slate-800"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const csv = ["No. Invoice,Pasien,Tanggal,Total,Status",
                  ...filteredInvoices.map(i =>
                    `${i.invoice_number},${i.patients?.full_name || ""},${formatDateShort(i.issued_at)},${i.total_amount},${i.status === "paid" ? "Lunas" : "Pending"}`
                  )].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "tagihan.csv"; a.click();
              }}
              className="text-slate-400 hover:text-[#0D5A94] shrink-0 h-9 w-9"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
              <tr>
                {["No. Invoice", "Pasien", "Tanggal", "Total", "Status", "Aksi"].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest ${i === 4 ? "text-center" : i === 5 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">Memuat data tagihan...</td></tr>
              ) : pagedInvoices.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">Tidak ada tagihan yang sesuai.</td></tr>
              ) : pagedInvoices.map(inv => {
                const isPaid = inv.status === "paid";
                return (
                  <tr key={inv.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white font-mono text-xs">{inv.invoice_number}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{inv.patients?.full_name || "—"}</p>
                      <p className="text-[10px] text-slate-400">Tindakan Medis</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{formatDateShort(inv.issued_at)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(inv.total_amount)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {isPaid ? "Lunas" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination — hanya tampil jika > 1 halaman */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Menampilkan {Math.min((page - 1) * PER_PAGE + 1, filteredInvoices.length)}–{Math.min(page * PER_PAGE, filteredInvoices.length)} dari {filteredInvoices.length} tagihan
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 text-xs font-bold p-0 ${page === p ? "bg-[#0D5A94] text-white hover:bg-[#004271]" : "bg-white dark:bg-slate-900 text-slate-600 border border-slate-200"}`}
                >
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-8 text-xs" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Selanjutnya</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
