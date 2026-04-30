"use client";

import { CreditCard, Download, FileText, Filter, PlusCircle, Search, DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export default function BillingPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-[1440px] mx-auto">
      {/* ── Page Actions Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94]">Kasir & Pembayaran</h2>
          <p className="text-slate-500 mt-1">Kelola transaksi pasien, faktur (invoices), dan laporan pendapatan klinik.</p>
        </div>
        <Button className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold shadow-lg shadow-blue-900/10 gap-2 h-11 px-6">
          <PlusCircle className="h-5 w-5" /> Buat Tagihan Baru
        </Button>
      </div>

      {/* ── Financial Dashboard Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="bg-[#0D5A94] border-transparent shadow-xl shadow-blue-900/10 text-white relative overflow-hidden">
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white bg-[#76f9d6]/20 px-2 py-1 rounded flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> 12.5%
              </span>
            </div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Pendapatan (Bulan Ini)</p>
            <h3 className="text-3xl font-black mt-1">{formatCurrency(124500000)}</h3>
          </CardContent>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </Card>

        {/* Outstanding Invoices */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Belum Dibayar</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{formatCurrency(18250000)}</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Dari 15 tagihan aktif</p>
          </CardContent>
        </Card>

        {/* Successful Transactions */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#76f9d6]/20 text-[#006b57] rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Transaksi Berhasil</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">142</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Pasien dalam 30 hari terakhir</p>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3" /> 4.2%
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pengeluaran Operasional</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{formatCurrency(32100000)}</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Pembelian inventaris & gaji</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Invoices Data Table ── */}
      <Card className="border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">Daftar Tagihan (Invoices)</h3>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
              <Button variant="ghost" className="px-4 py-1.5 h-auto text-xs font-bold bg-[#0D5A94] text-white hover:bg-[#004271] hover:text-white rounded-none">Semua</Button>
              <Button variant="ghost" className="px-4 py-1.5 h-auto text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-none border-l border-slate-200">Lunas</Button>
              <Button variant="ghost" className="px-4 py-1.5 h-auto text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-none border-l border-slate-200">Pending</Button>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 mr-2">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Cari nama pasien, no. invoice..." className="pl-9 h-9 text-sm rounded-full bg-white" />
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
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">No. Invoice</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Pasien</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* Row 1 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 font-mono">INV-20231001</div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">Budi Santoso</p>
                  <p className="text-[10px] text-slate-400">Pembersihan Karang Gigi</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 font-medium text-xs">10 Okt 2023</span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{formatCurrency(350000)}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#76f9d6]/20 text-[#00725d] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006b57]"></span> Lunas
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><FileText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><Download className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 font-mono">INV-20231002</div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">Siti Rahayu</p>
                  <p className="text-[10px] text-slate-400">Perawatan Saluran Akar</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 font-medium text-xs">10 Okt 2023</span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{formatCurrency(1250000)}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><FileText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><Download className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 font-mono">INV-20230945</div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">Ahmad Fauzi</p>
                  <p className="text-[10px] text-slate-400">Ekstraksi Gigi</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 font-medium text-xs">08 Okt 2023</span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{formatCurrency(450000)}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#76f9d6]/20 text-[#00725d] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006b57]"></span> Lunas
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><FileText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0D5A94]"><Download className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
