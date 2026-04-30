"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Filter, MoreVertical, Clock,
  CheckCircle, XCircle, AlertTriangle, Plus, CalendarPlus, X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppointmentFormDialog } from "@/components/features/appointments/appointment-form-dialog";

// ─── Helpers ──────────────────────────────────────────────────────────────
const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS_ID   = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const DAY_HEADER = ["M","S","S","R","K","J","S"];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, current: false });
  return cells;
}

const MOCK_APPOINTMENTS = [
  { time: "08:00", patient: "Budi Santoso", procedure: "Pemeriksaan Rutin & Pembersihan Karang", status: "confirmed", duration: "08:00 - 08:45 WIB" },
  { time: "09:00", patient: "Siti Rahayu",  procedure: "Perawatan Saluran Akar (Sesi 2)", status: "completed", duration: "09:00 - 10:00 WIB" },
  { time: "10:00", patient: null, procedure: "", status: "empty", duration: "" },
  { time: "11:00", patient: "Dewi Permata", procedure: "Penyesuaian Kawat Gigi", status: "cancelled", duration: "11:00 - 11:30 WIB" },
  { time: "12:00", patient: null, procedure: "Istirahat Siang", status: "break", duration: "" },
  { time: "13:00", patient: "Ahmad Fauzi",  procedure: "Ekstraksi Gigi Bungsu", status: "confirmed", duration: "13:00 - 14:30 WIB • Bedah" },
];

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-blue-50 border-blue-500 text-blue-900",
  completed:  "bg-emerald-50 border-emerald-500 text-emerald-900",
  cancelled:  "bg-rose-50 border-rose-500 text-rose-900",
};
const STATUS_LABEL: Record<string, { label: string; class: string }> = {
  confirmed: { label: "Dikonfirmasi", class: "text-blue-600 bg-blue-100" },
  completed:  { label: "Selesai",       class: "text-emerald-600 bg-emerald-100" },
  cancelled:  { label: "Batal",         class: "text-rose-600 bg-rose-100" },
};

const DOCTORS = [
  { name: "drg. Sarah Wilson",   spec: "Ortodonti",          initials: "SW", active: true },
  { name: "drg. Bima Pratama",   spec: "Bedah Mulut",        initials: "BP", active: false },
  { name: "drg. Emily Chen",     spec: "Konservasi Gigi",    initials: "EC", active: false },
];

export default function AppointmentsPage() {
  const today = new Date();
  const [view, setView] = useState<"Harian"|"Mingguan"|"Bulanan">("Harian");
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isFormOpen, setIsFormOpen] = useState(false);

  const calCells = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const selectedDate = new Date(calYear, calMonth, selectedDay);
  const isToday = selectedDate.toDateString() === today.toDateString();
  const dayLabel = `${DAYS_ID[selectedDate.getDay()]}, ${selectedDay} ${MONTHS_ID[calMonth]}`;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <AppointmentFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94]">Jadwal & Janji Temu</h2>
          <p className="text-slate-500 text-lg">Kelola prosedur dan konsultasi harian dokter.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          {(["Harian","Mingguan","Bulanan"] as const).map(v => (
            <Button
              key={v}
              variant="ghost"
              onClick={() => setView(v)}
              className={`px-4 py-2 h-auto text-sm font-semibold rounded transition-colors ${
                view === v
                  ? "bg-[#0D5A94] text-white hover:bg-[#004271] hover:text-white"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Sidebar ── */}
        <div className="col-span-1 lg:col-span-3 space-y-6">

          {/* Mini Calendar — dynamic */}
          <Card className="border-slate-200 shadow-sm shadow-blue-900/5">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-500" />
                </button>
                <span className="font-bold text-[#0D5A94] text-sm">
                  {MONTHS_ID[calMonth]} {calYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center">
              {DAY_HEADER.map((d, i) => (
                <span key={`hdr-${i}`} className="text-[10px] font-bold text-slate-400 pb-1">{d}</span>
              ))}
                {calCells.map((cell, i) => {
                  const isSelected = cell.current && cell.day === selectedDay && calMonth === calMonth;
                  const isTodayCell = cell.current && cell.day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                  return (
                    <button
                      key={i}
                      disabled={!cell.current}
                      onClick={() => cell.current && setSelectedDay(cell.day)}
                      className={`w-7 h-7 mx-auto text-xs rounded-full flex items-center justify-center transition-colors font-medium ${
                        !cell.current
                          ? "text-slate-200 dark:text-slate-700 cursor-default"
                          : isSelected
                            ? "bg-[#0D5A94] text-white font-bold"
                            : isTodayCell
                              ? "bg-blue-100 text-[#0D5A94] font-bold"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Doctors Available */}
          <Card className="border-slate-200 shadow-sm shadow-blue-900/5 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dokter Tersedia</h3>
            </div>
            <div className="p-2 space-y-1">
              {DOCTORS.map((doc) => (
                <button
                  key={doc.name}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    doc.active
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarFallback className={doc.active ? "bg-blue-200 text-blue-700" : "bg-slate-200 text-slate-600"}>
                      {doc.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`text-sm font-bold ${doc.active ? "text-[#0D5A94]" : "text-slate-700 dark:text-slate-200"}`}>{doc.name}</p>
                    {doc.active
                      ? <span className="text-[10px] text-[#00725d] bg-[#76f9d6]/30 px-1.5 py-0.5 rounded inline-block mt-0.5 font-semibold">{doc.spec}</span>
                      : <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{doc.spec}</p>
                    }
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Add Button */}
          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-[#0D5A94] hover:bg-[#004271] text-white font-bold gap-2 h-11"
          >
            <CalendarPlus className="h-4 w-4" /> Tambah Jadwal Baru
          </Button>
        </div>

        {/* ── Main Schedule ── */}
        <div className="col-span-1 lg:col-span-9">
          <Card className="border-slate-200 shadow-sm shadow-blue-900/5 flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-200px)]">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <ChevronLeft className="h-4 w-4 text-slate-500" />
                </button>
                <h3 className="text-xl font-bold text-[#0D5A94]">{dayLabel}</h3>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
                {isToday && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Hari Ini</span>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-500 font-medium">
                  {[["bg-blue-500","Dikonfirmasi"],["bg-emerald-500","Selesai"],["bg-rose-500","Batal"]].map(([c,l]) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${c}`} />{l}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  size="sm"
                  className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold gap-1.5 h-8 px-3 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah
                </Button>
              </div>
            </div>

            {/* Timetable */}
            <div className="flex-1 overflow-y-auto relative">
              {view === "Bulanan" ? (
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-1">
                    {DAY_HEADER.map((d, i) => (
                      <div key={`mhdr-${i}`} className="text-center text-[10px] font-bold text-slate-400 py-2">{d}</div>
                    ))}

                    {calCells.map((cell, i) => (
                      <button
                        key={i}
                        onClick={() => cell.current && setSelectedDay(cell.day)}
                        className={`min-h-[60px] p-2 rounded-lg text-sm text-left transition-colors border ${
                          !cell.current
                            ? "text-slate-200 dark:text-slate-700 bg-slate-50 dark:bg-slate-900 border-transparent"
                            : cell.day === selectedDay
                              ? "bg-blue-50 dark:bg-blue-900/20 border-[#0D5A94] text-[#0D5A94] font-bold"
                              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {cell.day}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 sticky top-0 z-10">
                      <th className="w-24 p-3 border-b border-r border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 text-center uppercase tracking-wider">Waktu</th>
                      <th className="p-3 border-b border-slate-100 dark:border-slate-800 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {view === "Mingguan" ? "Jadwal Mingguan" : "Jadwal Pemeriksaan"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_APPOINTMENTS.map((apt, i) => {
                      if (apt.status === "break") return (
                        <tr key={i}>
                          <td className="p-4 border-b border-r border-slate-100 dark:border-slate-800 text-center align-top bg-slate-50 dark:bg-slate-800">
                            <span className="text-xs font-bold text-slate-500">{apt.time}</span>
                          </td>
                          <td className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-center h-16">
                            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Istirahat Siang</span>
                          </td>
                        </tr>
                      );

                      if (apt.status === "empty") return (
                        <tr key={i}>
                          <td className="p-4 border-b border-r border-slate-100 dark:border-slate-800 text-center align-top bg-white dark:bg-slate-900">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{apt.time}</span>
                          </td>
                          <td className="p-2 border-b border-slate-100 dark:border-slate-800 h-28 group bg-white dark:bg-slate-900">
                            <button
                              onClick={() => setIsFormOpen(true)}
                              className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg group-hover:border-[#0D5A94] group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 cursor-pointer transition-all"
                            >
                              <span className="text-slate-400 group-hover:text-[#0D5A94] text-sm font-semibold flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Isi Slot Kosong
                              </span>
                            </button>
                          </td>
                        </tr>
                      );

                      const style = STATUS_STYLE[apt.status] || "";
                      const label = STATUS_LABEL[apt.status];
                      const Icon = apt.status === "completed" ? CheckCircle : apt.status === "cancelled" ? XCircle : AlertTriangle;

                      return (
                        <tr key={i}>
                          <td className="p-4 border-b border-r border-slate-100 dark:border-slate-800 text-center align-top bg-white dark:bg-slate-900">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{apt.time}</span>
                          </td>
                          <td className="p-2 border-b border-slate-100 dark:border-slate-800 relative h-28 bg-white dark:bg-slate-900">
                            <div className={`border-l-4 rounded-lg p-3 w-11/12 sm:w-[70%] absolute top-2 hover:shadow-md transition-all cursor-pointer ${style}`}>
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-bold">{apt.patient}</h4>
                                {label && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${label.class}`}>{label.label}</span>
                                )}
                              </div>
                              <p className="text-xs font-medium opacity-80">{apt.procedure}</p>
                              <div className="flex items-center gap-1.5 mt-2.5 opacity-70">
                                <Icon className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-medium">{apt.duration}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 bg-[#0D5A94] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/30 hover:bg-[#004271] hover:scale-105 active:scale-95 transition-all duration-200 group z-50"
      >
        <Plus className="h-6 w-6" />
        <span className="absolute right-16 bg-[#0D5A94] text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity font-bold shadow-md pointer-events-none">
          Buat Janji
        </span>
      </button>
    </div>
  );
}
