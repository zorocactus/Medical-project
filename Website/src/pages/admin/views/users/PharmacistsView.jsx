// src/pages/admin/views/users/PharmacistsView.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  X, User, Edit3,
  Search, RefreshCw,
  Store, ShieldCheck, CheckCircle2, MoreVertical, Building
} from "lucide-react";
import { T, HMS, getAdminTheme } from "../../adminTheme.js";
import { Card } from "../../AdminPrimitives.jsx";
import * as api from "../../../../services/api";

// ─── SUB-COMPONENTS (kept exactly as original) ────────────────────────────────

function EditPharmacistModal({ user, dk, onSave, onClose }) {
  const c = getAdminTheme(dk ?? true);
  const [activeTab, setActiveTab] = useState("account");
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || "",
    wilaya: user.wilaya || "",
    pharmacy_name: user.pharmacy_name || "",
    license_number: user.license_number || "",
    address: user.address || "",
    business_hours: user.business_hours || ""
  });

  const field = (label, key, type = "text") => (
    <div key={key} className="space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: c.txt }}>{label}</label>
      <input type={type} value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all focus:ring-2"
        style={{ background: dk ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderColor: c.border, color: c.txt, "--tw-ring-color": c.blue + "30" }}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card dk={dk} className="w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: c.border }}>
          <div>
            <h3 className="font-black text-sm uppercase tracking-wide" style={{ color: c.txt }}>Contrôle Pharmacien</h3>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{user.full_name} (#{user.id})</p>
          </div>
          <button onClick={onClose} style={{ color: c.txt3 }}><X size={20} /></button>
        </div>

        <div className="flex px-2 border-b bg-black/[0.02]" style={{ borderColor: c.border }}>
          {[
            { id: "account",  label: "Fiche Gérant",          icon: User },
            { id: "pharmacy", label: "Établissement & Légal", icon: Store },
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
               {field("Prénom", "first_name")}{field("Nom", "last_name")}
               {field("Email", "email", "email")}{field("Téléphone", "phone")}
               <div className="md:col-span-2">{field("Wilaya", "wilaya")}</div>
            </div>
          )}
          {activeTab === "pharmacy" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-300">
               <div className="md:col-span-2">{field("Nom de l'Officine / Pharmacie", "pharmacy_name")}</div>
               {field("N° Licence", "license_number")}
               {field("Horaires", "business_hours")}
               <div className="md:col-span-2">{field("Adresse précise", "address")}</div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex gap-3" style={{ borderColor: c.border }}>
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border" style={{ borderColor: c.border, color: c.txt2 }}>Annuler</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white" style={{ background: c.blue }}>Appliquer</button>
        </div>
      </Card>
    </div>
  );
}

function PharmacistDrawer({ user, dk, onClose, onEdit, onToggleStatus, onVerify }) {
  const c = getAdminTheme(dk ?? true);
  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-screen z-[90] w-full max-w-md bg-white border-l shadow-2xl flex flex-col" style={{ background: c.card, borderColor: c.border }}>
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: c.border }}>
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black bg-gradient-to-br from-pink-500 to-rose-700 shadow-lg shadow-rose-500/20">
                {user.full_name?.split(" ").map(n => n[0]).join("")}
             </div>
             <div>
               <p className="font-bold text-base" style={{ color: c.txt }}>{user.full_name}</p>
               <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]">Pharmacien · #{user.id}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl border hover:bg-black/5" style={{ borderColor: c.border, color: c.txt3 }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           <section className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30" style={{ color: c.txt }}>Information Officine</h4>
              <div className="space-y-3">
                 <Card dk={dk} className="p-4 border shadow-none bg-rose-500/[0.02]">
                    <div className="flex items-center gap-3 mb-2 text-rose-500">
                       <Store size={18} />
                       <p className="text-sm font-black">{user.pharmacy_name || "Pharmacie MedSmart"}</p>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed font-medium">{user.address || "Adresse non spécifiée"}</p>
                 </Card>
                 <div className="p-4 rounded-xl border"><p className="text-[10px] uppercase font-black opacity-40 mb-1">Licence / Agrément</p><p className="text-xs font-bold">{user.license_number || "En cours..."}</p></div>
                 <div className="p-4 rounded-xl border"><p className="text-[10px] uppercase font-black opacity-40 mb-1">Horaires d'ouverture</p><p className="text-xs font-bold">{user.business_hours || "08h - 20h"}</p></div>
              </div>
           </section>
        </div>

        <div className="p-6 border-t flex flex-col gap-2" style={{ borderColor: c.border }}>
           <button onClick={onEdit} className="w-full py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3" style={{ background: c.blue }}>
             <Edit3 size={16} /> Mettre à jour l'officine
           </button>
           <button onClick={onToggleStatus} className="w-full py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest"
             style={{ borderColor: user.is_active ? c.red : c.green, color: user.is_active ? c.red : c.green }}>
             {user.is_active ? "Suspendre l'agrément" : "Activer l'officine"}
           </button>
        </div>
      </aside>
    </>
  );
}

// ─── Row menu ─────────────────────────────────────────────────────────────────
function RowMenu({ c, onView, onEdit }) {
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
      <button onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: c.txt3 }}
        onMouseEnter={e => e.currentTarget.style.background = c.row}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
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
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.txt2; }}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function avatarColor(name = "", c) {
  const palette = [c.amber, c.blue, c.green, c.purple, "#F472B6"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return palette[Math.abs(h) % palette.length];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PHARMACISTS = [
  {
    id: 301, first_name: "Meriem", last_name: "Lounis", full_name: "Meriem Lounis",
    email: "m.lounis@pharmacie.dz", is_active: true, verification_status: "verified",
    wilaya: "Alger", pharmacy_name: "Pharmacie El Chifaa",
    license_number: "PH-2024-001", address: "12 Rue Didouche Mourad, Alger",
    business_hours: "08:00 - 00:00"
  },
  {
    id: 302, first_name: "Sofiane", last_name: "Kaci", full_name: "Sofiane Kaci",
    email: "sofiane.k@email.dz", is_active: true, verification_status: "pending",
    wilaya: "Alger", pharmacy_name: "Pharmacie Nouvelle",
    license_number: "PH-2024-042", address: "Hydra, Secteur 4",
    business_hours: "08:30 - 20:00"
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PharmacistsView({ dk }) {
  const c = getAdminTheme(dk ?? true);
  const [users, setUsers] = useState(MOCK_PHARMACISTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [vFilter, setVFilter] = useState("all");

  const [sel, setSel] = useState(null);
  const [edit, setEdit] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers({ role: "pharmacist" });
      const raw = Array.isArray(data) ? data : data?.results || [];
      setUsers(raw.map(u => ({
         ...u,
         full_name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email || "Pharmacist",
         pharmacy_name: u.pharmacist_detail?.pharmacy_name || "",
         license_number: u.pharmacist_detail?.license_number || "",
         address: u.pharmacist_detail?.address || "",
         business_hours: u.pharmacist_detail?.business_hours || "",
      })));
    } catch (_err) { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.full_name.toLowerCase().includes(q) || (u.pharmacy_name && u.pharmacy_name.toLowerCase().includes(q));
    const matchV = vFilter === "all" || u.verification_status === vFilter;
    return matchQ && matchV;
  });

  const FILTERS = [
    { id: "all",      label: "Tous" },
    { id: "verified", label: "Vérifiés" },
    { id: "pending",  label: "En attente" },
  ];

  return (
    <div className="animate-in fade-in duration-300" style={{ minHeight: "100%" }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold" style={{ color: c.txt }}>Pharmacies</h2>
          <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>
            {users.length} officine{users.length !== 1 ? "s" : ""} enregistrée{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.txt3 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nom, pharmacie..."
              className="pl-8 pr-4 py-2 rounded-lg text-xs outline-none border w-48"
              style={{ background: c.card, borderColor: c.border, color: c.txt }} />
          </div>
          <button onClick={fetchData} className="p-2 rounded-lg border"
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
          <button key={f.id} onClick={() => setVFilter(f.id)}
            className="px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors"
            style={{ borderColor: vFilter === f.id ? c.blue : "transparent", color: vFilter === f.id ? c.blue : c.txt3 }}>
            {f.label}
            {f.id !== "all" && (
              <span className="ml-1.5 text-[10px] opacity-60">
                ({users.filter(u => u.verification_status === f.id).length})
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
                {["Pharmacien / Officine", "Email", "Wilaya", "Licence", "Statut", ""].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold uppercase tracking-wider"
                    style={{ color: c.txt3, fontSize: "10px" }}>{h}</th>
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
                <tr><td colSpan="6" className="py-16 text-center text-xs" style={{ color: c.txt3 }}>Aucune officine répertoriée</td></tr>
              ) : filtered.map(u => {
                const initials = u.full_name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "?";
                const bg = avatarColor(u.full_name, c);
                return (
                  <tr key={u.id} onClick={() => setSel(u, c)}
                    className="group cursor-pointer border-t transition-colors"
                    style={{ borderColor: c.border }}
                    onMouseEnter={e => e.currentTarget.style.background = c.row}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: bg }}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: c.txt }}>{u.pharmacy_name || "Sans nom"}</p>
                          <p className="text-[10px]" style={{ color: c.txt3 }}>{u.full_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: c.txt2 }}>{u.email}</td>
                    <td className="px-4 py-3" style={{ color: c.txt2 }}>{u.wilaya || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px]" style={{ color: c.txt3 }}>{u.license_number || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      {u.verification_status === "verified" ? (
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
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <RowMenu c={c} onView={() => setSel(u)} onEdit={() => setEdit(u)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <PharmacistDrawer user={sel} dk={dk ?? true} onClose={() => setSel(null)}
          onEdit={() => { setEdit(sel); setSel(null); }}
          onToggleStatus={async () => { await api.toggleSuspendUser(sel.id); fetchData(); setSel(null); }}
          onVerify={async () => { await api.verifyUser(sel.id); fetchData(); setSel(null); }}
        />
      )}
      {edit && (
        <EditPharmacistModal user={edit} dk={dk ?? true} onClose={() => setEdit(null)}
          onSave={async f => { await api.updateAdminUser(edit.id, f); setEdit(null); fetchData(); }}
        />
      )}
    </div>
  );
}



