"use client";

import { LifeBuoy, BookOpen, MessageSquare, Phone, ChevronRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HelpPage() {
  const faqs = [
    { q: "Bagaimana cara menambahkan pasien baru?", a: "Buka halaman Manajemen Pasien, lalu klik tombol '+ Pasien Baru' di pojok kanan atas." },
    { q: "Cara membuat janji temu?", a: "Buka halaman Jadwal & Janji Temu, klik tombol FAB (bulat biru) di pojok kanan bawah, atau tombol 'Buat Janji Baru' di sidebar." },
    { q: "Bagaimana cara mengekspor laporan?", a: "Buka halaman Laporan, pilih rentang tanggal dan format yang diinginkan, lalu klik tombol 'Export'." },
    { q: "Apakah data saya aman?", a: "Ya. Seluruh data tersimpan di Supabase dengan enkripsi 256-bit dan sepenuhnya HIPAA Compliant." },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-[#0D5A94] dark:text-blue-400">Pusat Bantuan</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Temukan jawaban atas pertanyaan Anda atau hubungi tim support kami.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input placeholder="Cari artikel bantuan..." className="pl-12 h-12 text-base rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <BookOpen className="h-6 w-6" />, label: "Dokumentasi", desc: "Panduan lengkap penggunaan sistem", color: "text-[#0D5A94] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
          { icon: <MessageSquare className="h-6 w-6" />, label: "Live Chat", desc: "Hubungi support secara real-time", color: "text-[#006b57] dark:text-green-400 bg-green-50 dark:bg-green-900/20" },
          { icon: <Phone className="h-6 w-6" />, label: "Hubungi Kami", desc: "+62 812 3456 7890", color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" },
        ].map((item, i) => (
          <Card key={i} className="border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#0D5A94] dark:text-blue-400 transition-colors">{item.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Pertanyaan yang Sering Ditanyakan</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Card key={i} className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 dark:text-white mb-2">{faq.q}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-gradient-to-br from-[#0D5A94] to-[#004271] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <LifeBuoy className="h-8 w-8 opacity-80" />
          <h3 className="text-2xl font-extrabold">Butuh Bantuan Lebih Lanjut?</h3>
        </div>
        <p className="text-blue-100 mb-6 leading-relaxed">
          Tim support kami siap membantu Anda 24/7. Hubungi kami melalui email atau telepon.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:support@dentalcloud.id" className="px-5 py-2.5 bg-white dark:bg-slate-900 text-[#0D5A94] dark:text-blue-400 rounded-lg font-bold text-sm hover:bg-blue-50 dark:bg-blue-900/20 transition-colors">
            Email Support
          </a>
          <a href="tel:+6281234567890" className="px-5 py-2.5 bg-white dark:bg-slate-900/10 border border-white/20 text-white rounded-lg font-bold text-sm hover:bg-white dark:bg-slate-900/20 transition-colors">
            +62 812 3456 7890
          </a>
        </div>
      </div>
    </div>
  );
}
