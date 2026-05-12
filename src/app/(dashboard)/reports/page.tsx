"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, Users, CalendarCheck,
  Package, Download, ChevronDown, BarChart3, Activity,
  FileText, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Data Demo ────────────────────────────────────────────────────────────────
const MONTHLY = [
  { bulan: "Nov", pendapatan: 18200000, pasien: 42, janji: 38 },
  { bulan: "Des", pendapatan: 21500000, pasien: 51, janji: 47 },
  { bulan: "Jan", pendapatan: 19800000, pasien: 45, janji: 41 },
  { bulan: "Feb", pendapatan: 24100000, pasien: 58, janji: 54 },
  { bulan: "Mar", pendapatan: 22700000, pasien: 53, janji: 49 },
  { bulan: "Apr", pendapatan: 27350000, pasien: 64, janji: 60 },
];

const LAYANAN_TERATAS = [
  { nama: "Behel / Ortodonsi", jumlah: 38, pendapatan: 11400000, tren: "naik" },
  { nama: "Scaling & Polishing", jumlah: 52, pendapatan: 7800000, tren: "naik" },
  { nama: "Tambal Gigi",         jumlah: 41, pendapatan: 4100000, tren: "turun" },
  { nama: "Cabut Gigi",          jumlah: 29, pendapatan: 2900000, tren: "naik" },
  { nama: "Pemutihan Gigi",      jumlah: 17, pendapatan: 5100000, tren: "turun" },
];

const TRANSAKSI_TERBARU = [
  { id: "INV-0061", pasien: "Budi Santoso",    layanan: "Behel",   jumlah: 3500000,  status: "lunas",   tgl: "01 Mei 2026" },
  { id: "INV-0060", pasien: "Siti Rahayu",     layanan: "Scaling", jumlah: 150000,   status: "lunas",   tgl: "01 Mei 2026" },
  { id: "INV-0059", pasien: "Ahmad Fauzi",     layanan: "Tambal",  jumlah: 200000,   status: "pending", tgl: "30 Apr 2026" },
  { id: "INV-0058", pasien: "Dewi Lestari",    layanan: "Cabut",   jumlah: 100000,   status: "lunas",   tgl: "30 Apr 2026" },
  { id: "INV-0057", pasien: "Rizky Pratama",   layanan: "Bleach",  jumlah: 1500000,  status: "lunas",   tgl: "29 Apr 2026" },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Bar Chart sederhana (SVG) ────────────────────────────────────────────────
function BarChart({ data }: { data: typeof MONTHLY }) {
  const max = Math.max(...data.map(d => d.pendapatan));
  const H = 120;
  const W = 100 / data.length;
  return (
    <div className="flex items-end gap-1 h-32 w-full px-2">
      {data.map((d, i) => {
        const pct = (d.pendapatan / max) * H;
        const isLast = i === data.length - 1;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-1">
            <div className="relative group w-full flex justify-center">
              <div
                className={`w-full max-w-[32px] rounded-t-lg transition-all duration-300 ${isLast ? "bg-[#0D5A94]" : "bg-slate-200 dark:bg-slate-700 group-hover:bg-[#0D5A94]/60"}`}
                style={{ height: `${pct}px` }}
              />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                {formatRupiah(d.pendapatan)}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{d.bulan}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Line mini ────────────────────────────────────────────────────────────────
function SparkLine({ data, color = "#0D5A94" }: { data: number[]; color?: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const norm = (v: number) => ((v - min) / (max - min || 1)) * 30;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 80},${32 - norm(v)}`).join(" ");
  return (
    <svg viewBox="0 0 80 34" className="w-16 h-8">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────
const PERIODE = ["Bulan Ini", "3 Bulan", "6 Bulan", "Tahun Ini"];

export default function LaporanPage() {
  const [periode, setPeriode] = useState("Bulan Ini");
  const [showPeriode, setShowPeriode] = useState(false);

  const bulan = MONTHLY[MONTHLY.length - 1];
  const bulanLalu = MONTHLY[MONTHLY.length - 2];
  const selisihPendapatan = ((bulan.pendapatan - bulanLalu.pendapatan) / bulanLalu.pendapatan * 100).toFixed(1);
  const selisihPasien = bulan.pasien - bulanLalu.pasien;

  const handleEkspor = () => {
    const rows = [
      ["No. Invoice", "Pasien", "Layanan", "Jumlah", "Status", "Tanggal"],
      ...TRANSAKSI_TERBARU.map(t => [t.id, t.pasien, t.layanan, t.jumlah, t.status, t.tgl]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `laporan-klinik-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94] dark:text-blue-400">Laporan Klinik</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Ringkasan kinerja keuangan dan operasional klinik.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Periode selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriode(v => !v)}
              className="flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800 transition-colors"
            >
              {periode}<ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {showPeriode && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-20 py-1 overflow-hidden">
                {PERIODE.map(p => (
                  <button key={p} onClick={() => { setPeriode(p); setShowPeriode(false); }}
                    className={`w-full px-4 py-2 text-sm text-left transition-colors ${periode === p ? "bg-[#0D5A94]/10 text-[#0D5A94] dark:text-blue-400 font-bold" : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800"}`}
                  >{p}</button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleEkspor} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold gap-2">
            <Download className="h-4 w-4" /> Ekspor CSV
          </Button>
        </div>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            judul: "Pendapatan Bulan Ini", nilai: formatRupiah(bulan.pendapatan),
            naik: parseFloat(selisihPendapatan) >= 0, selisih: `${Math.abs(parseFloat(selisihPendapatan))}%`,
            icon: DollarSign, warna: "text-[#0D5A94] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
            spark: MONTHLY.map(m => m.pendapatan),
          },
          {
            judul: "Total Pasien", nilai: bulan.pasien,
            naik: selisihPasien >= 0, selisih: `${Math.abs(selisihPasien)} pasien`,
            icon: Users, warna: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
            spark: MONTHLY.map(m => m.pasien),
          },
          {
            judul: "Janji Temu Selesai", nilai: bulan.janji,
            naik: true, selisih: `${bulan.janji - bulanLalu.janji} janji`,
            icon: CalendarCheck, warna: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
            spark: MONTHLY.map(m => m.janji),
          },
          {
            judul: "Tagihan Pending", nilai: "3",
            naik: false, selisih: "Perlu ditindak",
            icon: AlertTriangle, warna: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
            spark: [5, 3, 7, 4, 6, 3],
          },
        ].map((s, i) => (
          <Card key={i} className="border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.warna}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <SparkLine data={s.spark} color={s.naik ? "#0D5A94" : "#f59e0b"} />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.judul}</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{s.nilai}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${s.naik ? "text-emerald-600" : "text-red-500"}`}>
                {s.naik ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {s.selisih} vs bulan lalu
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grafik Pendapatan */}
        <div className="lg:col-span-2">
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Grafik Pendapatan</h3>
                  <p className="text-xs text-slate-400 mt-0.5">6 bulan terakhir</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-sm bg-[#0D5A94] inline-block" /> Bulan Ini
                  <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700 inline-block ml-2" /> Sebelumnya
                </div>
              </div>
              <BarChart data={MONTHLY} />
              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                {[
                  { label: "Total 6 Bulan", nilai: formatRupiah(MONTHLY.reduce((a, b) => a + b.pendapatan, 0)) },
                  { label: "Rata-rata/Bulan", nilai: formatRupiah(Math.round(MONTHLY.reduce((a, b) => a + b.pendapatan, 0) / MONTHLY.length)) },
                  { label: "Bulan Terbaik", nilai: "Februari" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{s.nilai}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Layanan Teratas */}
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-5">Layanan Terpopuler</h3>
            <div className="space-y-4">
              {LAYANAN_TERATAS.map((l, i) => {
                const max = LAYANAN_TERATAS[0].jumlah;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center justify-center">{i + 1}</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-white">{l.nama}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {l.tren === "naik"
                          ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          : <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
                        <span className="text-xs text-slate-500 dark:text-slate-400">{l.jumlah}x</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-[#0D5A94] to-[#76f9d6] transition-all duration-700"
                        style={{ width: `${(l.jumlah / max) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{formatRupiah(l.pendapatan)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Transaksi Terbaru */}
      <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#0D5A94] dark:text-blue-400" />
            <h3 className="font-bold text-slate-800 dark:text-white">Transaksi Terbaru</h3>
          </div>
          <span className="text-xs text-slate-400">{TRANSAKSI_TERBARU.length} transaksi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                {["No. Invoice", "Pasien", "Layanan", "Jumlah", "Status", "Tanggal"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {TRANSAKSI_TERBARU.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/50 transition-colors even:bg-slate-50 dark:bg-slate-800 dark:even:bg-slate-800">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#0D5A94] dark:text-blue-400">{t.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">{t.pasien}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{t.layanan}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{formatRupiah(t.jumlah)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      t.status === "lunas"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 border-amber-200"
                    }`}>
                      {t.status === "lunas" ? "Lunas" : "Tertunda"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{t.tgl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showPeriode && <div className="fixed inset-0 z-10" onClick={() => setShowPeriode(false)} />}
    </div>
  );
}
