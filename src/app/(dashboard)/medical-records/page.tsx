"use client";

import { useState, useEffect, Suspense } from "react";
import { useRole } from "@/contexts/role-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Printer, Edit, AlertTriangle, FileText, Pill, X, Save, ShieldAlert, Plus, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { apiFetch } from "@/lib/api-client";

// ─── Modal Edit Patient Details ────────────────────────────────────────────
function EditDetailsModal({ open, onClose, patient, onSaved }: { open: boolean; onClose: () => void; patient: any; onSaved: () => void }) {
  const [form, setForm] = useState({
    full_name: "", date_of_birth: "", gender: "male", blood_type: "", nik: "", phone: "", email: "",
    address: "", emergency_contact_name: "", emergency_contact_phone: "", allergy_notes: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({
        full_name: patient.full_name || "",
        date_of_birth: patient.date_of_birth || "",
        gender: patient.gender || "male",
        blood_type: patient.blood_type || "",
        nik: patient.nik || "",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        emergency_contact_name: patient.emergency_contact_name || "",
        emergency_contact_phone: patient.emergency_contact_phone || "",
        allergy_notes: patient.allergy_notes || ""
      });
    }
  }, [patient]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(`/patients/${patient.id}`, {
        method: "PUT",
        body: JSON.stringify(form)
      });
      onSaved();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan pasien");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 md:pl-[276px]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Data Pasien</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:bg-slate-800"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Nama Lengkap *</label>
              <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="h-10 rounded-xl" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">NIK</label>
              <Input value={form.nik} onChange={e => setForm(p => ({ ...p, nik: e.target.value }))} className="h-10 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Tanggal Lahir *</label>
              <Input type="date" value={form.date_of_birth} onChange={e => setForm(p => ({ ...p, date_of_birth: e.target.value }))} className="h-10 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Jenis Kelamin</label>
              <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30">
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Golongan Darah</label>
              <select value={form.blood_type} onChange={e => setForm(p => ({ ...p, blood_type: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30">
                <option value="">-- Pilih --</option>
                <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">No. Telepon</label>
              <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-10 rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Email</label>
              <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="h-10 rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Alamat</label>
              <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="h-10 rounded-xl" />
            </div>
            <div className="col-span-2 border-t border-slate-100 dark:border-slate-800 my-2"></div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Kontak Darurat</label>
              <Input value={form.emergency_contact_name} onChange={e => setForm(p => ({ ...p, emergency_contact_name: e.target.value }))} placeholder="Nama" className="h-10 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Telp Darurat</label>
              <Input value={form.emergency_contact_phone} onChange={e => setForm(p => ({ ...p, emergency_contact_phone: e.target.value }))} placeholder="Nomor Telepon" className="h-10 rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase text-red-500">Catatan Alergi</label>
              <textarea value={form.allergy_notes} onChange={e => setForm(p => ({ ...p, allergy_notes: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30 resize-none" placeholder="Pisahkan dengan koma..." />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={saving || !form.full_name || !form.date_of_birth} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold gap-2 px-6">
            <Save className="h-4 w-4" />{saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Medical Record (SOAP) ─────────────────────────────────────────
function MedicalRecordModal({ open, onClose, patientId, appointments, onSaved }: { open: boolean; onClose: () => void; patientId: string; appointments: any[]; onSaved: () => void }) {
  const [form, setForm] = useState({ appointment_id: "", subjective: "", objective: "", assessment: "", plan: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && appointments.length > 0 && !form.appointment_id) {
      setForm(f => ({ ...f, appointment_id: appointments[0].id }));
    }
  }, [open, appointments, form.appointment_id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('dentalcloud_user') || '{}');
      await apiFetch('/medical-records', {
        method: "POST",
        body: JSON.stringify({
          appointment_id: form.appointment_id,
          patient_id: patientId,
          doctor_id: user.id, // we assume the logged in doctor is the one
          subjective: form.subjective,
          objective: form.objective,
          assessment: form.assessment,
          plan: form.plan,
          vital_signs: {},
          attachments: []
        })
      });
      onSaved();
      onClose();
      setForm({ appointment_id: appointments[0]?.id || "", subjective: "", objective: "", assessment: "", plan: "" });
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan rekam medis.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 md:pl-[276px]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Rekam Medis (SOAP)</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:bg-slate-800"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Terkait Janji Temu</label>
            <select value={form.appointment_id} onChange={e => setForm(p => ({ ...p, appointment_id: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30">
              {appointments.length === 0 && <option value="">Tidak ada janji temu</option>}
              {appointments.map(apt => (
                <option key={apt.id} value={apt.id}>{new Date(apt.scheduled_at).toLocaleDateString('id-ID')} - {apt.service?.name || "Konsultasi"}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">S - Subjective (Keluhan)</label>
              <textarea value={form.subjective} onChange={e => setForm(p => ({ ...p, subjective: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30 resize-none" placeholder="Pasien mengeluhkan..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">O - Objective (Pemeriksaan)</label>
              <textarea value={form.objective} onChange={e => setForm(p => ({ ...p, objective: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30 resize-none" placeholder="Hasil pemeriksaan fisik/penunjang..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">A - Assessment (Diagnosis)</label>
              <textarea value={form.assessment} onChange={e => setForm(p => ({ ...p, assessment: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30 resize-none" placeholder="Diagnosis kerja..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">P - Plan (Tindakan/Resep)</label>
              <textarea value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30 resize-none" placeholder="Rencana tindakan/edukasi..." />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={saving || !form.appointment_id} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold gap-2 px-6">
            <Save className="h-4 w-4" />{saving ? "Menyimpan..." : "Simpan Rekam Medis"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Issue New Prescription ──────────────────────────────────────────
function PrescriptionModal({ open, onClose, record, onSaved }: { open: boolean; onClose: () => void; record: any; onSaved: () => void }) {
  const [form, setForm] = useState({ drug: "", dosage: "", duration: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.drug || !record) return;
    setSaving(true);
    try {
      const currentAttachments = record.attachments || [];
      const newAttachment = {
        type: "prescription",
        ...form,
        issued_at: new Date().toISOString()
      };
      
      await apiFetch(`/medical-records/${record.id}`, {
        method: "PUT",
        body: JSON.stringify({
          attachments: [...currentAttachments, newAttachment]
        })
      });
      onSaved();
      onClose();
      setForm({ drug: "", dosage: "", duration: "", notes: "" });
    } catch (e) {
      console.error(e);
      alert("Gagal menerbitkan resep.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 md:pl-[276px]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resep Obat Baru</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:bg-slate-800"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Nama Obat *</label>
            <Input value={form.drug} onChange={e => setForm(p => ({ ...p, drug: e.target.value }))} placeholder="cth: Amoxicillin 500mg" className="h-10 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Dosis</label>
              <Input value={form.dosage} onChange={e => setForm(p => ({ ...p, dosage: e.target.value }))} placeholder="3x sehari" className="h-10 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Durasi</label>
              <Input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="5 hari" className="h-10 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Catatan</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Diminum setelah makan..." className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0D5A94]/30 resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={saving || !form.drug} className="bg-[#006b57] hover:bg-[#004a3c] text-white font-bold gap-2 px-6">
            <Pill className="h-4 w-4" />{saving ? "Menerbitkan..." : "Terbitkan Resep"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ──────────────────────────────────────────────────────────
function MedicalRecordsContent() {
  const { isDoctor, isLoading: roleLoading } = useRole();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient_id');
  
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showEdit, setShowEdit] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  
  const [prescriptionRecord, setPrescriptionRecord] = useState<any>(null);

  const loadData = async () => {
    if (!patientId) { setLoading(false); return; }
    try {
      const [patData, recData, aptData] = await Promise.all([
        apiFetch(`/patients/${patientId}`),
        apiFetch(`/medical-records?patient_id=${patientId}`),
        apiFetch(`/appointments?patient_id=${patientId}`)
      ]);
      setPatient(patData);
      setRecords(recData as any[]);
      setAppointments(aptData as any[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roleLoading && !isDoctor) router.replace("/dashboard");
  }, [roleLoading, isDoctor, router]);

  useEffect(() => {
    loadData();
  }, [patientId]);

  if (roleLoading || loading) return <div className="flex items-center justify-center h-64 text-slate-400">Memuat data...</div>;
  if (!isDoctor) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500 dark:text-slate-400">
      <ShieldAlert className="h-12 w-12 text-red-400" />
      <p className="font-semibold">Halaman ini hanya untuk Dokter.</p>
    </div>
  );

  const handlePrint = () => {
    window.print();
  };

  // Extract allergies
  const allergies = patient?.allergy_notes ? patient.allergy_notes.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 max-w-7xl mx-auto">
      <EditDetailsModal open={showEdit} onClose={() => setShowEdit(false)} patient={patient} onSaved={loadData} />
      <MedicalRecordModal open={showRecordModal} onClose={() => setShowRecordModal(false)} patientId={patientId as string} appointments={appointments} onSaved={loadData} />
      <PrescriptionModal open={!!prescriptionRecord} onClose={() => setPrescriptionRecord(null)} record={prescriptionRecord} onSaved={loadData} />

      {/* ── Patient Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-400">{getInitials(patient?.full_name || "Unknown")}</span>
            </div>
            {patient?.is_active && (
              <div className="absolute -bottom-1 -right-1 bg-[#76f9d6] text-[#002019] px-2 py-0.5 rounded-full text-[10px] font-bold border-2 border-white dark:border-slate-900">
                AKTIF
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D5A94] dark:text-blue-400">{patient?.full_name}</h2>
              <span className="text-slate-400 text-sm font-medium">{patient?.patient_code}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-300 text-sm mt-2">
              <span className="font-medium">{patient?.date_of_birth ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() + " tahun" : "-"}</span>
              <span className="font-medium capitalize">{patient?.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</span>
              <span className="font-medium">{patient?.phone || "Tidak ada telepon"}</span>
              <span className="font-medium">Gol. Darah: {patient?.blood_type || "-"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handlePrint} variant="outline" className="flex-1 sm:flex-none border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold gap-2">
            <Printer className="h-4 w-4" /> Cetak
          </Button>
          <Button onClick={() => setShowEdit(true)} className="flex-1 sm:flex-none bg-[#0D5A94] hover:bg-[#004271] text-white font-semibold gap-2">
            <Edit className="h-4 w-4" /> Edit Detail
          </Button>
          <Button onClick={() => setShowRecordModal(true)} className="flex-1 sm:flex-none bg-[#006b57] hover:bg-[#004a3c] text-white font-semibold gap-2">
            <Plus className="h-4 w-4" /> Tambah SOAP
          </Button>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex shrink-0 items-center justify-center text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-3">Peringatan Medis</h3>
            {allergies.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {allergies.map((allergy: string) => (
                  <Badge key={allergy} variant="outline" className="bg-white dark:bg-slate-900 border-red-200 text-red-700 py-1.5 px-3 gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> {allergy.toUpperCase()}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-700/70">Tidak ada catatan medis atau alergi khusus.</p>
            )}
          </div>
        </div>
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase">Info Kontak Darurat</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Nama</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{patient?.emergency_contact_name || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Telepon</span>
                <span className="text-sm font-bold text-[#0D5A94] dark:text-blue-400">{patient?.emergency_contact_phone || "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── History ── */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[#0D5A94] dark:text-blue-400">Riwayat Klinis (SOAP)</h3>
        
        {records.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            Belum ada rekam medis untuk pasien ini.
          </div>
        ) : (
          <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 dark:bg-slate-800 dark:before:bg-slate-800">
            {records.map((rec: any, idx: number) => {
              const apt = appointments.find(a => a.id === rec.appointment_id);
              const isFirst = idx === 0;
              const prescriptions = (rec.attachments || []).filter((a: any) => a.type === "prescription");
              
              return (
                <div key={rec.id} className="relative">
                  <div className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-white dark:bg-slate-900 ${isFirst ? 'border-[#0D5A94]' : 'border-slate-300 dark:border-slate-600'}`}>
                    {isFirst && <div className="w-2 h-2 rounded-full bg-[#0D5A94]" />}
                  </div>
                  <Card className={`border-slate-100 dark:border-slate-800 shadow-sm transition-shadow ${!isFirst && 'opacity-80'}`}>
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                              {new Date(rec.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            {apt && (
                              <span className="px-2 py-0.5 bg-[#76f9d6]/30 text-[#00725d] rounded-full text-[10px] font-bold">
                                {apt.service?.name || "Konsultasi"}
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Rekam Medis SOAP</h4>
                        </div>
                        <Button onClick={() => setPrescriptionRecord(rec)} variant="outline" size="sm" className="h-8 text-xs font-bold text-[#0D5A94] border-[#0D5A94]/20 hover:bg-[#0D5A94]/5">
                          <Plus className="h-3 w-3 mr-1" /> Resep Obat
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Subjective (S)</span>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{rec.subjective || "-"}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Objective (O)</span>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{rec.objective || "-"}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Assessment (A)</span>
                          <p className="text-sm font-semibold text-[#0D5A94] dark:text-blue-400 whitespace-pre-wrap">{rec.assessment || "-"}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Plan (P)</span>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{rec.plan || "-"}</p>
                        </div>
                      </div>

                      {prescriptions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <h5 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <Pill className="h-3 w-3" /> Resep Obat Diberikan
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {prescriptions.map((px: any, i: number) => (
                              <div key={i} className="flex items-start gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                  <FileText className="h-4 w-4 text-[#006b57] dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{px.drug}</p>
                                  <p className="text-xs text-slate-500">{px.dosage} • {px.duration}</p>
                                  {px.notes && <p className="text-[10px] text-slate-400 mt-1 italic">"{px.notes}"</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MedicalRecordsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-slate-400">Memuat...</div>}>
      <MedicalRecordsContent />
    </Suspense>
  );
}
