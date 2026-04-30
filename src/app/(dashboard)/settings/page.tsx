"use client";

import { PlusCircle, Activity, TrendingUp, Grid, Clock, Filter, Download, Edit, Trash2, Upload, Percent, RefreshCw, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-7xl mx-auto">
      {/* ── Page Actions Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94]">Master Data Layanan</h2>
          <p className="text-slate-500 mt-1">Kelola daftar layanan klinik, strategi harga, dan deskripsi prosedur.</p>
        </div>
        <Button className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold shadow-lg shadow-blue-900/10 gap-2 h-11 px-6">
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
            <p className="text-3xl font-extrabold text-slate-900 mt-1">42</p>
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
              <Grid className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">8</p>
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
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <div className="flex gap-4 overflow-x-auto w-full sm:w-auto hide-scrollbar">
            <button className="text-sm font-bold text-[#0D5A94] border-b-2 border-[#0D5A94] pb-1 px-1 whitespace-nowrap">Semua Layanan</button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors pb-1 px-1 whitespace-nowrap">Diagnostik</button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors pb-1 px-1 whitespace-nowrap">Preventif</button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors pb-1 px-1 whitespace-nowrap">Bedah</button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
              {/* Row 1 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">Konsultasi Awal</div>
                  <div className="text-[10px] text-[#0D5A94] font-bold mt-0.5">KODE: CNS-001</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-[#0D5A94] text-xs font-bold rounded-full">Diagnostik</span>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-xs text-slate-600 line-clamp-1">Pemeriksaan rongga mulut secara menyeluruh termasuk ulasan riwayat kesehatan.</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">Rp 150.000</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 bg-green-50 text-[#006b57] text-[10px] font-bold rounded-full border border-green-100">AKTIF</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">Rontgen Digital (Full Mouth)</div>
                  <div className="text-[10px] text-[#0D5A94] font-bold mt-0.5">KODE: RAD-012</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-[#0D5A94] text-xs font-bold rounded-full">Radiologi</span>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-xs text-slate-600 line-clamp-1">Satu set radiografi digital penuh untuk diagnosis detail struktur gigi yang tersembunyi.</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">Rp 250.000</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 bg-green-50 text-[#006b57] text-[10px] font-bold rounded-full border border-green-100">AKTIF</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">Scaling Profesional</div>
                  <div className="text-[10px] text-[#0D5A94] font-bold mt-0.5">KODE: PRV-005</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-[#0D5A94] text-xs font-bold rounded-full">Preventif</span>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-xs text-slate-600 line-clamp-1">Pembersihan karang gigi, plak, dan noda dari permukaan gigi.</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">Rp 300.000</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 bg-green-50 text-[#006b57] text-[10px] font-bold rounded-full border border-green-100">AKTIF</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">Ekstraksi Gigi Bungsu</div>
                  <div className="text-[10px] text-[#0D5A94] font-bold mt-0.5">KODE: SUR-009</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-[#0D5A94] text-xs font-bold rounded-full">Bedah</span>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-xs text-slate-600 line-clamp-1">Pencabutan bedah gigi bungsu yang impaksi di bawah anestesi lokal.</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">Rp 1.500.000</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200">NONAKTIF</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Menampilkan 4 dari 42 layanan</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" disabled>Sebelumnya</Button>
            <Button className="h-8 w-8 bg-[#0D5A94] hover:bg-[#0D5A94] text-white text-xs font-bold p-0">1</Button>
            <Button variant="outline" className="h-8 w-8 text-slate-600 text-xs font-bold p-0">2</Button>
            <Button variant="outline" className="h-8 w-8 text-slate-600 text-xs font-bold p-0">3</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">Selanjutnya</Button>
          </div>
        </div>
      </Card>

      {/* ── Management Section (Asymmetric / Glassmorphism Concept) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0D5A94] to-[#004271] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-md">
            <h4 className="text-3xl font-extrabold mb-4">Pricing Analytics</h4>
            <p className="text-blue-100 text-sm mb-8 opacity-90 leading-relaxed">
              Tinjau bagaimana tarif layanan Anda dibandingkan dengan tolok ukur klinis sekitar dan optimalkan siklus pendapatan klinik Anda.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-[#0D5A94] hover:bg-blue-50 font-bold px-6">Lihat Laporan</Button>
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white font-bold backdrop-blur-sm px-6">Benchmarks</Button>
            </div>
          </div>
          {/* Decorative background element */}
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
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 8.75L7.5 5L3.75 1.25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <Percent className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-slate-700 text-sm">Kelola Aturan Pajak</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 8.75L7.5 5L3.75 1.25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold text-slate-700 text-sm">Pembaruan Harga Massal</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 8.75L7.5 5L3.75 1.25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
