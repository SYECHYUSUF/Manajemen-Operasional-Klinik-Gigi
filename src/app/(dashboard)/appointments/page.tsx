"use client";

import { ChevronLeft, ChevronRight, Filter, MoreVertical, Clock, CheckCircle, XCircle, AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppointmentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94]">Jadwal & Janji Temu</h2>
          <p className="text-slate-500 text-lg">Kelola prosedur dan konsultasi harian dokter.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <Button variant="ghost" className="px-4 py-2 h-auto text-sm font-semibold rounded bg-[#0D5A94] text-white hover:bg-[#004271] hover:text-white">Harian</Button>
          <Button variant="ghost" className="px-4 py-2 h-auto text-sm font-semibold rounded text-slate-500 hover:bg-slate-50">Mingguan</Button>
          <Button variant="ghost" className="px-4 py-2 h-auto text-sm font-semibold rounded text-slate-500 hover:bg-slate-50">Bulanan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Sidebar (Calendar & Doctors) ── */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          
          {/* Mini Calendar */}
          <Card className="border-slate-200 shadow-sm shadow-blue-900/5">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-[#0D5A94]">Oktober 2024</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-4 text-center">
                {['M','S','S','R','K','J','S'].map((day, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-400">{day}</span>
                ))}
                {/* Dummy Dates */}
                <span className="text-xs text-slate-300">29</span>
                <span className="text-xs text-slate-300">30</span>
                {[1,2,3,4,5,6,7,8,9].map(d => (
                  <span key={d} className="text-xs font-medium">{d}</span>
                ))}
                <span className="text-xs font-medium bg-[#0D5A94] text-white w-6 h-6 flex items-center justify-center rounded-full mx-auto">10</span>
                {[11,12].map(d => (
                  <span key={d} className="text-xs font-medium">{d}</span>
                ))}
              </div>
            </div>
          </Card>

          {/* Doctors List */}
          <Card className="border-slate-200 shadow-sm shadow-blue-900/5 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dokter Tersedia</h3>
            </div>
            <div className="p-2 space-y-1">
              <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarFallback className="bg-blue-200 text-blue-700">SW</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-[#0D5A94]">drg. Sarah Wilson</p>
                  <span className="text-[10px] text-[#00725d] bg-[#76f9d6]/30 px-1.5 py-0.5 rounded inline-block mt-0.5 font-semibold">Ortodonti</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarFallback className="bg-slate-200 text-slate-600">JC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-slate-700">drg. James Carter</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Periodonsi</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarFallback className="bg-slate-200 text-slate-600">EC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-slate-700">drg. Emily Chen</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Konservasi Gigi</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Main Calendar Schedule ── */}
        <div className="col-span-1 lg:col-span-9">
          <Card className="border-slate-200 shadow-sm shadow-blue-900/5 flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-200px)]">
            {/* Calendar Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-[#0D5A94]">Kamis, 10 Oktober</h3>
                <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Hari Ini</div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 mr-4 flex-wrap">
                  <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></span><span className="text-[11px] font-medium text-slate-500">Dikonfirmasi</span></div>
                  <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 ml-2"></span><span className="text-[11px] font-medium text-slate-500">Selesai</span></div>
                  <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5 ml-2"></span><span className="text-[11px] font-medium text-slate-500">Batal</span></div>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 text-slate-400 shrink-0"><Filter className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8 text-slate-400 shrink-0"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Timetable Body */}
            <div className="flex-1 overflow-y-auto relative">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 sticky top-0 z-10">
                    <th className="w-24 p-3 border-b border-r border-slate-100 text-xs font-bold text-slate-400 text-center uppercase tracking-wider">Waktu</th>
                    <th className="p-3 border-b border-slate-100 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Jadwal Pemeriksaan</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 08:00 */}
                  <tr>
                    <td className="p-4 border-b border-r border-slate-100 text-center align-top bg-white">
                      <span className="text-xs font-bold text-slate-600">08:00</span>
                    </td>
                    <td className="p-2 border-b border-slate-100 relative h-28 bg-white">
                      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 w-11/12 sm:w-[70%] absolute top-2 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-blue-900">Budi Santoso</h4>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Dikonfirmasi</span>
                        </div>
                        <p className="text-xs text-blue-800 font-medium">Pemeriksaan Rutin & Pembersihan Karang</p>
                        <div className="flex items-center gap-1.5 mt-2.5 text-blue-600">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-[11px] font-medium">08:00 - 08:45 WIB</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* 09:00 */}
                  <tr>
                    <td className="p-4 border-b border-r border-slate-100 text-center align-top bg-white">
                      <span className="text-xs font-bold text-slate-600">09:00</span>
                    </td>
                    <td className="p-2 border-b border-slate-100 relative h-28 bg-white">
                      <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-3 w-10/12 sm:w-[60%] absolute top-2 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-emerald-900">Siti Rahayu</h4>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">Selesai</span>
                        </div>
                        <p className="text-xs text-emerald-800 font-medium">Perawatan Saluran Akar (Sesi 2)</p>
                        <div className="flex items-center gap-1.5 mt-2.5 text-emerald-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span className="text-[11px] font-medium">09:00 - 10:00 WIB</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* 10:00 */}
                  <tr>
                    <td className="p-4 border-b border-r border-slate-100 text-center align-top bg-white">
                      <span className="text-xs font-bold text-slate-600">10:00</span>
                    </td>
                    <td className="p-2 border-b border-slate-100 h-28 group transition-colors bg-white">
                      <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-200 rounded-lg group-hover:border-[#0D5A94] group-hover:bg-blue-50/50 cursor-pointer transition-all">
                        <span className="text-slate-400 group-hover:text-[#0D5A94] text-sm font-semibold flex items-center gap-2">
                          <Plus className="h-4 w-4" /> Slot Kosong
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* 11:00 */}
                  <tr>
                    <td className="p-4 border-b border-r border-slate-100 text-center align-top bg-white">
                      <span className="text-xs font-bold text-slate-600">11:00</span>
                    </td>
                    <td className="p-2 border-b border-slate-100 relative h-28 bg-white">
                      <div className="bg-rose-50 border-l-4 border-rose-500 rounded-lg p-3 w-8/12 sm:w-[50%] absolute top-2 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-rose-900">Dewi Permata</h4>
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">Batal</span>
                        </div>
                        <p className="text-xs text-rose-800 font-medium">Penyesuaian Kawat Gigi</p>
                        <div className="flex items-center gap-1.5 mt-2.5 text-rose-600">
                          <XCircle className="h-3.5 w-3.5" />
                          <span className="text-[11px] font-medium">11:00 - 11:30 WIB</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* 12:00 */}
                  <tr>
                    <td className="p-4 border-b border-r border-slate-100 text-center align-top bg-slate-50">
                      <span className="text-xs font-bold text-slate-500">12:00</span>
                    </td>
                    <td className="p-2 border-b border-slate-100 bg-slate-50/80 text-center h-16">
                      <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Istirahat Siang</span>
                    </td>
                  </tr>

                  {/* 13:00 */}
                  <tr>
                    <td className="p-4 border-b border-r border-slate-100 text-center align-top bg-white">
                      <span className="text-xs font-bold text-slate-600">13:00</span>
                    </td>
                    <td className="p-2 border-b border-slate-100 relative h-28 bg-white">
                      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 w-full sm:w-[80%] absolute top-2 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-blue-900">Ahmad Fauzi</h4>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Dikonfirmasi</span>
                        </div>
                        <p className="text-xs text-blue-800 font-medium">Ekstraksi Gigi Bungsu</p>
                        <div className="flex items-center gap-1.5 mt-2.5 text-blue-600">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span className="text-[11px] font-medium">13:00 - 14:30 WIB • Bedah</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Button for mobile/quick book */}
      <button className="fixed bottom-8 right-8 bg-[#0D5A94] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/30 hover:bg-[#004271] hover:scale-105 active:scale-95 transition-all duration-200 group z-50">
        <Plus className="h-6 w-6" />
        <span className="absolute right-16 bg-[#0D5A94] text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity font-bold shadow-md pointer-events-none">Buat Janji</span>
      </button>
    </div>
  );
}
