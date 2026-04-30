"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Zod schema for patient validation
const patientSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap harus minimal 3 karakter"),
  nik: z.string().length(16, "NIK harus 16 digit angka").regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  dateOfBirth: z.string().min(1, "Tanggal lahir wajib diisi"),
  phone: z.string().min(10, "Nomor HP tidak valid").regex(/^\+?[0-9]+$/, "Nomor HP hanya boleh berisi angka"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().min(10, "Alamat terlalu singkat"),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientFormDialog({ open, onOpenChange }: PatientFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: "",
      nik: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("New Patient Data:", data);
    setIsSubmitting(false);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white">
        <div className="bg-[#0D5A94] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Tambah Pasien Baru</DialogTitle>
            <DialogDescription className="text-blue-100 opacity-90">
              Masukkan data rekam medis awal pasien ke dalam sistem.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700 font-semibold">Nama Lengkap</Label>
            <Input id="fullName" {...register("fullName")} placeholder="Cth: Budi Santoso" className={errors.fullName ? "border-red-500" : ""} />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nik" className="text-slate-700 font-semibold">No. KTP (NIK)</Label>
              <Input id="nik" {...register("nik")} placeholder="16 Digit NIK" className={errors.nik ? "border-red-500" : ""} />
              {errors.nik && <p className="text-xs text-red-500">{errors.nik.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-slate-700 font-semibold">Tanggal Lahir</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className={errors.dateOfBirth ? "border-red-500" : ""} />
              {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-semibold">Nomor HP</Label>
              <Input id="phone" {...register("phone")} placeholder="0812..." className={errors.phone ? "border-red-500" : ""} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email (Opsional)</Label>
              <Input id="email" type="email" {...register("email")} placeholder="budi@email.com" className={errors.email ? "border-red-500" : ""} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-700 font-semibold">Alamat Lengkap</Label>
            <Input id="address" {...register("address")} placeholder="Jln. Raya No. 123..." className={errors.address ? "border-red-500" : ""} />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-500 hover:text-slate-700 font-semibold">
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#006b57] hover:bg-[#005141] text-white font-bold">
              {isSubmitting ? "Menyimpan..." : "Simpan Pasien"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
