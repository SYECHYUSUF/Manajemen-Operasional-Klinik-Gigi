"use client";

import { RefreshCw, PlusCircle, Package, AlertTriangle, AlertCircle, DollarSign, Filter, Download, MoreVertical, Search, ScanLine, ChevronLeft, ChevronRight, Activity, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export default function InventoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-[1440px] mx-auto">
      {/* ── Header Section ── */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="hover:text-[#0D5A94] cursor-pointer transition-colors">Dashboard</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#0D5A94] font-semibold">Manajemen Inventaris</span>
          </nav>
          <h2 className="text-3xl font-extrabold text-[#004271]">Manajemen Inventaris</h2>
          <p className="text-slate-500 mt-1">Pantau stok bahan klinis dan farmasi secara real-time.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-2 border-[#006b57] text-[#006b57] font-bold hover:bg-[#006b57]/5 gap-2">
            <RefreshCw className="h-4 w-4" /> Restock
          </Button>
          <Button className="flex-1 md:flex-none bg-[#0D5A94] hover:bg-[#004271] text-white font-bold shadow-lg shadow-blue-900/20 gap-2">
            <PlusCircle className="h-4 w-4" /> Tambah Produk
          </Button>
        </div>
      </div>

      {/* ── Bento Grid Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#0D5A94]">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+2.4%</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Produk</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">1,248</h3>
            <p className="text-[10px] text-slate-400 mt-2">Dari 12 kategori</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">Perhatian</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Stok Menipis</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">14</h3>
            <p className="text-[10px] text-slate-400 mt-2">Perlu segera restock</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Kritis</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Stok Habis</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">3</h3>
            <p className="text-[10px] text-slate-400 mt-2">Komposit, Kasa steril</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0D5A94] border-transparent shadow-xl shadow-blue-900/10 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Nilai Inventaris</p>
            <h3 className="text-2xl font-black mt-1">{formatCurrency(425000000)}</h3>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#76f9d6] w-3/4 h-full rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Inventory Table Card ── */}
      <Card className="border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">Katalog Produk</h3>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
              <Button variant="ghost" className="px-4 py-1.5 h-auto text-xs font-bold bg-[#0D5A94] text-white hover:bg-[#004271] hover:text-white rounded-none">Semua</Button>
              <Button variant="ghost" className="px-4 py-1.5 h-auto text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-none border-l border-slate-200">Obat</Button>
              <Button variant="ghost" className="px-4 py-1.5 h-auto text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-none border-l border-slate-200">Alat</Button>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 mr-2">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Cari barang, SKU..." className="pl-9 h-9 text-sm rounded-full bg-white" />
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#0D5A94] shrink-0 h-9 w-9">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#0D5A94] shrink-0 h-9 w-9">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Nama Produk</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Stok</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Unit</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* Item 1 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Amoxicillin 500mg</p>
                      <p className="text-[10px] text-slate-400">SKU: PH-AMX-500</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-purple-50 text-purple-600 uppercase">Obat</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="font-black text-slate-900">450</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-500 text-xs font-medium">Box</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#76f9d6]/20 text-[#00725d] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006b57]"></span>
                    Tersedia
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
              {/* Item 2 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Sterile Latex Gloves (M)</p>
                      <p className="text-[10px] text-slate-400">SKU: EQ-GLV-LAT-M</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">Alat</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="font-black text-slate-900">12</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-500 text-xs font-medium">Box</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-orange-100 text-orange-700 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Stok Menipis
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <p className="text-xs text-slate-500 font-medium">Menampilkan <span className="text-slate-900 font-bold">1 - 5</span> dari 248 produk</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 text-slate-400"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" className="h-8 w-8 bg-[#0D5A94] text-white hover:bg-[#0D5A94] text-xs font-bold p-0">1</Button>
            <Button variant="ghost" className="h-8 w-8 text-slate-500 text-xs font-bold p-0">2</Button>
            <Button variant="ghost" className="h-8 w-8 text-slate-500 text-xs font-bold p-0">3</Button>
            <Button variant="outline" size="icon" className="h-8 w-8 text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>

      {/* ── Secondary Info Section ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pergerakan Stok Terakhir</h4>
              <Button variant="link" className="text-xs text-[#0D5A94] font-bold p-0 h-auto">Lihat Semua</Button>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Stok Masuk: Amoxicillin 500mg</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">+200 Box oleh Admin Sarah</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">2 jam lalu</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Stok Keluar: Sterile Latex Gloves</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">-5 Box untuk Ruang Operasi 4</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">4 jam lalu</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Audit Inventaris Selesai</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Kategori: Obat - Tidak ada selisih</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">Kemarin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm relative overflow-hidden">
          <CardContent className="p-6 relative z-10">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Distribusi Vendor</h4>
            <p className="text-xs text-slate-500 mb-6">Ringkasan sumber pasokan dan keandalan pengadaan.</p>
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-slate-100" cx="64" cy="64" fill="transparent" r="50" stroke="currentColor" strokeWidth="12"></circle>
                  <circle className="text-[#0D5A94]" cx="64" cy="64" fill="transparent" r="50" stroke="currentColor" strokeDasharray="314" strokeDashoffset="100" strokeWidth="12"></circle>
                  <circle className="text-[#006b57]" cx="64" cy="64" fill="transparent" r="50" stroke="currentColor" strokeDasharray="314" strokeDashoffset="240" strokeWidth="12"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">12</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Vendor</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0D5A94]"></div>
                    <span className="text-xs font-medium text-slate-600">Medline Industries</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#006b57]"></div>
                    <span className="text-xs font-medium text-slate-600">Patterson Dental</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    <span className="text-xs font-medium text-slate-600">Lainnya</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">25%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0D5A94] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <ScanLine className="h-6 w-6" />
      </button>
    </div>
  );
}
