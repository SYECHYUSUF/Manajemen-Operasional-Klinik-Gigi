"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, CalendarIcon, Users, AlertTriangle, DollarSign, MoreVertical, Settings, Banknote, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatTime, getInitials, formatCurrency } from "@/lib/utils";
import { APPOINTMENT_STATUS_MAP } from "@/constants";
import { apiFetch } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    monthlyRevenue: 0,
    criticalStock: 0,
    completedToday: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<{ name: string; qty: number; unit: string; urgent: boolean }[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Fetch patients count
        type Patient = { id: string };
        const patients = await apiFetch<Patient[]>('/patients').catch(() => []);
        const totalPatients = patients.length;

        // Fetch invoices untuk hitung pendapatan bulan ini
        type Invoice = { total_amount: string; status: string; issued_at: string };
        const invoices = await apiFetch<Invoice[]>('/invoices').catch(() => []);
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthlyRevenue = invoices
          .filter(inv => inv.status === 'paid' && new Date(inv.issued_at) >= startOfMonth)
          .reduce((sum, inv) => sum + Number(inv.total_amount), 0);

        // Fetch products untuk low stock
        type Product = { name: string; stock_quantity: number; minimum_stock: number; unit: string; is_active: boolean };
        const products = await apiFetch<Product[]>('/products').catch(() => []);
        const lowStock = products
          .filter(p => p.is_active && p.stock_quantity <= p.minimum_stock)
          .sort((a, b) => a.stock_quantity - b.stock_quantity)
          .slice(0, 5);
        const mappedLowStock = lowStock.map(p => ({
          name: p.name,
          qty: p.stock_quantity,
          unit: `${p.unit} tersisa`,
          urgent: p.stock_quantity === 0 || p.stock_quantity < p.minimum_stock / 2,
        }));
        setLowStockItems(mappedLowStock);

        // Fetch appointments untuk jadwal hari ini dan recent
        type Apt = { id: string; scheduled_at: string; status: string; chief_complaint?: string; patient?: { full_name: string }; doctor?: { full_name: string } };
        const apts = await apiFetch<Apt[]>('/appointments').catch(() => []);
        const today = new Date();
        const todayApts = apts.filter(a => {
          const d = new Date(a.scheduled_at);
          return d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate();
        });
        const completedToday = todayApts.filter(a => a.status === 'completed').length;
        const recent = apts
          .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
          .slice(0, 4);
        setRecentAppointments(recent);

        setStats({
          totalPatients,
          monthlyRevenue,
          criticalStock: mappedLowStock.length,
          todayAppointments: todayApts.length,
          completedToday,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94] dark:text-blue-400">Ringkasan Klinik</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Selamat datang kembali. Berikut adalah ringkasan aktivitas di DentalCloud hari ini.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => router.push("/appointments")}
            className="flex-1 sm:flex-none bg-[#0D5A94] hover:bg-[#004271] text-white font-semibold gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Kelola Kalender
          </Button>
        </div>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[#0D5A94] dark:text-blue-400">
                <CalendarIcon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Janji Temu Hari Ini</p>
            <h3 className="text-3xl font-extrabold text-[#0D5A94] dark:text-blue-400">{stats.todayAppointments}</h3>
            <p className="text-xs text-slate-400 mt-2">{stats.completedToday} selesai, {stats.todayAppointments - stats.completedToday} menunggu</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-teal-50 rounded-lg text-[#006b57] dark:text-green-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Pasien</p>
            <h3 className="text-3xl font-extrabold text-[#0D5A94] dark:text-blue-400">{stats.totalPatients.toLocaleString("id-ID")}</h3>
            <p className="text-xs text-slate-400 mt-2">Rekam medis aktif</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-red-600 text-[11px] font-bold bg-red-50 px-2 py-1 rounded">
                Stok menipis
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Stok Kritis</p>
            <h3 className="text-3xl font-extrabold text-red-600">{stats.criticalStock}</h3>
            <p className="text-xs text-slate-400 mt-2">Barang di bawah batas aman</p>
          </CardContent>
        </Card>

      </div>

      {/* ── Bento Layout Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Appointments (Col 8) */}
        <Card className="col-span-1 lg:col-span-8 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-bold text-[#0D5A94] dark:text-blue-400">Janji Temu Terakhir</CardTitle>
              <p className="text-xs text-slate-400 mt-1">Tampilan langsung sesi saat ini dan yang akan datang</p>
            </div>
            <Button variant="link" onClick={() => router.push("/appointments")} className="text-[#0D5A94] dark:text-blue-400 font-bold">Lihat Semua</Button>
          </CardHeader>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="px-6 py-3">Pasien</th>
                  <th className="px-6 py-3">Prosedur</th>
                  <th className="px-6 py-3">Waktu</th>
                  <th className="px-6 py-3">Dokter</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      Belum ada jadwal janji temu
                    </td>
                  </tr>
                ) : recentAppointments.map((apt) => {
                  const statusInfo = APPOINTMENT_STATUS_MAP[apt.status as keyof typeof APPOINTMENT_STATUS_MAP] || { color: "text-slate-500 dark:text-slate-400", label: apt.status };
                  return (
                    <tr key={apt.id} className="hover:bg-teal-50/30 transition-colors even:bg-slate-50 dark:bg-slate-800 dark:even:bg-slate-800">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-blue-100 text-[#0D5A94] dark:text-blue-400">
                            <AvatarFallback className="text-[10px] font-bold bg-blue-100 text-[#0D5A94] dark:text-blue-400">
                              {getInitials(apt.patient?.full_name || "U K")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{apt.patient?.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{apt.chief_complaint || "-"}</td>
                      <td className="px-6 py-4 font-medium">{formatTime(apt.scheduled_at)}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{apt.doctor?.full_name?.split(",")[0].replace("drg. ", "Dr. ") || "Dokter"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${statusInfo.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:bg-slate-100 dark:bg-slate-800">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Side Panel (Col 4) */}
        <div className="col-span-1 lg:col-span-4 space-y-6">

          {/* Low Stock Alerts */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#0D5A94] dark:text-blue-400">Stok Menipis</h3>
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {stats.criticalStock} PERINGATAN
                </span>
              </div>
            </div>
            <CardContent className="p-6 pt-0 space-y-4">
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-3 flex items-center justify-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Semua stok dalam kondisi aman</p>
              ) : (
                lowStockItems.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-l-4 ${item.urgent ? 'border-red-500' : 'border-amber-400'}`}>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.qty} {item.unit}</p>
                    </div>
                    <Link href="/inventory">
                      <Button
                        variant="ghost"
                        className="text-[#0D5A94] dark:text-blue-400 text-[12px] font-bold hover:bg-white dark:bg-slate-900 px-2 py-1 h-auto transition-colors"
                      >
                        Kelola
                      </Button>
                    </Link>
                  </div>
                ))
              )}
              <Link href="/inventory">
                <Button
                  variant="outline"
                  className="w-full mt-4 border-[#0D5A94] text-[#0D5A94] dark:text-blue-400 hover:bg-[#0D5A94] hover:text-white transition-all font-bold"
                >
                  Kelola Inventaris
                </Button>
              </Link>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
}
