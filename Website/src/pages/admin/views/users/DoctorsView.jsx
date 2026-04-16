// src/pages/admin/views/users/DoctorsView.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  X, User, Mail, Phone, MapPin,
  Lock, Unlock, Trash2, Edit3, AlertTriangle,
  Search, RefreshCw, Activity,
  Stethoscope, ShieldCheck, Star, Briefcase, FileText,
  Clock, CheckCircle2, AlertCircle, MoreVertical
} from "lucide-react";
import { T, HMS, getAdminTheme } from "../../adminTheme.js";
import { Card, Badge } from "../../AdminPrimitives.jsx";
import * as api from "../../../../services/api";

// ─── SUB-COMPONENTS (modals / drawer — kept exactly as original) ─────────────

function EditDoctorModal({ doctor, dk, onSave, onClose }) {
  const c = getAdminTheme(dk ?? true);
  const [activeTab, setActiveTab] = useState("account");
  const [form, setForm] = useState({
    first_name: doctor.first_name || "",
    last_name: doctor.last_name || "",
    email: doctor.email || "",
    phone: doctor.phone || "",
    wilaya: doctor.wilaya || "",
    specialty: doctor.specialty || "",
    license_number: doctor.license_number || "",
    experience_years: doctor.experience_years || "",
    bio: doctor.bio || "",
    consultation_fee: doctor.consultation_fee || "",
    clinic_name: doctor.clinic_name || ""
  });

  const field = (label, key, type = "text") => (
    <div key={key} className="space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: c.txt }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all focus:ring-2"
        style={{
          background: dk ? "rgba(255,255,255,0.03)" : "#F8FAFC",
          borderColor: c.border,
          color: c.txt,
          "--tw-ring-color": c.blue + "30"
        }}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card dk={dk} className="w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: c.border }}>
          <div>
            <h3 className="font-black text-sm uppercase tracking-wide" style={{ color: c.txt }}>Contrôle Total Médecin</h3>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">DR. {doctor.full_name} (#{doctor.id})</p>
          </div>
          <button onClick={onClose} style={{ color: c.txt3 }}><X size={20} /></button>
        </div>

        <div className="flex px-2 border-b bg-black/[0.02]" style={{ borderColor: c.border }}>
          {[
            { id: "account", label: "Compte", icon: User },
            { id: "professional", label: "Professionnel", icon: Briefcase },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "schedule", label: "Planning", icon: Clock },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-5 py-3 text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all border-b-2"
              style={{ color: activeTab === t.id ? c.blue : c.txt3, borderColor: activeTab === t.id ? c.blue : "transparent" }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "account" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-300">
               {field("Prénom", "first_name")}
               {field("Nom", "last_name")}
               {field("Email", "email", "email")}
               {field("Téléphone", "phone")}
               <div className="md:col-span-2">{field("Wilaya", "wilaya")}</div>
            </div>
          )}
          {activeTab === "professional" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-300">
               {field("Spécialité", "specialty")}
               {field("N° de Licence", "license_number")}
               {field("Expérience (ans)", "experience_years", "number")}
               {field("Tarif Consultation (DZD)", "consultation_fee", "number")}
               <div className="md:col-span-2">{field("Nom de la Clinique / Cabinet", "clinic_name")}</div>
               <div className="md:col-span-2">{field("Bio / Présentation", "bio", "textarea")}</div>
            </div>
          )}
          {activeTab === "documents" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-1 gap-2">
                  {doctor.docs?.map((d, i) => (
                    <Card key={i} dk={dk} className="p-3 border flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <FileText size={18} className="text-blue-500" />
                          <span className="text-xs font-bold">{d.title || `Document ${i+1}`}</span>
                       </div>
                       <div className="flex gap-2">
                          <button
                            onClick={() => window.open(d.file_url || d.url || "#", "_blank")}
                            className="text-[10px] uppercase font-black text-blue-500 hover:underline">Voir</button>
                          <span className="text-[10px] opacity-30">|</span>
                          <button
                            onClick={async () => {
                              if (!window.confirm(`Rejeter le document "${d.title || `Document ${i+1}`}" ?`)) return;
                              try { await api.rejectDoctorDocument(doctor.id, d.id ?? i); } catch (_) {}
                            }}
                            className="text-[10px] uppercase font-black text-red-500 hover:underline">Rejeter</button>
                       </div>
                    </Card>
                  ))}
                  {(!doctor.docs || doctor.docs.length === 0) && <p className="text-xs opacity-40 text-center py-10 italic">Aucun document soumis pour validation.</p>}
               </div>
            </div>
          )}
          {activeTab === "schedule" && (
             <div className="text-center py-10 opacity-40 italic text-xs">Aperçu du planning hebdomadaire en cours de chargement...</div>
          )}
        </div>

        <div className="p-6 border-t flex gap-3" style={{ borderColor: c.border }}>
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border" style={{ borderColor: c.border, color: c.txt2 }}>Annuler</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02]" style={{ background: c.blue }}>
             Valider les modifications
          </button>
        </div>
      </Card>
    </div>
  );
}

function DoctorDrawer({ doctor, dk, onClose, onEdit, onVerify, onToggleStatus }) {
  const c = getAdminTheme(dk ?? true);
  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-screen z-[90] w-full max-w-md bg-white border-l shadow-2xl flex flex-col" style={{ background: c.card, borderColor: c.border }}>
        <div className="p-6 border-b flex items-center justify-between shadow-sm" style={{ borderColor: c.border }}>
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-500/20">
                {doctor.full_name?.split(" ").map(n => n[0]).join("")}
             </div>
             <div>
               <p className="font-bold text-base" style={{ color: c.txt }}>DR. {doctor.full_name}</p>
               <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]">{doctor.specialty} · #{doctor.id}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl border hover:bg-black/5" style={{ borderColor: c.border, color: c.txt3 }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           {doctor.verification_status === "pending" && (
             <div className="p-4 rounded-2xl border-2 border-dashed border-amber-500/30 bg-amber-500/5 flex flex-col items-center text-center gap-4">
                <AlertCircle className="text-amber-500" size={32} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-600">En attente d'approbation</p>
                  <p className="text-[10px] opacity-70 mt-1">Le profil complet et les documents doivent être vérifiés avant l'activation.</p>
                </div>
                <button onClick={onVerify} className="w-full py-2.5 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-95 transition-all">Approuver maintenant</button>
             </div>
           )}

           <section className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30" style={{ color: c.txt }}>Activité & Performances</h4>
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-4 rounded-xl border bg-black/[0.01]">
                    <p className="text-2xl font-black">{doctor.patients_count || 0}</p>
                    <p className="text-[10px] uppercase font-black opacity-40">Consultations</p>
                 </div>
                 <div className="p-4 rounded-xl border bg-black/[0.01]">
                    <p className="text-2xl font-black text-amber-500">{doctor.rating || "—"}</p>
                    <p className="text-[10px] uppercase font-black opacity-40 text-amber-500 flex items-center gap-1"><Star size={10} fill="currentColor" /> Note</p>
                 </div>
              </div>
           </section>

           <section className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30" style={{ color: c.txt }}>Cabinet & Tarification</h4>
              <div className="space-y-3">
                 <div className="p-4 rounded-xl border bg-blue-500/5 border-blue-500/10">
                    <p className="text-[10px] uppercase font-black opacity-40 flex items-center gap-2"><Briefcase size={12} /> Établissement</p>
                    <p className="text-sm font-bold mt-1">{doctor.clinic_name || "Cabinet Principal"}</p>
                 </div>
                 <div className="p-4 rounded-xl border">
                    <p className="text-[10px] uppercase font-black opacity-40">Tarif Session</p>
                    <p className="text-xl font-black text-green-600">{doctor.consultation_fee} <span className="text-[10px] opacity-40">DZD</span></p>
                 </div>
                 <div className="p-4 rounded-xl border">
                    <p className="text-[10px] uppercase font-black opacity-40 mb-1">Résumé Biographie</p>
                    <p className="text-xs leading-relaxed opacity-70">{doctor.bio || "Le praticien n'a pas encore rédigé sa présentation."}</p>
                 </div>
              </div>
           </section>
        </div>

        <div className="p-6 border-t flex flex-col gap-2" style={{ borderColor: c.border }}>
           <button onClick={onEdit} className="w-full py-4 rounded-2xl bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all" style={{ background: c.blue }}>
             <Edit3 size={16} /> Édition Administrative
           </button>
           <button onClick={onToggleStatus} className="w-full py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
             style={{ borderColor: doctor.is_active ? c.red : c.green, color: doctor.is_active ? c.red : c.green }}>
             {doctor.is_active ? "Désactiver le praticien" : "Réactiver le praticien"}
           </button>
        </div>
      </aside>
    </>
  );
}

// ─── Row context menu ─────────────────────────────────────────────────────────
function RowMenu({ c, doctor, onEdit, onView }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: c.txt3 }}
        onMouseEnter={e => { e.currentTarget.style.background = c.row; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-8 z-30 rounded-lg border py-1 w-40 shadow-xl"
          style={{ background: c.card, borderColor: c.border }}
        >
          {[
            { label: "Voir le profil", action: () => { onView(); setOpen(false); } },
            { label: "Modifier",       action: () => { onEdit(); setOpen(false); } },
          ].map(a => (
            <button key={a.label} onClick={a.action}
              className="w-full text-left px-3 py-2 text-xs font-medium transition-colors"
              style={{ color: c.txt2 }}
              onMouseEnter={e => { e.currentTarget.style.background = c.row; e.currentTarget.style.color = c.txt; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.txt2; }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Avatar helper ────────────────────────────────────────────────────────────
function avatarColor(name = "", c) {
  const palette = [c.blue, c.green, c.amber, c.purple, "#60A5FA", "#34D399", "#F87171"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return palette[Math.abs(h) % palette.length];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_DOCTORS = [
  {
    id: 101, first_name: "Sarah", last_name: "Smith", email: "sarah.smith@medsmart.dz",
    full_name: "Sarah Smith",
    is_active: true, verification_status: "verified", specialty: "Cardiologie",
    wilaya: "Oran", phone: "+213 41 22 33 44", date_joined: "2024-01-08",
    rating: 4.9, patients_count: 142, clinic_name: "Clinique El-Bahia",
    consultation_fee: 3500, experience_years: 12, bio: "Spécialiste en cardiologie interventionnelle.",
    docs: [{ title: "Diplôme de médecine" }, { title: "Agrément d'exercice" }]
  },
  {
    id: 102, first_name: "Karim", last_name: "Benali", email: "karim.benali@medsmart.dz",
    full_name: "Karim Benali",
    is_active: true, verification_status: "pending", specialty: "Pédiatrie",
    wilaya: "Alger", phone: "+213 21 55 66 77", date_joined: "2024-02-15",
    rating: 4.7, patients_count: 89, clinic_name: "Cabinet Benali",
    consultation_fee: 2000, experience_years: 8, bio: "Passionné par la santé infantile.",
    docs: [{ title: "Certificat de spécialité" }]
  },
  {
    id: 103, first_name: "Yasmine", last_name: "Amara", email: "yasmine.amara@medsmart.dz",
    full_name: "Yasmine Amara",
    is_active: false, verification_status: "verified", specialty: "Généraliste",
    wilaya: "Constantine", phone: "+213 31 88 99 00", date_joined: "2024-03-01",
    rating: 4.5, patients_count: 210, clinic_name: "Centre Médical Cirta",
    consultation_fee: 1500, experience_years: 15, bio: "Médecine générale et préventive."
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DoctorsView({ dk }) {
  const c = getAdminTheme(dk ?? true);
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [vFilter, setVFilter] = useState("all"); // all | verified | pending

  const [selDoc, setSelDoc] = useState(null);
  const [editDoc, setEditDoc] = useState(null);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers({ role: "doctor" });
      const raw = Array.isArray(data) ? data : data?.results || [];
      const mapped = raw.map(u => ({
         ...u,
         full_name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email || "Doctor",
         specialty: u.specialty || "Généraliste",
         clinic_name: u.doctor_detail?.clinic_name || "",
         consultation_fee: u.doctor_detail?.consultation_fee || 0,
         experience_years: u.doctor_detail?.experience_years || 0,
         license_number: u.doctor_detail?.license_number || "",
         bio: u.doctor_detail?.bio || "",
         docs: u.submitted_documents || [],
      }));
      setDoctors(mapped);
    } catch (_err) {
      // keep mock data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchQ = !q || d.full_name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || (d.specialty || "").toLowerCase().includes(q);
    const matchV = vFilter === "all" || d.verification_status === vFilter;
    return matchQ && matchV;
  });

  const FILTERS = [
    { id: "all",      label: "Tous" },
    { id: "verified", label: "Vérifiés" },
    { id: "pending",  label: "En attente" },
  ];

  return (
    <div className="animate-in fade-in duration-300" style={{ minHeight: "100%" }}>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold" style={{ color: c.txt }}>Médecins</h2>
          <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>
            {doctors.length} praticien{doctors.length !== 1 ? "s" : ""} enregistré{doctors.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.txt3 }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nom, email, spécialité..."
              className="pl-8 pr-4 py-2 rounded-lg text-xs outline-none border w-52"
              style={{ background: c.card, borderColor: c.border, color: c.txt }}
            />
          </div>
          {/* Refresh */}
          <button
            onClick={fetchDocs}
            className="p-2 rounded-lg border transition-colors"
            style={{ borderColor: c.border, color: c.txt3 }}
            onMouseEnter={e => e.currentTarget.style.background = c.row}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Filter tabs ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 mb-4 border-b" style={{ borderColor: c.border }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setVFilter(f.id)}
            className="px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors"
            style={{
              borderColor: vFilter === f.id ? c.blue : "transparent",
              color: vFilter === f.id ? c.blue : c.txt3,
            }}
          >
            {f.label}
            {f.id !== "all" && (
              <span className="ml-1.5 text-[10px] opacity-60">
                ({doctors.filter(d => d.verification_status === f.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: c.border, background: c.card }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ background: c.header, borderBottom: `1px solid ${c.border}` }}>
                {["Médecin", "Email", "Spécialité", "Wilaya", "Statut", ""].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold uppercase tracking-wider"
                    style={{ color: c.txt3, fontSize: "10px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-xs" style={{ color: c.txt3 }}>
                    <RefreshCw size={16} className="animate-spin mx-auto mb-2" style={{ color: c.txt3 }} />
                    Chargement...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-xs" style={{ color: c.txt3 }}>
                    Aucun résultat
                  </td>
                </tr>
              ) : filtered.map((d, i) => {
                const initials = d.full_name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "?";
                const bg = avatarColor(d.full_name, c);
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelDoc(d, c)}
                    className="group cursor-pointer border-t transition-colors"
                    style={{ borderColor: c.border }}
                    onMouseEnter={e => e.currentTarget.style.background = c.row}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Name + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                          style={{ background: bg }}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: c.txt }}>Dr. {d.full_name}</p>
                          <p className="text-[10px]" style={{ color: c.txt3 }}>#{d.id}</p>
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-4 py-3" style={{ color: c.txt2 }}>{d.email}</td>
                    {/* Specialty */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{ background: c.blueFaint, color: c.blue }}>
                        {d.specialty}
                      </span>
                    </td>
                    {/* Wilaya */}
                    <td className="px-4 py-3" style={{ color: c.txt2 }}>{d.wilaya || "—"}</td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      {d.verification_status === "verified" ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold w-fit"
                          style={{ background: c.greenBg, color: c.green }}>
                          <CheckCircle2 size={10} /> Vérifié
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{ background: c.amberBg, color: c.amber }}>
                          En attente
                        </span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <RowMenu c={c}
                        doctor={d}
                        onView={() => setSelDoc(d)}
                        onEdit={() => setEditDoc(d)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Drawer */}
      {selDoc && (
        <DoctorDrawer doctor={selDoc} dk={dk ?? true} onClose={() => setSelDoc(null)}
          onEdit={() => { setEditDoc(selDoc); setSelDoc(null); }}
          onToggleStatus={async () => { await api.toggleSuspendUser(selDoc.id); fetchDocs(); setSelDoc(null); }}
          onVerify={async () => { await api.verifyUser(selDoc.id); fetchDocs(); setSelDoc(null); }}
        />
      )}
      {editDoc && (
        <EditDoctorModal doctor={editDoc} dk={dk ?? true} onClose={() => setEditDoc(null)}
          onSave={async f => { await api.updateAdminUser(editDoc.id, f); setEditDoc(null); fetchDocs(); }}
        />
      )}
    </div>
  );
}



