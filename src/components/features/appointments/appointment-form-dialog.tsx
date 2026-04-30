"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const appointmentSchema = z.object({
  patient_id: z.string().min(1, "Pasien wajib dipilih"),
  doctor_id: z.string().min(1, "Dokter wajib dipilih"),
  scheduledAt: z.string().min(1, "Tanggal dan waktu wajib diisi"),
  chiefComplaint: z.string().min(5, "Keluhan wajib diisi minimal 5 karakter"),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentFormDialog({ open, onOpenChange }: AppointmentFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<{id:string, full_name:string}[]>([]);
  const [doctors, setDoctors] = useState<{id:string, full_name:string}[]>([]);

  useEffect(() => {
    if (open) {
      supabase.from("patients").select("id, full_name").then(({ data }) => {
        if (data) setPatients(data);
      });
      supabase.from("doctors").select("id, full_name").then(({ data }) => {
        if (data) setDoctors(data);
      });
    }
  }, [open]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      const appointmentCode = `APT-${Date.now()}`;
      const { error } = await supabase.from("appointments").insert({
        appointment_code: appointmentCode,
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        chief_complaint: data.chiefComplaint,
        notes: data.notes || null,
        scheduled_at: new Date(data.scheduledAt).toISOString(),
        status: "scheduled",
      });
      if (error) {
        console.warn("Supabase insert error:", error.message);
      }
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden bg-white">
        <div className="bg-[#0D5A94] p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <CalendarClock className="h-5 w-5 opacity-80" />
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Buat Janji Temu</DialogTitle>
            </DialogHeader>
          </div>
          <DialogDescription className="text-blue-100 opacity-90 text-sm mt-1">
            Isi detail jadwal konsultasi pasien berikut ini. Data akan langsung tersimpan ke Supabase.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="patient_id" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Pasien</Label>
              <select id="patient_id" {...register("patient_id")} className={`flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${errors.patient_id ? "border-red-400" : ""}`}>
                <option value="">Pilih Pasien...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
              {errors.patient_id && <p className="text-xs text-red-500">{errors.patient_id.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doctor_id" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Dokter</Label>
              <select id="doctor_id" {...register("doctor_id")} className={`flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${errors.doctor_id ? "border-red-400" : ""}`}>
                <option value="">Pilih Dokter...</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
              </select>
              {errors.doctor_id && <p className="text-xs text-red-500">{errors.doctor_id.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="scheduledAt" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Tanggal & Waktu</Label>
            <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} className={errors.scheduledAt ? "border-red-400" : ""} />
            {errors.scheduledAt && <p className="text-xs text-red-500">{errors.scheduledAt.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="chiefComplaint" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Keluhan Utama</Label>
            <Input id="chiefComplaint" {...register("chiefComplaint")} placeholder="Cth: Sakit gigi geraham kiri" className={errors.chiefComplaint ? "border-red-400" : ""} />
            {errors.chiefComplaint && <p className="text-xs text-red-500">{errors.chiefComplaint.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Catatan Tambahan <span className="text-slate-400 font-normal normal-case">(opsional)</span></Label>
            <Input id="notes" {...register("notes")} placeholder="Alergi obat, permintaan khusus, dsb." />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 mt-2">
            <Button type="button" variant="ghost" onClick={() => { reset(); onOpenChange(false); }} className="text-slate-500 font-semibold">
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold gap-2">
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : "Simpan Janji"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
