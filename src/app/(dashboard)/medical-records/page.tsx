"use client";

import { Printer, Edit, AlertTriangle, Image as ImageIcon, FileText, LayoutGrid, Pill, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MedicalRecordsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 max-w-7xl mx-auto">
      {/* ── Patient Header Section ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            {/* Using a placeholder div for the patient portrait to avoid external image dependencies */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-200 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
               <span className="text-2xl font-bold text-slate-400">EF</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#76f9d6] text-[#002019] px-2 py-0.5 rounded-full text-[10px] font-bold border-2 border-white">
              ACTIVE
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D5A94]">Eleanor Fitzgerald</h2>
              <span className="text-slate-400 text-sm font-medium">#PAT-99201</span>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-600 text-sm mt-2">
              <span className="flex items-center gap-1.5 font-medium">34 years (May 12, 1989)</span>
              <span className="flex items-center gap-1.5 font-medium">Female</span>
              <span className="flex items-center gap-1.5 font-medium">+1 (555) 012-3456</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none border-slate-200 text-slate-600 font-semibold gap-2">
            <Printer className="h-4 w-4" /> Print File
          </Button>
          <Button className="flex-1 sm:flex-none bg-[#0D5A94] hover:bg-[#004271] text-white font-semibold gap-2">
            <Edit className="h-4 w-4" /> Edit Details
          </Button>
        </div>
      </div>

      {/* ── Medical Alerts & Summary Bento ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Alerts Card */}
        <div className="lg:col-span-3 bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex shrink-0 items-center justify-center text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-3">Critical Medical Alerts</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="bg-white border-red-200 text-red-700 py-1.5 px-3 gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> PENICILLIN ALLERGY
              </Badge>
              <Badge variant="outline" className="bg-white border-red-200 text-red-700 py-1.5 px-3 gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> LATEX SENSITIVITY
              </Badge>
              <Badge variant="outline" className="bg-white border-amber-200 text-amber-700 py-1.5 px-3 gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> TYPE 2 DIABETES
              </Badge>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase">Quick Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Last Visit</span>
                <span className="text-sm font-bold text-slate-900">Oct 14, 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Hygiene Score</span>
                <span className="text-sm font-bold text-[#006b57]">8.5 / 10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Balance Due</span>
                <span className="text-sm font-bold text-red-600">$0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── History Timeline Content ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Chronological Records */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#0D5A94]">Clinical History</h3>
            <select className="text-sm border border-slate-200 rounded-lg bg-white px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#0D5A94]/20 transition-all">
              <option>All Record Types</option>
              <option>Treatments</option>
              <option>Diagnoses</option>
            </select>
          </div>

          {/* Timeline */}
          <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
            
            {/* Record 1 */}
            <div className="relative">
              <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#0D5A94] flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-[#0D5A94]"></div>
              </div>
              <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Oct 14, 2023 • 10:30 AM</span>
                        <span className="px-2 py-0.5 bg-[#76f9d6]/30 text-[#00725d] rounded-full text-[10px] font-bold">COMPLETED</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Scaling & Deep Root Planing</h4>
                      <p className="text-sm text-slate-500 mt-1">Performed by Dr. Julian Vance</p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xs font-bold text-slate-400">SESSION ID</span>
                      <p className="text-sm font-mono text-slate-600 font-semibold">#TRT-00942</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Diagnosis</span>
                      <p className="text-sm font-semibold text-[#0D5A94]">Gingivitis - Grade II</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Anesthesia</span>
                      <p className="text-sm font-semibold text-[#0D5A94]">Topical Gel (Lidocaine 5%)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinical Notes</span>
                    <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-lg italic border border-blue-100/50">
                      "Patient reported mild sensitivity in the lower left quadrant. Scaling completed with minimal bleeding. Gingival margins show moderate inflammation. Recommended switching to a soft-bristle electric toothbrush and increased flossing frequency."
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-4">
                    <Button variant="link" className="text-[#0D5A94] text-xs font-bold p-0 h-auto gap-1">
                      <ImageIcon className="h-3.5 w-3.5" /> View Intraoral Photos (4)
                    </Button>
                    <Button variant="link" className="text-[#0D5A94] text-xs font-bold p-0 h-auto gap-1">
                      <FileText className="h-3.5 w-3.5" /> Lab Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Record 2 */}
            <div className="relative">
              <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center z-10"></div>
              <Card className="border-slate-100 shadow-sm opacity-80 grayscale-[0.2]">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aug 22, 2023 • 02:15 PM</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Filling (Composite Resin)</h4>
                      <p className="text-sm text-slate-500 mt-1">Tooth #14 Disto-Occlusal</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-3">
                    <p className="text-sm text-slate-600">Class II restoration completed. Occlusion checked and adjusted. Shade A2 used for natural matching.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>

        {/* ── Sidebar Details ── */}
        <div className="space-y-6">
          
          {/* Dental Chart Mini */}
          <Card className="border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xs font-bold text-[#0D5A94] mb-4 flex items-center gap-2 tracking-widest uppercase">
                <LayoutGrid className="h-4 w-4" /> Dental Chart Status
              </h3>
              <div className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center p-4 border border-dashed border-slate-200">
                <div className="grid grid-cols-8 gap-1 w-full h-full content-start">
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <div key={n} className={`w-full h-8 rounded flex items-center justify-center text-[10px] font-bold ${n === 3 ? 'bg-red-100 border border-red-200 text-red-600' : 'bg-blue-50 text-[#0D5A94]'}`}>
                      {n}
                    </div>
                  ))}
                  {[32,31,30,29,28,27,26,25].map(n => (
                    <div key={n} className={`w-full h-8 rounded flex items-center justify-center text-[10px] font-bold mt-1 ${n === 29 ? 'bg-amber-100 border border-amber-200 text-amber-600' : 'bg-blue-50 text-[#0D5A94]'}`}>
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 bg-red-100 border border-red-200 rounded"></span>
                  <span className="text-slate-500 font-medium">Urgent Attention (Extraction)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></span>
                  <span className="text-slate-500 font-medium">Monitoring Required (Caries)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card className="border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xs font-bold text-[#0D5A94] mb-4 flex items-center gap-2 tracking-widest uppercase">
                <Pill className="h-4 w-4" /> Active Medications
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-[#006b57] pl-3">
                  <p className="text-sm font-bold text-slate-900">Chlorhexidine Gluconate 0.12%</p>
                  <p className="text-xs text-slate-500 mt-1">Oral Rinse - 15ml twice daily</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1.5 uppercase">Ends Oct 28, 2023</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6 border-slate-200 text-[#0D5A94] hover:bg-slate-50 font-bold text-xs h-9">
                Issue New Prescription
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Appointment */}
          <div className="bg-[#0D5A94] rounded-xl p-6 text-white shadow-md shadow-blue-900/20">
            <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-4">Next Appointment</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold opacity-90">NOV</span>
                <span className="text-xl font-black">12</span>
              </div>
              <div>
                <p className="font-bold text-base">Check-up & Polishing</p>
                <p className="text-xs opacity-80 mt-0.5">09:30 AM - Room 2B</p>
              </div>
            </div>
            <Button className="w-full bg-white text-[#0D5A94] hover:bg-blue-50 font-black text-xs h-10 tracking-wide">
              CONFIRM ATTENDANCE
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
