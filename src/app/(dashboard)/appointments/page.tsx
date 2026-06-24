"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Filter, MoreVertical, Clock,
  CheckCircle, XCircle, AlertTriangle, Plus, CalendarPlus, X, Stethoscope
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { AppointmentFormDialog } from "@/components/features/appointments/appointment-form-dialog";
import { apiFetch } from "@/lib/api-client";
import { useRole } from "@/contexts/role-context";

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

const STATUS_STYLE: Record<string, string> = {
  confirmed:   "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900",
  completed:   "bg-emerald-50 border-emerald-500 text-emerald-900",
  cancelled:   "bg-rose-50 border-rose-500 text-rose-900",
  scheduled:   "bg-amber-50 border-amber-400 text-amber-900",
  in_progress: "bg-purple-50 border-purple-500 text-purple-900",
  checked_in:  "bg-teal-50 border-teal-500 text-teal-900",
};
const STATUS_LABEL: Record<string, { label: string; class: string }> = {
  confirmed:   { label: "Dikonfirmasi", class: "text-blue-600 bg-blue-100" },
  completed:   { label: "Selesai",      class: "text-emerald-600 bg-emerald-100" },
  cancelled:   { label: "Batal",        class: "text-rose-600 bg-rose-100" },
  scheduled:   { label: "Terjadwal",   class: "text-amber-600 bg-amber-100" },
  in_progress: { label: "Berlangsung", class: "text-purple-600 bg-purple-100" },
  checked_in:  { label: "Check-In",    class: "text-teal-600 bg-teal-100" },
};

type DoctorItem = { id: string; user_id?: string | null; full_name: string; specialization?: { name: string } | null; is_active: boolean };
type AptItem = { id: string; doctor_id: string; scheduled_at: string; status: string; chief_complaint?: string; patient?: { full_name: string }; doctor?: { full_name: string } };

export default function AppointmentsPage() {
  const today = new Date();
  const [view, setView] = useState<"Harian"|"Mingguan"|"Bulanan">("Harian");
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { isDoctor, isAdmin, userId } = useRole();
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [allAppointments, setAllAppointments] = useState<AptItem[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    if (openDropdownId) {
      setTimeout(() => window.addEventListener('click', handleClickOutside), 10);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openDropdownId]);

  useEffect(() => {
    apiFetch<DoctorItem[]>('/doctors').then(setDoctors).catch(() => {});
    apiFetch<AptItem[]>('/appointments').then(setAllAppointments).catch(() => {});
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updated = await apiFetch<AptItem>(`/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setAllAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: updated.status } : apt))
      );
    } catch (err: any) {
      alert("Gagal mengubah status jadwal: " + (err.message || "Unknown error"));
      console.error("Gagal mengubah status jadwal", err);
    }
  };

  const currentDoctorId = useMemo(() => {
    return doctors.find(d => d.user_id === userId)?.id;
  }, [doctors, userId]);

  const filteredAppointments = useMemo(() => {
    if (isDoctor) {
      if (!currentDoctorId) return [];
      return allAppointments.filter(apt => apt.doctor_id === currentDoctorId);
    }
    return allAppointments;
  }, [allAppointments, isDoctor, currentDoctorId]);

  // Filter appointments berdasarkan tampilan (Harian/Mingguan)
  const displayedAppointments = useMemo(() => {
    const selDate = new Date(calYear, calMonth, selectedDay);
    
    if (view === "Mingguan") {
      const startOfWeek = new Date(selDate);
      startOfWeek.setDate(selDate.getDate() - selDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.scheduled_at);
        return aptDate >= startOfWeek && aptDate <= endOfWeek;
      }).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    }

    // Default ke Harian
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.scheduled_at);
      return aptDate.getFullYear() === selDate.getFullYear() &&
             aptDate.getMonth() === selDate.getMonth() &&
             aptDate.getDate() === selDate.getDate();
    }).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  }, [filteredAppointments, calYear, calMonth, selectedDay, view]);

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
  
  let dayLabel = `${DAYS_ID[selectedDate.getDay()]}, ${selectedDay} ${MONTHS_ID[calMonth]}`;
  if (view === "Mingguan") {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    dayLabel = `${startOfWeek.getDate()} ${MONTHS_ID[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${MONTHS_ID[endOfWeek.getMonth()]} ${endOfWeek.getFullYear()}`;
  } else if (view === "Bulanan") {
    dayLabel = `Bulan ${MONTHS_ID[calMonth]} ${calYear}`;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <AppointmentFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94] dark:text-blue-400">Jadwal & Janji Temu</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Kelola prosedur dan konsultasi harian dokter.</p>
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
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800"
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
          <Card className="border-slate-200 dark:border-slate-700 shadow-sm shadow-blue-900/5">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>
                <span className="font-bold text-[#0D5A94] dark:text-blue-400 text-sm">
                  {MONTHS_ID[calMonth]} {calYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
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
                          ? "text-slate-200 dark:text-slate-700 dark:text-slate-300 cursor-default"
                          : isSelected
                            ? "bg-[#0D5A94] text-white font-bold"
                            : isTodayCell
                              ? "bg-blue-100 text-[#0D5A94] dark:text-blue-400 font-bold"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"
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
          <Card className="border-slate-200 dark:border-slate-700 shadow-sm shadow-blue-900/5 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dokter Tersedia</h3>
            </div>
            <div className="p-2 space-y-1">
              {doctors.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">Memuat data dokter...</p>
              ) : doctors.map((doc) => {
                const initials = doc.full_name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <button
                    key={doc.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      doc.is_active
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarFallback className={doc.is_active ? "bg-blue-200 text-blue-700" : "bg-slate-200 text-slate-600 dark:text-slate-300"}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={`text-sm font-bold ${doc.is_active ? "text-[#0D5A94] dark:text-blue-400" : "text-slate-700 dark:text-slate-200"}`}>{doc.full_name}</p>
                      {doc.specialization?.name && (
                        doc.is_active
                          ? <span className="text-[10px] text-[#00725d] bg-[#76f9d6]/30 px-1.5 py-0.5 rounded inline-block mt-0.5 font-semibold">{doc.specialization.name}</span>
                          : <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{doc.specialization.name}</p>
                      )}
                    </div>
                  </button>
                );
              })}
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
          <Card className="border-slate-200 dark:border-slate-700 shadow-sm shadow-blue-900/5 flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-200px)]">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors">
                  <ChevronLeft className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>
                <h3 className="text-xl font-bold text-[#0D5A94] dark:text-blue-400">{dayLabel}</h3>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors">
                  <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>
                {isToday && (
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Hari Ini</span>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {[["bg-blue-50 dark:bg-blue-900/200","Dikonfirmasi"],["bg-emerald-500","Selesai"],["bg-rose-500","Batal"]].map(([c,l]) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${c}`} />{l}
                    </div>
                  ))}
                </div>
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

                    {calCells.map((cell, i) => {
                      const cellApts = cell.current ? filteredAppointments.filter(apt => {
                        const d = new Date(apt.scheduled_at);
                        return d.getDate() === cell.day && d.getMonth() === calMonth && d.getFullYear() === calYear;
                      }).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()) : [];

                      return (
                        <button
                          key={i}
                          onClick={() => cell.current && setSelectedDay(cell.day)}
                          className={`min-h-[80px] p-2 rounded-lg text-sm text-left transition-colors border flex flex-col items-start overflow-hidden ${
                            !cell.current
                              ? "text-slate-200 dark:text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border-transparent"
                              : cell.day === selectedDay
                                ? "bg-blue-50 dark:bg-blue-900/20 border-[#0D5A94] text-[#0D5A94] dark:text-blue-400 font-bold"
                                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <span className="mb-1.5">{cell.day}</span>
                          <div className="flex flex-col gap-1 w-full flex-1">
                            {cellApts.slice(0, 2).map(apt => {
                              const style = STATUS_STYLE[apt.status] || "bg-slate-50 border-slate-300";
                              return (
                                <div key={apt.id} className={`text-[9px] px-1.5 py-0.5 rounded truncate ${style} border-l-2 font-medium w-full text-left`}>
                                  {new Date(apt.scheduled_at).toLocaleTimeString("id-ID", {hour: "2-digit", minute:"2-digit"})} - {apt.patient?.full_name || "Pasien"}
                                </div>
                              );
                            })}
                            {cellApts.length > 2 && (
                              <div className="text-[10px] text-[#0D5A94] dark:text-blue-400 font-bold mt-0.5">+{cellApts.length - 2} lagi</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
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
                    {displayedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-12 text-center text-slate-400 text-sm">
                          Tidak ada jadwal untuk {view === "Mingguan" ? "minggu" : "hari"} ini
                        </td>
                      </tr>
                    ) : displayedAppointments.map((apt, i) => {
                      const time = new Date(apt.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                      const dateStr = view === "Mingguan" ? new Date(apt.scheduled_at).toLocaleDateString("id-ID", { weekday: 'short', day: 'numeric', month: 'short' }) + " - " : "";
                      const style = STATUS_STYLE[apt.status] || "bg-slate-50 border-slate-300";
                      const label = STATUS_LABEL[apt.status];
                      const Icon = apt.status === "completed" ? CheckCircle : apt.status === "cancelled" ? XCircle : AlertTriangle;
                      return (
                        <tr key={apt.id} className="even:bg-slate-50 dark:bg-slate-800 dark:even:bg-slate-800">
                          <td className="p-4 border-b border-r border-slate-100 dark:border-slate-800 text-center align-top bg-white dark:bg-slate-900">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">{dateStr}{time}</span>
                          </td>
                          <td className="p-2 border-b border-slate-100 dark:border-slate-800 relative h-28 bg-white dark:bg-slate-900">
                            <div className={`w-11/12 sm:w-[70%] absolute top-2 rounded-lg hover:shadow-md transition-all ${style}`}>
                              <button 
                                onClick={() => setOpenDropdownId(openDropdownId === apt.id ? null : apt.id)}
                                className="w-full text-left p-3 border-l-4 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-[#0D5A94] bg-transparent border-inherit text-inherit"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm font-bold">{apt.patient?.full_name || "Pasien"}</h4>
                                  {label && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${label.class}`}>{label.label}</span>
                                  )}
                                </div>
                                <p className="text-xs font-medium opacity-80">{apt.chief_complaint || "-"}</p>
                                <div className="flex items-center justify-between mt-2.5">
                                  <div className="flex items-center gap-1.5 opacity-70">
                                    <Icon className="h-3.5 w-3.5" />
                                    <span className="text-[11px] font-medium">{label?.label || apt.status}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded-md shadow-sm border border-black/5 dark:border-white/5">
                                    <Stethoscope className="h-3 w-3 text-[#0D5A94] dark:text-blue-400" />
                                    <span className="text-[11px] font-bold text-[#0D5A94] dark:text-blue-400">{apt.doctor?.full_name || "Dokter"}</span>
                                  </div>
                                </div>
                              </button>
                              
                              {openDropdownId === apt.id && (
                                <div className="absolute top-[105%] left-0 w-48 z-[9999] bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl p-1 animate-in fade-in-0 zoom-in-95">
                                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">Ubah Status</div>
                                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                  {Object.entries(STATUS_LABEL).map(([val, { label: txt }]) => (
                                    <button
                                      key={val}
                                      onClick={() => handleUpdateStatus(apt.id, val)}
                                      disabled={val === apt.status}
                                      className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                    >
                                      {txt}
                                    </button>
                                  ))}
                                </div>
                              )}
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
