"use client";

import { useState } from "react";
import { Search, Filter, Download, Plus, MoreVertical, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockPatients } from "@/lib/mock-data";
import { formatDateShort, getInitials } from "@/lib/utils";
import { Patient } from "@/types";
import { useTable } from "@/hooks/use-table";
import { PatientFormDialog } from "@/components/features/patients/patient-form-dialog";

export default function PatientsPage() {
  const {
    query, setQuery,
    rows: patients,
    page, setPage, totalPages,
    totalRows
  } = useTable<Patient>({
    data: mockPatients,
    searchKeys: ["full_name", "patient_code", "phone"],
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D5A94]">Manajemen Pasien</h2>
          <p className="text-slate-500">Kelola dan lacak seluruh rekam medis pasien di satu tempat.</p>
        </div>
        <Button className="bg-[#0D5A94] hover:bg-[#004271] text-white" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Pasien Baru
        </Button>
      </div>

      {/* ── Stats Bento ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pasien", value: "1,284", icon: "👥", bg: "bg-blue-50", color: "text-[#0D5A94]" },
          { label: "Baru Bulan Ini", value: "42", icon: "📈", bg: "bg-green-50", color: "text-green-600" },
          { label: "Kasus Aktif", value: "156", icon: "⏳", bg: "bg-orange-50", color: "text-orange-600" },
          { label: "Selesai", value: "89%", icon: "✅", bg: "bg-purple-50", color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-slate-100 shadow-sm shadow-slate-200/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Table Card ── */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-800">Direktori Pasien</h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Semua Pasien</Badge>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari ID, Nama, atau No. HP..." 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-9 bg-white" 
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0" title="Filter">
              <Filter className="h-4 w-4 text-slate-500" />
            </Button>
            <Button variant="outline" size="icon" className="shrink-0" title="Export">
              <Download className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">ID Pasien</th>
                <th className="px-6 py-4 font-bold tracking-wider">Nama Pasien</th>
                <th className="px-6 py-4 font-bold tracking-wider">No. HP</th>
                <th className="px-6 py-4 font-bold tracking-wider">Tgl Daftar</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patients.length > 0 ? patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-[#0D5A94]">{patient.patient_code}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-100">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
                          {getInitials(patient.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-800">{patient.full_name}</p>
                        {patient.email && <p className="text-xs text-slate-400">{patient.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{patient.phone || "-"}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDateShort(patient.registered_at)}</td>
                  <td className="px-6 py-4">
                    <Badge className={patient.is_active ? "bg-green-50 text-green-700 hover:bg-green-50" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
                      {patient.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-[#0D5A94]">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Lihat Profil</DropdownMenuItem>
                        <DropdownMenuItem>Rekam Medis</DropdownMenuItem>
                        <DropdownMenuItem>Buat Janji Temu</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada pasien ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Menampilkan {patients.length} dari {totalRows} pasien
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm font-medium">{page}</span>
              <span className="text-xs text-slate-400">/ {totalPages}</span>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Promo Area ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-[#0D5A94] p-8 text-white flex flex-col justify-center min-h-[200px]">
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">Automated Check-ups</h4>
            <p className="text-sm text-blue-100 max-w-sm mb-6 leading-relaxed">
              Jadwalkan pengingat pembersihan karang gigi otomatis untuk pasien yang belum berkunjung lebih dari 6 bulan.
            </p>
            <Button className="bg-white text-[#0D5A94] hover:bg-slate-50 font-bold">Mulai Kampanye</Button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 flex flex-col justify-center min-h-[200px]">
          <h4 className="text-xl font-bold text-[#0D5A94] mb-2">Dental Intelligence</h4>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Alat diagnostik AI baru kami dapat membantu menganalisis X-ray digital untuk menemukan karies tahap awal dengan akurasi 98%.
          </p>
          <a href="#" className="text-[#0D5A94] font-bold text-sm hover:underline inline-flex items-center gap-1">
            Pelajari fitur AI <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <PatientFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
