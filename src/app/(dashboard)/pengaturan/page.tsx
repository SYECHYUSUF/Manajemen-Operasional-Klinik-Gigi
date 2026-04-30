"use client";

import { useState, useEffect } from "react";
import { Building2, Palette, Clock, Link as LinkIcon, Save, Upload, MapPin, Phone, Mail, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PengaturanAplikasiPage() {
  const [activeTab, setActiveTab] = useState("profil");
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: "profil", label: "Profil Klinik", icon: Building2 },
    { id: "tampilan", label: "Tampilan", icon: Palette },
    { id: "jam", label: "Jam Operasional", icon: Clock },
    { id: "integrasi", label: "Integrasi", icon: LinkIcon },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-[#0D5A94]">Pengaturan Aplikasi</h2>
        <p className="text-slate-500 mt-1">Konfigurasi profil klinik, preferensi tampilan, dan sistem.</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === tab.id
                  ? "bg-white text-[#0d5a94] shadow-md shadow-slate-200/60"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardContent className="p-6 sm:p-8">
          {activeTab === "profil" && (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-6">
                <div className="h-24 w-24 shrink-0 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="text-[10px] font-bold">Ubah Logo</span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Klinik</label>
                  <input
                    type="text"
                    defaultValue="DentalCloud Pro Clinic"
                    className="w-full px-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Resmi</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                      type="email"
                      defaultValue="hello@dentalcloud.id"
                      className="w-full pl-10 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                      type="tel"
                      defaultValue="+62 811 2345 6789"
                      className="w-full pl-10 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Lengkap</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                  <textarea
                    defaultValue="Gedung Medical Center Lt. 3, Jl. Jend. Sudirman No. 88, Senayan, Kebayoran Baru, Jakarta Selatan 12190"
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all resize-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "tampilan" && mounted && (
            <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">Tema Aplikasi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Theme cards */}
                <div onClick={() => setTheme('light')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${theme !== 'dark' ? 'border-[#0d5a94] bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                  <div className="h-20 rounded-lg bg-slate-100 dark:bg-slate-800 mb-3 overflow-hidden flex shadow-inner">
                     <div className="w-1/3 h-full bg-[#0d5a94]"></div>
                     <div className="w-2/3 h-full bg-white dark:bg-slate-900"></div>
                  </div>
                  <p className={`text-xs font-bold text-center ${theme !== 'dark' ? 'text-[#0d5a94] dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>Terang (Light)</p>
                </div>
                
                <div onClick={() => setTheme('dark')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'dark' ? 'border-[#0d5a94] bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                  <div className="h-20 rounded-lg bg-slate-800 mb-3 overflow-hidden flex shadow-inner">
                     <div className="w-1/3 h-full bg-slate-900"></div>
                     <div className="w-2/3 h-full bg-slate-800"></div>
                  </div>
                  <p className={`text-xs font-bold text-center ${theme === 'dark' ? 'text-[#0d5a94] dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>Gelap (Dark)</p>
                </div>
                
                <div onClick={() => setTheme('system')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'system' ? 'border-[#0d5a94] bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                  <div className="h-20 rounded-lg bg-gradient-to-r from-slate-100 to-slate-800 mb-3 overflow-hidden flex shadow-inner">
                     <div className="w-1/3 h-full bg-[#0d5a94]"></div>
                     <div className="w-2/3 h-full bg-gradient-to-r from-white to-slate-800"></div>
                  </div>
                  <p className={`text-xs font-bold text-center ${theme === 'system' ? 'text-[#0d5a94] dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>Sistem</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "jam" && (
            <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              {['Senin - Jumat', 'Sabtu', 'Minggu'].map((day, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked={i !== 2} className="w-4 h-4 rounded text-[#0d5a94] focus:ring-[#0d5a94] cursor-pointer" />
                    <span className="font-bold text-slate-700 w-32">{day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="time" defaultValue={i === 2 ? "" : "08:00"} disabled={i === 2} className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#0d5a94]/20 disabled:opacity-50" />
                    <span className="text-slate-400 font-medium">-</span>
                    <input type="time" defaultValue={i === 2 ? "" : i === 1 ? "14:00" : "20:00"} disabled={i === 2} className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#0d5a94]/20 disabled:opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "integrasi" && (
            <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <div className="p-5 border border-[#0d5a94]/20 bg-blue-50/50 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#0d5a94] rounded-lg flex items-center justify-center text-white font-black text-xl">S</div>
                  <div>
                    <h4 className="font-bold text-[#0d5a94]">Supabase (Database & Auth)</h4>
                    <p className="text-xs text-[#0d5a94]/70 mt-0.5">Status: Terhubung secara realtime.</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-[#006b57]/10 text-[#006b57] text-xs font-bold rounded-full border border-[#006b57]/20">Aktif</div>
              </div>
              
              <div className="p-5 border border-slate-100 rounded-xl flex items-center justify-between shadow-sm hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center text-white font-black text-xl">W</div>
                  <div>
                    <h4 className="font-bold text-slate-800">WhatsApp API</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Kirim pengingat jadwal otomatis via WhatsApp.</p>
                  </div>
                </div>
                <Button variant="outline" className="text-sm font-bold h-9">Hubungkan</Button>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#0d5a94] hover:bg-[#004271] text-white font-bold px-8 gap-2 shadow-md shadow-blue-900/20 h-11"
            >
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="h-4 w-4" /> Simpan Pengaturan</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
