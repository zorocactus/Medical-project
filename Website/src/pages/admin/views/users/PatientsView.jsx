// src/pages/admin/views/users/PatientsView.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  X, User,
  Lock, Unlock, Edit3,
  Search, RefreshCw, Activity,
  Heart, Clock, CheckCircle2, MoreVertical
} from "lucide-react";
import { getAdminTheme } from "../../adminTheme.js";
import { Card } from "../../AdminPrimitives.jsx";
import * as api from "../../../../services/api";

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function EditPatientModal({ patient, dk, onSave, onClose }) {
  const c = getAdminTheme(dk);
  const [activeTab, setActiveTab] = useState("account");
  const [form, setForm] = useState({
    first_name: patient.first_name || "",
    last_name: patient.last_name || "",
    email: patient.email || "",
    phone: patient.phone || "",
    wilaya: patient.wilaya || "",
    blood_type: patient.blood_type || "",
    height: patient.height || "",
    weight: patient.weight || "",
    chronic_diseases: patient.chronic_diseases || "",
    current_medications: patient.current_medications || "",
    allergies: patient.allergies || ""
  });

  const field = (label, key, type = "text", placeholder = "") => (
    <div key={key} className="space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: c.txt }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
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
      <Card dk={dk} className="w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: c.border }}>
          <div>
            <h3 className="font-black text-sm uppercase tracking-wide" style={{ color: c.txt }}>Contrôle Total Patient</h3>
            <p className="text-[10px] font-bold opacity-40 uppercase">{patient.full_name} (#{patient.id})</p>
          </div>
          <button onClick={onClose} style={{ color: c.txt3 }} className="p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex px-2 border-b" style={{ borderColor: c.border, background: dk ? "rgba(0,0,0,0.1)" : "#fcfcfc" }}>
          {[
            { id: "account", label: "Compte & Contact", icon: User },
            { id: "medical", label: "Profil Médical", icon: Heart },
            { id: "history", label: "Historique RDV", icon: Clock },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-4 py-3 text-xs font-bold flex items-center gap-2 transition-all border-b-2"
              style={{ color: activeTab === t.id ? c.blue : c.txt3, borderColor: activeTab === t.id ? c.blue : "transparent" }}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "account" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {field("Prénom", "first_name")}
              {field("Nom", "last_name")}
              {field("Adresse Email", "email", "email")}
              {field("Numéro de Téléphone", "phone")}
              <div className="md:col-span-2">{field("Wilaya de résidence", "wilaya")}</div>
            </div>
          )}
          {activeTab === "medical" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {field("Groupe Sanguin", "blood_type", "text", "Ex: A+, O-")}
              <div className="grid grid-cols-2 gap-2">
                 {field("Taille (cm)", "height", "number")}
                 {field("Poids (kg)", "weight", "number")}
              </div>
              <div className="md:col-span-2">{field("Allergies", "allergies", "text", "Séparées par des virgules")}</div>
              <div className="md:col-span-2">{field("Maladies Chroniques", "chronic_diseases")}</div>
              <div className="md:col-span-2">{field("Médicaments Actuels", "current_medications")}</div>
            </div>
          )}
          {activeTab === "history" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 rounded-xl border bg-blue-500/5 border-blue-500/10">
                   <p className="text-xs font-bold text-blue-500 mb-2">Note de l'administrateur</p>
                   <p className="text-xs opacity-70 leading-relaxed">Les informations ci-dessous proviennent des dossiers remplis par les praticiens lors des consultations.</p>
                </div>
                <div className="space-y-2 opacity-50 italic text-center py-10 text-xs">
                   Aucun antécédent médical externe disponible pour le moment.
                </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex gap-3" style={{ borderColor: c.border }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-bold border transition-all hover:bg-black/5" style={{ borderColor: c.border, color: c.txt2 }}>Annuler</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]" style={{ background: c.blue }}>
             Enregistrer les modifications
          </button>
        </div>
      </Card>
    </div>
  );
}

function PatientDrawer({ patient, dk, onClose, onEdit, onToggleStatus }) {
  const c = getAdminTheme(dk);
  const [activeTab, setActiveTab] = useState("account");

  const field = (label, value) => (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: c.txt }}>{label}</label>
      <div
        className="w-full px-4 py-2.5 rounded-xl text-sm border"
        style={{
          background: dk ? "rgba(255,255,255,0.03)" : "#F8FAFC",
          borderColor: c.border,
          color: value ? c.txt : c.txt3,
        }}
      >
        {value || <span className="italic opacity-50">Non renseigné</span>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <Card dk={dk} className="w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: c.border }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-base font-black bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20">
              {patient.full_name?.split(" ").map(n => n[0]).slice(0,2).join("") || "?"}
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wide" style={{ color: c.txt }}>
                {patient.full_name}
              </h3>
              <p className="text-[10px] font-bold opacity-40 uppercase">Patient · #{patient.id}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: c.txt3 }} className="p-2 hover:bg-black/5 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex px-2 border-b" style={{ borderColor: c.border, background: dk ? "rgba(0,0,0,0.1)" : "#fcfcfc" }}>
          {[
            { id: "account", label: "Compte & Contact", icon: User },
            { id: "medical", label: "Profil Médical",   icon: Heart },
            { id: "history", label: "Historique RDV",   icon: Clock },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-4 py-3 text-xs font-bold flex items-center gap-2 transition-all border-b-2"
              style={{ color: activeTab === t.id ? c.blue : c.txt3, borderColor: activeTab === t.id ? c.blue : "transparent" }}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "account" && (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                {field("Prénom",  patient.first_name)}
                {field("Nom",     patient.last_name)}
              </div>
              {field("Adresse Email",      patient.email)}
              {field("Numéro de Téléphone", patient.phone)}
              {field("Wilaya de résidence", patient.wilaya)}
              <div className="mt-2 pt-3 border-t" style={{ borderColor: c.border }}>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 block mb-2" style={{ color: c.txt }}>Statut du compte</label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
                  style={{
                    background: dk ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    borderColor: c.border,
                  }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: patient.is_active ? c.green : c.red }} />
                  <span className="text-sm font-semibold" style={{ color: patient.is_active ? c.green : c.red }}>
                    {patient.is_active ? "Actif" : "Suspendu"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "medical" && (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                {field("Groupe Sanguin", patient.blood_type)}
                <div className="grid grid-cols-2 gap-2">
                  {field("Taille (cm)", patient.height)}
                  {field("Poids (kg)",  patient.weight)}
                </div>
              </div>
              {field("Allergies",          patient.allergies)}
              {field("Maladies Chroniques", patient.chronic_diseases)}
              {field("Médicaments Actuels", patient.current_medications)}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 rounded-xl border bg-blue-500/5 border-blue-500/10">
                <p className="text-xs font-bold text-blue-500 mb-2">Note de l'administrateur</p>
                <p className="text-xs opacity-70 leading-relaxed">
                  Les informations ci-dessous proviennent des dossiers remplis par les praticiens lors des consultations.
                </p>
              </div>
              <div className="py-10 text-center opacity-50 italic text-xs" style={{ color: c.txt3 }}>
                Aucun antécédent médical externe disponible pour le moment.
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="p-6 border-t flex gap-3" style={{ borderColor: c.border }}>
          <button onClick={onEdit}
            className="flex-1 py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{ background: c.blue }}>
            <Edit3 size={14} /> Modifier
          </button>
          <button onClick={onToggleStatus}
            className="flex-1 py-3 rounded-xl text-xs font-bold border transition-all hover:opacity-80 flex items-center justify-center gap-2"
            style={{ borderColor: patient.is_active ? c.red : c.green, color: patient.is_active ? c.red : c.green }}>
            {patient.is_active
              ? <><Lock size={14} /> Suspendre</>
              : <><Unlock size={14} /> Réactiver</>}
          </button>
        </div>
      </Card>
    </div>
  );
}

// ─── Row menu ─────────────────────────────────────────────────────────────────
function RowMenu({ onView, onEdit, c }) {
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
        <div className="absolute right-0 top-8 z-30 rounded-lg border py-1 w-40 shadow-xl"
          style={{ background: c.card, borderColor: c.border }}>
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

function avatarColor(name = "", c) {
  const palette = [c.blue, c.green, c.amber, c.purple, "#60A5FA", "#34D399"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return palette[Math.abs(h) % palette.length];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PATIENTS = [
  {
    id: 1, first_name: "Samir", last_name: "Hadj", full_name: "Samir Hadj", email: "samir.hadj@email.dz",
    is_active: true, verification_status: "verified", date_joined: "2024-01-15",
    wilaya: "Alger", phone: "+213 550 11 22 33", blood_type: "A+",
    height: 178, weight: 75, allergies: "Pénicilline",
    chronic_diseases: "Hypertension légère", current_medications: "Amlodipine 5mg"
  },
  {
    id: 2, first_name: "Fatima", last_name: "Bensalah", full_name: "Fatima Bensalah", email: "fatima.bensalah@email.dz",
    is_active: true, verification_status: "verified", date_joined: "2024-02-20",
    wilaya: "Oran", phone: "+213 561 44 55 66", blood_type: "O+",
    height: 165, weight: 62, allergies: "Pollen, Poussière",
    chronic_diseases: "Diabète Type 2", current_medications: "Metformine"
  },
  {
    id: 3, first_name: "Omar", last_name: "Meziani", full_name: "Omar Meziani", email: "omar.meziani@email.dz",
    is_active: false, verification_status: "verified", date_joined: "2024-03-10",
    wilaya: "Constantine", phone: "+213 550 77 88 99", blood_type: "B-",
    height: 182, weight: 88, allergies: "Aspirine, Ibuprofène",
    chronic_diseases: "Asthme", current_medications: "Ventoline"
  },
  {
    id: 4, first_name: "Zohra", last_name: "Boudiaf", full_name: "Zohra Boudiaf", email: "zohra.b@email.dz",
    is_active: true, verification_status: "pending", date_joined: "2024-04-01",
    wilaya: "Alger", phone: "+213 552 11 44 77", blood_type: "AB+",
    height: 160, weight: 55, allergies: "Aucune",
    chronic_diseases: "Aucune", current_medications: "Aucun"
  },
];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PatientsView({ dk }) {
  const c = getAdminTheme(dk ?? true);
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers({ role: "patient" });
      const raw = Array.isArray(data) ? data : data?.results || [];
      setPatients(raw.map(u => ({
         ...u,
         full_name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email || "Patient",
         blood_type: u.patient_detail?.medical_profile?.blood_group || "",
         height: u.patient_detail?.medical_profile?.height || "",
         weight: u.patient_detail?.medical_profile?.weight || "",
         chronic_diseases: u.patient_detail?.medical_profile?.chronic_diseases || "",
         current_medications: u.patient_detail?.medical_profile?.current_medications || "",
         allergies: u.patient_detail?.medical_profile?.allergies || "",
      })));
    } catch (_err) {
      // keep mock
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const handleUpdate = async formData => {
    try {
      await api.updateAdminUser(editPatient.id, formData);
      setEditPatient(null);
      fetchPatients();
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
    let matchS = true;
    if (statusFilter === "active")    matchS = p.is_active && p.status !== "pending";
    if (statusFilter === "pending")   matchS = p.status === "pending";
    if (statusFilter === "suspended") matchS = !p.is_active;
    return matchQ && matchS;
  });

  const FILTERS = [
    { id: "all",       label: "Tous" },
    { id: "active",    label: "Actifs" },
    { id: "pending",   label: "En attente" },
    { id: "suspended", label: "Suspendus" },
  ];

  return (
    <div className="animate-in fade-in duration-300" style={{ minHeight: "100%" }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold" style={{ color: c.txt }}>Patients</h2>
          <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>
            {patients.length} patient{patients.length !== 1 ? "s" : ""} enregistré{patients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.txt3 }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nom, email..."
              className="pl-8 pr-4 py-2 rounded-lg text-xs outline-none border w-48"
              style={{ background: c.card, borderColor: c.border, color: c.txt }}
            />
          </div>
          <button onClick={fetchPatients} className="p-2 rounded-lg border"
            style={{ borderColor: c.border, color: c.txt3 }}
            onMouseEnter={e => e.currentTarget.style.background = c.row}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 border-b" style={{ borderColor: c.border }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setStatusFilter(f.id)}
            className="px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors"
            style={{ borderColor: statusFilter === f.id ? c.blue : "transparent", color: statusFilter === f.id ? c.blue : c.txt3 }}>
            {f.label}
            {f.id !== "all" && (
              <span className="ml-1.5 text-[10px] opacity-60">
                ({patients.filter(p => f.id === "active" ? p.is_active : !p.is_active).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: c.border, background: c.card }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ background: c.header, borderBottom: `1px solid ${c.border}` }}>
                {["Patient", "Email", "Wilaya", "Groupe sanguin", "Statut", ""].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold uppercase tracking-wider"
                    style={{ color: c.txt3, fontSize: "10px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="py-16 text-center text-xs" style={{ color: c.txt3 }}>
                  <RefreshCw size={16} className="animate-spin mx-auto mb-2" style={{ color: c.txt3 }} />
                  Chargement...
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="py-16 text-center text-xs" style={{ color: c.txt3 }}>Aucun résultat</td></tr>
              ) : filtered.map(p => {
                const initials = p.full_name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "?";
                const bg = avatarColor(p.full_name, c);
                return (
                  <tr key={p.id} onClick={() => setSelectedPatient(p)}
                    className="group cursor-pointer border-t transition-colors"
                    style={{ borderColor: c.border }}
                    onMouseEnter={e => e.currentTarget.style.background = c.row}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                          style={{ background: p.is_active ? bg : c.txt3 }}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: c.txt }}>{p.full_name}</p>
                          <p className="text-[10px]" style={{ color: c.txt3 }}>#{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: c.txt2 }}>{p.email}</td>
                    <td className="px-4 py-3" style={{ color: c.txt2 }}>{p.wilaya || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ background: c.redBg, color: c.red }}>
                        {p.blood_type || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.is_active ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold w-fit"
                          style={{ background: c.greenBg, color: c.green }}>
                          <CheckCircle2 size={10} /> Actif
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{ background: c.redBg, color: c.red }}>
                          Suspendu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <RowMenu
                        c={c}
                        onView={() => setSelectedPatient(p)}
                        onEdit={() => setEditPatient(p)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPatient && (
        <PatientDrawer patient={selectedPatient} dk={dk ?? true} onClose={() => setSelectedPatient(null)}
          onEdit={() => { setEditPatient(selectedPatient); setSelectedPatient(null); }}
          onToggleStatus={async () => { await api.toggleSuspendUser(selectedPatient.id); fetchPatients(); setSelectedPatient(null); }}
        />
      )}
      {editPatient && (
        <EditPatientModal patient={editPatient} dk={dk ?? true} onClose={() => setEditPatient(null)} onSave={handleUpdate} />
      )}
    </div>
  );
}
