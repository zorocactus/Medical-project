import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import * as api from "../../services/api";
import {
  Users, Heart, Calendar, Star, CheckCircle2, Circle, Phone, AlertCircle,
  MoreHorizontal, ChevronRight, MapPin, ShieldAlert, Navigation, Activity,
  Droplet, User, UserPlus, Bell, Pill, X, ChevronLeft, FileText, Trash2,
  Plus, ShoppingCart, AlertTriangle, Search, Filter, Minus, RefreshCw,
  QrCode, Download, Eye, EyeOff, Clock, ExternalLink, Stethoscope, Shield, Settings,
  ClipboardList, ChevronDown, LogOut, Menu, Sun, Moon, Check,
  Link as LinkIcon
} from "lucide-react";

// ─── Theme tokens (Identical to Doctor/Patient Dashboard) ────────────────────
const T = {
  light: {
    bg: "#F0F4F8",
    card: "#ffffff",
    nav: "#ffffff",
    border: "#E4EAF5",
    txt: "#0D1B2E",
    txt2: "#5A6E8A",
    txt3: "#9AACBE",
    blue: "#4A6FA5",
    blueLight: "#EEF3FB",
    green: "#2D8C6F",
    amber: "#E8A838",
    red: "#E05555",
    purple: "#7B5EA7",
  },
  dark: {
    bg: "#0D1117",
    card: "#141B27",
    nav: "#141B27",
    border: "rgba(99,142,203,0.15)",
    txt: "#F0F3FA",
    txt2: "#8AAEE0",
    txt3: "#4A6080",
    blue: "#638ECB",
    blueLight: "#1A2333",
    green: "#4CAF82",
    amber: "#F0A500",
    red: "#E05555",
    purple: "#9B7FD4",
  },
};

// ─── Reusable Card Component ──────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border transition-all ${className}`}
      style={{ background: c.card, borderColor: c.border, ...style }}
    >
      {children}
    </div>
  );
}

// ─── StatCard component ───────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <Card dk={dk} className="group hover:border-blue-500/30">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: color + "18" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold leading-tight" style={{ color: c.txt }}>
          {value}
        </div>
        <div className="text-[11px] font-bold uppercase tracking-widest mt-2" style={{ color: c.txt3 }}>
          {label}
        </div>
        {sub && (
          <div className="text-[10px] font-bold mt-1 uppercase tracking-tighter" style={{ color: c.blue }}>
            {sub}
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// CONSTANTES STATIQUES
// ============================================================================

const SAMPLE_REQUESTS = [
  { id: 1, patientName: "Nadia Khelifa", age: 58, location: "Algiers Center (2.5 km away)", condition: "Diabetes T2 Monitoring", duration: "Full-time (8h/day)", pay: "45,000 DA/month", posted: "2 hours ago", urgency: "Normal", initials: "NK" },
  { id: 2, patientName: "Youcef Belaid", age: 72, location: "El Biar (4.8 km away)", condition: "Post-cardiac surgery care", duration: "Night shift (10h)", pay: "55,000 DA/month", posted: "5 hours ago", urgency: "High", initials: "YB" },
  { id: 3, patientName: "Meriem Kaci", age: 32, location: "Sidi Yahia (1.2 km away)", condition: "Temporary disability support", duration: "Part-time (4h/day)", pay: "28,000 DA/month", posted: "Yesterday", urgency: "Normal", initials: "MK" }
];

const INITIAL_STOCK = [
  { id: 1, name: "Metformin 500mg", quantity: 8, threshold: 10, unit: "tablets", status: "low" },
  { id: 2, name: "Aspirin 75mg", quantity: 42, threshold: 15, unit: "tablets", status: "ok" },
  { id: 3, name: "Lisinopril 10mg", quantity: 5, threshold: 10, unit: "tablets", status: "critical" },
  { id: 4, name: "Paracetamol 500mg", quantity: 12, threshold: 5, unit: "tablets", status: "ok" }
];

const SAMPLE_PRESCRIPTIONS = [
  {
    id: "#RX-4482", date: "24 Oct 2023", doctor: "Dr. Kamel Benali", specialty: "Cardiologist", patient: "Ahmed Meziane", status: "Active",
    medications: [
      { name: "Metformin", dosage: "500mg", freq: "Twice daily" },
      { name: "Aspirin", dosage: "75mg", freq: "Once daily" }
    ]
  },
  {
    id: "#RX-3921", date: "12 Sep 2023", doctor: "Dr. Sara Meziane", specialty: "General Practitioner", patient: "Ahmed Meziane", status: "Expired",
    medications: [
      { name: "Amoxicillin", dosage: "1g", freq: "Three times daily" }
    ]
  }
];

// ─── WILAYAS_LIST ─────────────────────────────────────────────────────────────
const WILAYAS_LIST = [
  "Alger","Oran","Constantine","Annaba","Blida","Batna","Sétif","Tlemcen",
  "Tizi Ouzou","Béjaïa","Jijel","Médéa","Mostaganem","Bouira","Bordj Bou Arréridj",
  "Boumerdès","Tipaza","Aïn Defla","Tissemsilt","Relizane","Chlef","Skikda",
  "Guelma","Souk Ahras","El Tarf","Mila","Khenchela","Oum El Bouaghi","Tébessa",
  "Biskra","Djelfa","Laghouat","El Bayadh","Naâma","Saïda","Mascara","Tiaret",
  "Adrar","Béchar","Tamanrasset","Illizi","Tindouf","El Oued","Ouargla",
  "Ghardaïa","Aïn Témouchent","Sidi Bel Abbès","Mascara","Autres",
];

// ─── EmergencyModal (copie exacte du Patient Dashboard) ──────────────────────
function EmergencyModal({ onClose, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-md shadow-2xl border-2"
        style={{ background: c.card, borderColor: "#E05555" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(224,85,85,0.15)" }}
            >
              <AlertTriangle size={22} style={{ color: "#E05555" }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: c.txt }}>
                Emergency Alert
              </h3>
              <p className="text-xs" style={{ color: c.txt2 }}>
                Contacts will be notified immediately
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <X size={18} style={{ color: c.txt3 }} />
          </button>
        </div>
        <div
          className="rounded-xl p-4 mb-5"
          style={{
            background: "rgba(224,85,85,0.08)",
            border: "1px solid rgba(224,85,85,0.2)",
          }}
        >
          <p className="text-sm" style={{ color: c.txt2 }}>
            This will alert{" "}
            <strong style={{ color: c.txt }}>your emergency contacts</strong>{" "}
            and share your GPS location with nearby medical services.
          </p>
        </div>
        <div className="space-y-3 mb-4">
          <button
            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: "#E05555", boxShadow: "0 4px 20px rgba(224,85,85,0.4)" }}
          >
            <Phone size={16} /> Call 15 (SAMU) Now
          </button>
          <button
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{
              background: "rgba(224,85,85,0.1)",
              color: "#E05555",
              border: "1px solid rgba(224,85,85,0.2)",
            }}
          >
            <MapPin size={15} /> Share My Location
          </button>
          <button
            className="w-full py-3 rounded-xl font-semibold transition-colors"
            style={{
              background: "rgba(224,85,85,0.06)",
              color: "#E05555",
              border: "1px solid rgba(224,85,85,0.15)",
            }}
          >
            Notify Emergency Contact
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-sm font-medium rounded-xl transition-colors"
          style={{ color: c.txt3, background: "transparent", border: `1px solid ${c.border}` }}
        >
          Cancel — I'm fine
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SOUS-COMPOSANTS
// ============================================================================

function HomeView({ onChangePage, dk, c, setEmergency }) {
  const { user } = useAuth();
  const { gmPatients: patients } = useData();
  const userName = user?.firstName || "Fatima";

  const schedule = patients.length === 0 ? [] : [
    { time: "8:00 AM", name: "Alex — Lisinopril 10mg", status: "done" },
    { time: "9:00 AM", name: "Youcef — Warfarin 5mg", status: "done" },
    { time: "12:00 PM", name: "Nadia — Metformin 500mg", status: "done" },
    { time: "2:30 PM", name: "Alex — Metformin 500mg", status: "pending", in: "2h 30min" },
    { time: "5:00 PM", name: "Youcef — Amiodarone 200mg", status: "pending", in: "5h" },
    { time: "8:00 PM", name: "All — Evening doses", status: "pending" },
  ];

  const emergencyContacts = patients.length === 0 ? [] : [
    { name: "Dr. Benali Karim", role: "Primary physician", initials: "BK", color: c.green },
    { name: "SAMU 15", role: "Medical emergency", initials: "15", color: c.red },
    { name: "Alex's Family", role: "+213 555 890 123", initials: "FJ", color: c.blue },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: c.txt }}>
            Bonjour, <span style={{ color: c.blue }}>{userName}</span>
          </h1>
          <p className="text-sm font-medium uppercase tracking-wider" style={{ color: c.txt3 }}>
            Jeudi 24 Octobre · {patients.length} patients à votre charge
          </p>
        </div>
        <button
          onClick={() => setEmergency(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg"
          style={{ background: "linear-gradient(135deg, #E05555, #c93535)", color: "#fff" }}
        >
          <AlertTriangle size={15} /> URGENCE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Patients suivis" value={patients.length.toString()} icon={Users} color={c.blue} dk={dk} />
        <StatCard label="Traitements aujourd'hui" value="7" sub="4 terminés · 3 en attente" icon={Heart} color={c.red} dk={dk} />
        <StatCard label="Rendez-vous" value="2" icon={Calendar} color={c.green} dk={dk} />
        <StatCard label="Ma Note" value="4.8" sub="48 avis" icon={Star} color={c.amber} dk={dk} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: c.txt3 }}>MES PATIENTS</h2>
            <button onClick={() => onChangePage("myPatients")} className="text-xs font-bold hover:underline" style={{ color: c.blue }}>Voir tout</button>
          </div>
          <div className="space-y-4">
            {patients.length === 0 ? (
              <Card dk={dk} className="h-48 flex flex-col items-center justify-center text-center">
                <Users size={32} style={{ color: c.txt3, opacity: 0.5 }} className="mb-4" />
                <p style={{ color: c.txt3 }}>Aucun patient assigné.</p>
              </Card>
            ) : patients.map((patient) => (
              <Card key={patient.id} dk={dk} className="group overflow-hidden relative hover:border-blue-500/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white"
                      style={{ background: patient.color === 'blue' ? c.blue : patient.color === 'amber' ? c.amber : c.green }}>
                      {patient.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold transition-colors group-hover:text-blue-500" style={{ color: c.txt }}>{patient.name}</h3>
                      <p className="text-xs font-medium" style={{ color: c.txt3 }}>{patient.condition}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                    style={{ 
                      background: dk ? "rgba(99,142,203,0.1)" : "#EEF3FB", 
                      borderColor: c.border,
                      color: patient.status === 'Stable' ? c.blue : patient.status === 'Monitor' ? c.amber : c.green
                    }}>
                    {patient.status}
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.txt3 }}>Adhésion cette semaine</span>
                    <span className="text-[10px] font-bold" style={{ color: c.txt2 }}>{patient.adherence}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: dk ? "#1A2333" : "#E4EAF5" }}>
                    <div className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${patient.adherence}%`,
                        background: patient.color === 'blue' ? c.blue : patient.color === 'amber' ? c.amber : c.green 
                      }}>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] italic" style={{ color: c.txt3 }}>Prochain soin dans {patient.nextMed}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => onChangePage("patientProfile")} className="px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border"
                    style={{ background: dk ? "rgba(255,255,255,0.05)" : "#fff", borderColor: c.border, color: c.txt2 }}>
                    Profil
                  </button>
                  <button onClick={() => onChangePage("emergencies")} className="px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white">
                    Alerter Médecin
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <Card dk={dk}>
            <h3 className="text-sm font-bold mb-6" style={{ color: c.txt }}>Planning Médicaments</h3>
            <div className="space-y-4">
              {schedule.length === 0 ? (
                <div className="text-center py-6 text-sm" style={{ color: c.txt3 }}>Aucun soin prévu.</div>
              ) : schedule.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <button className="mt-0.5 shrink-0">
                    {item.status === 'done' ? <CheckCircle2 size={18} style={{ color: c.green }} /> : <Circle size={18} style={{ color: c.border }} className="group-hover:text-blue-500 transition-colors" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-xs font-bold leading-none ${item.status === 'done' ? 'font-medium opacity-50' : ''}`} style={{ color: c.txt }}>{item.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold" style={{ color: c.txt3 }}>{item.time}</span>
                      {item.status === 'done' ? <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.green }}>Fait</span> : item.in && <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.blue }}>dans {item.in}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card dk={dk} style={{ borderLeftWidth: 4, borderLeftColor: c.red }}>
            <div className="flex items-center gap-2 text-red-500 mb-6">
              <AlertCircle size={18} />
              <h3 className="text-sm font-bold" style={{ color: c.txt }}>Contacts d'Urgence</h3>
            </div>
            <div className="space-y-4">
              {emergencyContacts.length === 0 ? (
                <div className="text-center py-6 text-sm" style={{ color: c.txt3 }}>Aucun contact.</div>
              ) : emergencyContacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ background: dk ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderColor: c.border }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: contact.color }}>{contact.initials}</div>
                    <div>
                      <p className="text-xs font-bold leading-none" style={{ color: c.txt }}>{contact.name}</p>
                      <p className="text-[10px] font-medium mt-1" style={{ color: c.txt3 }}>{contact.role}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-blue-500/20">Appel</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EmergenciesView({ dk, c }) {
  const { gmPatients: patients } = useData();

  const emergencyContacts = [
    { name: "Dr. Benali Karim", role: "Médecin Traitant · Cardiologie", initials: "BK", action: "Appel", color: c.green },
    { name: "SAMU — 15", role: "Secours Médicaux", initials: "15", action: "Appel", color: c.red },
    ...(patients.length > 0 ? [{ name: "Famille Johnson", role: "+213 555 890 123", initials: "FJ", action: "Appel", color: c.blue }] : []),
    { name: "CHU Alger Central", role: "Hôpital plus proche · 2.3 km", initials: "HA", action: "Itinéraire", color: c.amber },
  ];

  const procedures = [
    { title: "Douleur Thoracique / Crise Cardiaque", steps: ["Appeler le SAMU 15 immédiatement", "Garder le patient calme et immobile", "Ne PAS donner de médicaments", "Partager la position GPS via l'app"], color: c.red },
    { title: "Hypoglycémie (Sucre Bas)", steps: ["Donner du sucre ou un jus", "Réévaluer après 15 min", "Si inconscient — appeler le SAMU 15"], color: c.amber },
    { title: "Crise d'Hypertension", steps: ["Faire asseoir le patient", "Remesurer après 5 min", "Systolique >180 → SAMU immédiat"], color: c.blue }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2" style={{ color: c.txt }}>Protocoles d'Urgence</h1>
        <p className="text-sm font-medium tracking-tight" style={{ color: c.txt3 }}>Contacts et procédures pour les situations critiques</p>
      </header>

      <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 group border-2"
        style={{ background: dk ? "rgba(224,85,85,0.05)" : "#FFF5F5", borderColor: c.red + "33" }}>
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500"
              style={{ background: c.red }}>
              <ShieldAlert size={32} />
            </div>
            <div>
               <h2 className="text-xl font-bold mb-2" style={{ color: c.red }}>Activer l'Alerte d'Urgence</h2>
               <p className="text-sm font-medium" style={{ color: c.txt2 }}>Notifie médecins et famille avec position GPS</p>
            </div>
         </div>
         <button className="w-full md:w-auto px-10 py-4 text-white font-bold rounded-2xl text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
           style={{ background: c.red, boxShadow: `0 8px 30px ${c.red}33` }}>
            🚨 ACTIVER MAINTENANT
         </button>
      </div>

      {patients.length === 0 ? (
        <Card dk={dk} className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <ShieldAlert size={48} style={{ color: c.border }} className="mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: c.txt }}>Aucun Profil d'Urgence</h2>
          <p className="text-sm" style={{ color: c.txt3 }}>Ajoutez des patients pour voir leurs contacts et procédures spécifiques.</p>
        </Card>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-base font-bold mb-4" style={{ color: c.txt }}>Contacts d'Urgence</h2>
          <div className="space-y-4">
             {emergencyContacts.map((contact, i) => (
               <Card key={i} dk={dk} className="flex items-center justify-between hover:border-blue-500/20">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                       style={{ background: contact.color }}>{contact.initials}</div>
                     <div>
                        <p className="text-sm font-bold leading-none mb-1.5" style={{ color: c.txt }}>{contact.name}</p>
                        <p className="text-[11px] font-medium" style={{ color: c.txt3 }}>{contact.role}</p>
                     </div>
                  </div>
                  <button className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${contact.action === 'Appel' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500 hover:text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    style={{ borderColor: c.border, color: contact.action === 'Appel' ? c.blue : c.txt3 }}>{contact.action}</button>
               </Card>
             ))}
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-base font-bold mb-4" style={{ color: c.txt }}>Procédures</h2>
          <div className="space-y-4">
             {procedures.map((proc, i) => (
               <div key={i} className="p-6 rounded-2xl border transition-all"
                 style={{ background: proc.color + "08", borderColor: proc.color + "22" }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: proc.color }}>{proc.title}</h3>
                  <div className="space-y-2">
                    {proc.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-medium" style={{ color: c.txt2 }}>
                         <span className="font-bold shrink-0" style={{ color: proc.color }}>{idx + 1}.</span>
                         <span>{step}</span>
                      </div>
                    ))}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function JobRequestsView({ dk, c }) {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: c.txt }}>Offres de Missions</h1>
          <p className="text-sm font-medium" style={{ color: c.txt3 }}>Nouvelles opportunités dans votre zone</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm"
          style={{ background: c.blue + "10", borderColor: c.blue + "20", color: c.blue }}>
          <Users size={16} /> {SAMPLE_REQUESTS.length} Missions trouvées
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {["Tous", "Temps complet", "Temps partiel", "Nuit", "Court terme"].map((filter, i) => (
          <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${i === 0 ? "text-white shadow-md shadow-blue-500/20" : "hover:bg-blue-500/10"}`}
            style={{ background: i === 0 ? c.blue : "transparent", borderColor: i === 0 ? c.blue : c.border, color: i === 0 ? "#fff" : c.txt3 }}>
            {filter}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {SAMPLE_REQUESTS.map((req) => (
          <Card key={req.id} dk={dk} className="hover:shadow-md group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl border transition-all duration-300 group-hover:text-white"
                  style={{ background: c.blue + "10", color: c.blue, borderColor: c.blue + "20" }}>
                  {req.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: c.txt }}>{req.patientName}</h3>
                  <p className="text-sm font-medium" style={{ color: c.txt3 }}>{req.age} ans · {req.condition}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 flex-1 border-y lg:border-y-0 lg:border-x py-4 lg:py-0 lg:px-8"
                style={{ borderColor: c.border }}>
                <div className="flex items-center gap-3 text-sm font-medium" style={{ color: c.txt2 }}><MapPin size={16} style={{ color: c.blue }} />{req.location}</div>
                <div className="flex items-center gap-3 text-sm font-medium" style={{ color: c.txt2 }}><Clock size={16} style={{ color: c.blue }} />{req.duration}</div>
                <div className="flex items-center gap-3 text-sm font-bold" style={{ color: c.txt }}><Calendar size={16} style={{ color: c.blue }} />{req.pay}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider h-fit mr-4 border"
                  style={{ 
                    color: req.urgency === 'High' ? c.red : c.blue, 
                    background: req.urgency === 'High' ? c.red + "15" : c.blue + "15",
                    borderColor: req.urgency === 'High' ? c.red + "25" : c.blue + "25"
                  }}>
                  {req.urgency}
                </div>
                <button className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md active:scale-95"
                  style={{ background: c.blue }}>Détails</button>
                <div className="flex items-center gap-1.5">
                   <button className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-emerald-500 hover:text-white"
                     style={{ background: c.green + "15", borderColor: c.green + "25", color: c.green }}><CheckCircle2 size={18} /></button>
                   <button className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"
                     style={{ background: c.red + "15", borderColor: c.red + "25", color: c.red }}><X size={18} /></button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MyPatientsView({ onChangePage, dk, c }) {
  const { gmPatients: patients, loadGMDemoData } = useData();

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2" style={{ color: c.txt }}>Mes Patients</h1>
        <p className="font-medium" style={{ color: c.txt3 }}>{patients.length} patients assignés à votre charge</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {patients.length === 0 ? (
          <Card dk={dk} className="col-span-full flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: c.blue + "15", color: c.blue }}><UserPlus size={32} /></div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: c.txt }}>Aucun Patient Assigné</h2>
            <p className="text-sm max-w-md mb-8" style={{ color: c.txt3 }}>Vous n'avez pas encore été assigné à des patients. Cliquez ci-dessous pour charger les données de test.</p>
            <button onClick={loadGMDemoData} className="px-8 py-3 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              style={{ background: c.blue }}>
              Ajouter Patients Démo (Alex, Youcef, Nadia)
            </button>
          </Card>
        ) : patients.map((p) => (
          <Card key={p.id} dk={dk} className="p-8 group relative overflow-hidden hover:shadow-xl hover:border-blue-500/20">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[80px] opacity-10"
              style={{ background: p.color === 'blue' ? c.blue : p.color === 'amber' ? c.amber : c.green }}></div>
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                style={{ background: dk ? "#1F2937" : "#F8FAFC", borderColor: c.border }}>
                <span style={{ color: dk ? "#fff" : c.blue }}>{p.initials}</span>
              </div>
              <div>
                 <h2 className="text-xl font-bold group-hover:text-blue-500 transition-colors" style={{ color: c.txt }}>{p.name}</h2>
                 <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: c.txt3 }}>{p.age} ans · {p.gender === 'Male' ? 'Homme' : 'Femme'} · {p.city}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                {p.conditions.map((cond, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                    style={{ 
                      background: dk ? "rgba(255,255,255,0.05)" : "#fff", 
                      borderColor: c.border,
                      color: c.txt2
                    }}>{cond}</span>
                ))}
              </div>
              <div className="w-full space-y-3 pt-6 border-t" style={{ borderColor: c.border }}>
                {p.vitals.map((v, i) => (
                  <div key={i} className="flex items-center justify-between text-sm group/vital">
                    <span className="font-medium transition-colors" style={{ color: c.txt3 }}>{v.label}</span>
                    <span className="font-bold" style={{ color: v.highlight ? c.amber : c.txt }}>{v.value} <small className="text-[10px] opacity-50 font-medium">{v.unit}</small></span>
                  </div>
                ))}
              </div>
              <div className="w-full space-y-2 pt-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.txt3 }}>Adhésion</span>
                    <span className="text-[10px] font-bold" style={{ color: c.txt2 }}>{p.adherence}%</span>
                 </div>
                 <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: dk ? "#1A2333" : "#E4EAF5" }}>
                    <div className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${p.adherence}%`,
                        background: p.color === 'blue' ? c.blue : p.color === 'amber' ? c.amber : c.green 
                      }}></div>
                 </div>
              </div>
              <div className="w-full grid grid-cols-1 gap-3 pt-4">
                <button onClick={() => onChangePage("patientProfile")} className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border"
                  style={{ background: dk ? "rgba(255,255,255,0.05)" : "#fff", borderColor: c.border, color: c.txt2 }}>Profil Complet</button>
                <button onClick={() => onChangePage("emergencies")} className="w-full py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Alerter Médecin</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PharmacyView({ dk, c }) {
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [cart, setCart] = useState([]);

  const addToCart = (med) => {
    if (!cart.find(item => item.id === med.id)) {
      setCart([...cart, { ...med, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: c.txt }}>Pharmacie & Stock</h1>
          <p className="text-sm font-medium" style={{ color: c.txt3 }}>Suivez et renouvelez les stocks de médicaments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border"
            style={{ background: "transparent", borderColor: c.border, color: c.blue }}>
            <RefreshCw size={16} /> Synchroniser
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card dk={dk} className="p-8">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
               <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: c.txt }}><Pill size={20} style={{ color: c.blue }} /> Stock Médicaments</h2>
               <div className="flex items-center gap-2 flex-1 md:flex-none">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.txt3 }} />
                    <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-1.5 rounded-lg text-xs outline-none w-full border"
                      style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt }} />
                  </div>
                  <button className="p-1.5 border rounded-lg" style={{ borderColor: c.border, color: c.txt3 }}><Filter size={14} /></button>
               </div>
            </div>
            <div className="space-y-4">
               {stock.map((item) => (
                 <div key={item.id} className="p-5 rounded-2xl border transition-all"
                   style={{ 
                     background: item.status === 'critical' ? c.red + "08" : item.status === 'low' ? c.amber + "08" : "transparent",
                     borderColor: item.status === 'critical' ? c.red + "22" : item.status === 'low' ? c.amber + "22" : c.border 
                   }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                           style={{ background: item.status === 'critical' ? c.red : item.status === 'low' ? c.amber : c.blue }}><Pill size={18} /></div>
                         <div>
                            <h4 className="text-sm font-bold" style={{ color: c.txt }}>{item.name}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: c.txt3 }}>Seuil: {item.threshold} {item.unit}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className="text-lg font-bold" style={{ color: item.status === 'critical' ? c.red : item.status === 'low' ? c.amber : c.blue }}>
                              {item.quantity} <small className="text-[10px] font-medium opacity-50">{item.unit}</small>
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest leading-none" style={{ color: c.txt3 }}>En Stock</p>
                         </div>
                         <button disabled={item.status === 'ok'} onClick={() => addToCart(item)} className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                           style={{ 
                             background: item.status === 'ok' ? (dk ? "#1F2937" : "#E4EAF5") : c.blue,
                             color: item.status === 'ok' ? c.txt3 : "#fff",
                             opacity: item.status === 'ok' ? 0.5 : 1
                           }}>{item.status === 'ok' ? 'En Stock' : 'Commander'}</button>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card dk={dk}>
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: c.txt }}><ShoppingCart size={20} style={{ color: c.blue }} /> Panier Ravitaillement</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.txt3 }}>{cart.length} Articles</span>
             </div>
             <div className="space-y-4 mb-8">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border"
                      style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
                      <ShoppingCart size={24} style={{ color: c.txt3, opacity: 0.5 }} />
                    </div>
                    <p className="text-xs font-medium mx-auto" style={{ color: c.txt3 }}>Le panier est vide.</p>
                  </div>
                ) : cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-500/20"
                            style={{ background: c.red + "15", color: c.red }}><Trash2 size={12} /></button>
                          <div>
                            <p className="text-xs font-bold group-hover:text-blue-500" style={{ color: c.txt }}>{item.name}</p>
                            <p className="text-[10px]" style={{ color: c.txt3 }}>1 Boîte (30 tabs)</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="w-6 h-6 rounded-md border font-bold flex items-center justify-center" style={{ borderColor: c.border, color: c.txt3 }}>-</button>
                          <span className="text-xs font-bold" style={{ color: c.txt }}>1</span>
                          <button className="w-6 h-6 rounded-md border font-bold flex items-center justify-center" style={{ borderColor: c.border, color: c.txt3 }}>+</button>
                       </div>
                    </div>
                ))}
             </div>
             <div className="pt-6 border-t space-y-4" style={{ borderColor: c.border }}>
                <div className="flex items-center justify-between text-sm font-bold">
                   <span style={{ color: c.txt3 }}>Pharmacie</span>
                   <span style={{ color: c.txt }}>Pharmacie du Jardin</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                   <span style={{ color: c.txt3 }}>Livraison</span>
                   <span style={{ color: c.txt }}>À Domicile</span>
                </div>
                <button disabled={cart.length === 0} className="w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-white"
                  style={{ 
                    background: cart.length === 0 ? (dk ? "#1F2937" : "#E4EAF5") : c.blue,
                    opacity: cart.length === 0 ? 0.5 : 1
                  }}>Commander <CheckCircle2 size={18} /></button>
             </div>
          </Card>
          <div className="rounded-3xl p-8 relative overflow-hidden group shadow-xl"
            style={{ background: c.red }}>
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-2 opacity-70 text-[10px] font-bold uppercase tracking-widest mb-2"><AlertTriangle size={14} /> Action Requise</div>
                <h3 className="font-bold text-lg mb-2">Lisinopril en Rupture</h3>
                <p className="text-white/80 text-xs font-medium leading-relaxed">Le stock est en dessous d'une journée de dosage. Veuillez passer commande immédiatement.</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { userData: user } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [wilayaOpen, setWilayaOpen] = useState(false);
  const [locSaved, setLocSaved] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwdStatus, setPwdStatus] = useState({ type: "", msg: "" });
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  const [locForm, setLocForm] = useState({ address: "", commune: "", wilaya: "Alger", mapsUrl: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setStatus({ type: "", msg: "" });
      const names = form.name.split(" ");
      const first_name = names[0] || "";
      const last_name = names.slice(1).join(" ") || "";
      await api.updateMe({ first_name, last_name, phone: form.phone });
      setStatus({ type: "success", msg: "Profil mis à jour avec succès ✅" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } catch {
      setStatus({ type: "error", msg: "Erreur lors de la mise à jour ❌" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePwd = async () => {
    try {
      setIsSavingPwd(true);
      setPwdStatus({ type: "", msg: "" });
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/api/auth/password/change/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(pwdForm),
      });
      if (!res.ok) throw new Error("Erreur");
      setPwdStatus({ type: "success", msg: "Mot de passe modifié ✅" });
      setPwdForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPwdStatus({ type: "", msg: "" }), 4000);
    } catch {
      setPwdStatus({ type: "error", msg: "Erreur lors du changement ❌" });
      setTimeout(() => setPwdStatus({ type: "", msg: "" }), 4000);
    } finally {
      setIsSavingPwd(false);
    }
  };

  const handleSaveLocation = () => {
    setLocSaved(true);
    setTimeout(() => setLocSaved(false), 3000);
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all focus:ring-2";
  const inputStyle = { background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt };
  const labelCls = "block text-xs font-bold uppercase tracking-wide mb-1.5";

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* ── Profil + Sécurité ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

        {/* Profil */}
        <Card dk={dk}>
          <p className="font-semibold mb-5" style={{ color: c.txt }}>Profile</p>
          {status.msg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{
              background: status.type === "success" ? "#2D8C6F12" : "#E0555512",
              color: status.type === "success" ? "#2D8C6F" : "#E05555",
              border: `1px solid ${status.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
            }}>{status.msg}</div>
          )}
          {[
            { label: "Full Name", key: "name" },
            { label: "Email", key: "email" },
            { label: "Phone", key: "phone" },
          ].map((field) => (
            <div key={field.key} className="mb-4">
              <label className={labelCls} style={{ color: c.txt2 }}>{field.label}</label>
              <input
                type="text"
                value={form[field.key]}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                readOnly={field.key === "email"}
                className={inputCls}
                style={{ ...inputStyle, color: field.key === "email" ? c.txt3 : c.txt }}
              />
            </div>
          ))}
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: c.blue, opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </Card>

        {/* Sécurité */}
        <Card dk={dk}>
          <p className="font-semibold mb-5" style={{ color: c.txt }}>Security</p>
          {pwdStatus.msg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{
              background: pwdStatus.type === "success" ? "#2D8C6F12" : "#E0555512",
              color: pwdStatus.type === "success" ? "#2D8C6F" : "#E05555",
              border: `1px solid ${pwdStatus.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
            }}>{pwdStatus.msg}</div>
          )}
          {[
            { label: "Current Password", key: "currentPassword" },
            { label: "New Password", key: "newPassword" },
          ].map((field) => (
            <div key={field.key} className="mb-4 relative">
              <label className={labelCls} style={{ color: c.txt2 }}>{field.label}</label>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={pwdForm[field.key]}
                onChange={(e) => setPwdForm({ ...pwdForm, [field.key]: e.target.value })}
                className={`${inputCls} pr-12`}
                style={inputStyle}
              />
              <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-8" style={{ color: c.txt3 }}>
                {showPwd ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
          <button
            onClick={handleSavePwd}
            disabled={isSavingPwd}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 active:scale-95"
            style={{ color: c.blue, borderColor: c.border, opacity: isSavingPwd ? 0.7 : 1 }}
          >
            {isSavingPwd ? "Updating..." : "Update Password"}
          </button>
        </Card>
      </div>

      {/* ── Zone d'intervention & Maps ── */}
      <Card dk={dk}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.blue + "18" }}>
            <MapPin size={18} style={{ color: c.blue }} />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: c.txt }}>Zone d'intervention & Maps</p>
            <p className="text-xs" style={{ color: c.txt3 }}>Gérez votre zone d'intervention à domicile</p>
          </div>
        </div>

        {locSaved && (
          <div className="mb-5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2" style={{
            background: "#2D8C6F12", color: "#2D8C6F", border: "1px solid #2D8C6F44",
          }}>
            <Check size={14} /> Localisation mise à jour avec succès ✅
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Champs */}
          <div className="space-y-5">
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>Adresse d'intervention</label>
              <input
                type="text"
                placeholder="Ex: 12 Rue Didouche Mourad"
                value={locForm.address}
                onChange={(e) => setLocForm((f) => ({ ...f, address: e.target.value }))}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>Commune</label>
              <input
                type="text"
                placeholder="Ex: Alger-Centre"
                value={locForm.commune}
                onChange={(e) => setLocForm((f) => ({ ...f, commune: e.target.value }))}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>Wilaya</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setWilayaOpen(!wilayaOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ ...inputStyle, borderColor: wilayaOpen ? c.blue : c.border }}
                >
                  <span style={{ color: locForm.wilaya ? c.txt : c.txt3 }}>{locForm.wilaya || "Sélectionner..."}</span>
                  <ChevronDown size={16} className={`shrink-0 transition-transform ${wilayaOpen ? "rotate-180" : ""}`} style={{ color: c.txt3 }} />
                </button>
                {wilayaOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setWilayaOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl z-50 py-2 max-h-56 overflow-y-auto"
                      style={{ background: dk ? "#141B27" : "#fff", borderColor: c.border }}>
                      {WILAYAS_LIST.map((w) => (
                        <button
                          key={w} type="button"
                          onClick={() => { setLocForm((f) => ({ ...f, wilaya: w })); setWilayaOpen(false); }}
                          className="w-full flex items-center px-5 py-2.5 text-sm font-medium transition-all text-left"
                          style={{ color: locForm.wilaya === w ? c.blue : c.txt, background: locForm.wilaya === w ? c.blue + "15" : "transparent" }}
                          onMouseEnter={(e) => { if (locForm.wilaya !== w) e.currentTarget.style.background = c.blue + "10"; }}
                          onMouseLeave={(e) => { if (locForm.wilaya !== w) e.currentTarget.style.background = "transparent"; }}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>Lien Google Maps (Optionnel)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Collez l'URL Google Maps ici..."
                  value={locForm.mapsUrl}
                  onChange={(e) => setLocForm((f) => ({ ...f, mapsUrl: e.target.value }))}
                  className={`${inputCls} pl-10`}
                  style={inputStyle}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.txt3 }}>
                  <LinkIcon size={15} />
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveLocation}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, #304B71, ${c.blue})` }}
            >
              <MapPin size={15} /> Mettre à jour la carte
            </button>
          </div>

          {/* Aperçu carte */}
          <div className="flex flex-col gap-3">
            <label className={labelCls} style={{ color: c.txt2 }}>Map Preview</label>
            {(() => {
              const addressQuery = [locForm.address, locForm.commune, locForm.wilaya].filter(Boolean).join(", ");
              let embedSrc = null;
              let openUrl = locForm.mapsUrl || null;

              if (locForm.mapsUrl) {
                if (locForm.mapsUrl.includes("output=embed") || locForm.mapsUrl.includes("/embed")) {
                  embedSrc = locForm.mapsUrl;
                } else {
                  const coordMatch = locForm.mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                  const placeMatch = locForm.mapsUrl.match(/\/place\/([^/]+)/);
                  const rawCoord = locForm.mapsUrl.match(/^(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)$/);
                  if (rawCoord) {
                    embedSrc = `https://maps.google.com/maps?q=${rawCoord[1]},${rawCoord[2]}&hl=fr&z=15&output=embed`;
                  } else if (coordMatch) {
                    embedSrc = `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=fr&z=15&output=embed`;
                  } else if (placeMatch) {
                    embedSrc = `https://maps.google.com/maps?q=${placeMatch[1]}&hl=fr&z=15&output=embed`;
                  } else {
                    embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locForm.mapsUrl)}&hl=fr&z=15&output=embed`;
                  }
                }
              } else if (addressQuery) {
                embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&hl=fr&z=15&output=embed`;
                openUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}`;
              }

              return embedSrc ? (
                <div className="relative flex-1 min-h-[280px] rounded-2xl overflow-hidden border-2 transition-all"
                  style={{ borderColor: c.blue + "55", background: c.card }}>
                  <iframe
                    key={embedSrc}
                    title="Map Preview"
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: 280, display: "block" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {openUrl && (
                    <a
                      href={openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:opacity-90"
                      style={{ background: c.blue }}
                    >
                      <MapPin size={12} /> Ouvrir dans Maps
                    </a>
                  )}
                </div>
              ) : (
                <div
                  className="flex-1 min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all"
                  style={{ background: dk ? "#0D1117" : "#F4F8FB", borderColor: c.border }}
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: c.blue + "18" }}>
                      <MapPin size={28} style={{ color: c.blue }} />
                    </div>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: c.blue }} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-bold" style={{ color: c.txt }}>Map Preview</p>
                    <p className="text-xs mt-1" style={{ color: c.txt3 }}>Collez une URL Maps ou entrez votre adresse</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </Card>

      {/* ── Langue + À propos ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card dk={dk}>
          <p className="font-semibold mb-4" style={{ color: c.txt }}>Language</p>
          <div className="flex gap-2 flex-wrap">
            {["🇫🇷 Français", "🇩🇿 العربية", "🇬🇧 English"].map((lang, i) => (
              <button
                key={lang}
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  background: i === 0 ? c.blue : "transparent",
                  color: i === 0 ? "#fff" : c.txt2,
                  borderColor: i === 0 ? c.blue : c.border,
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </Card>
        <Card dk={dk}>
          <p className="font-semibold mb-2" style={{ color: c.txt }}>About</p>
          <p className="text-sm" style={{ color: c.txt2 }}>MedSmart v2.1.0 · Connected Healthcare Platform</p>
          <p className="text-xs mt-1" style={{ color: c.txt3 }}>CNAS Certified · RGPD Compliant · Hosted in Algeria</p>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function GardeMaladeDashboard({ onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const { userData: user } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [notifications] = useState([]);

  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;

  const userInitials =
    user && (user.first_name || user.last_name)
      ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
      : "GM";
  const fullName =
    user && (user.first_name || user.last_name)
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
      : "Mon Compte";

  const NAV = [
    { id: "dashboard", label: "Accueil" },
    { id: "jobRequests", label: "Offres & Missions" },
    { id: "myPatients", label: "Mes Patients" },
    { id: "pharmacy", label: "Pharmacie" }
  ];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <HomeView onChangePage={setPage} dk={dk} c={c} setEmergency={setEmergency} />;
      case "emergencies": return <EmergenciesView dk={dk} c={c} />;
      case "jobRequests": return <JobRequestsView dk={dk} c={c} />;
      case "myPatients": return <MyPatientsView onChangePage={setPage} dk={dk} c={c} />;
      case "pharmacy": return <PharmacyView dk={dk} c={c} />;
      case "settings": return <SettingsView />;
      default: return <HomeView onChangePage={setPage} dk={dk} c={c} setEmergency={setEmergency} />;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: c.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: c.txt,
        transition: "background 0.3s, color 0.2s",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s; }
        button { cursor: pointer !important; }
        label { cursor: pointer !important; }
        a { cursor: pointer !important; }
        .nav-link:not(.active-nav):hover { background: rgba(100,146,201,0.15) !important; color: #6492C9 !important; }
      `}</style>

      {emergency && (
        <EmergencyModal onClose={() => setEmergency(false)} dk={dk} />
      )}

      {/* ═══ NAVBAR (copie exacte du Patient Dashboard) ═══ */}
      <nav
        className="sticky top-0 z-30 border-b shadow-sm"
        style={{ background: c.nav, borderColor: c.border }}
      >
        <div className="w-full px-6 h-[60px] flex items-center gap-3">
          {/* Logo SVG MedSmart */}
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="20" rx="2" fill="white" opacity="0.95" />
                <rect x="2" y="9" width="20" height="6" rx="2" fill="white" opacity="0.95" />
                <path
                  d="M4 14 L6 10 L8 13 L10 7 L12 15 L14 11 L16 13 L18 11"
                  stroke="#6492C9"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <span className="font-bold text-base" style={{ color: c.txt }}>MedSmart</span>
          </div>

          {/* Liens Nav centrés */}
          <div
            className="hidden lg:flex items-center justify-center gap-1 flex-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`nav-link${page === item.id ? " active-nav" : ""} relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all`}
                style={{
                  color: page === item.id ? "#fff" : c.txt2,
                  background: page === item.id ? c.blue : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Droite — profil + menu mobile */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <div className="relative">
              {/* Point rouge notifications */}
              {notifications.filter((n) => !n.is_read && n.unread !== false).length > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 z-10 flex items-center justify-center"
                  style={{ borderColor: c.nav, fontSize: 7, color: "#fff", fontWeight: 800, pointerEvents: "none" }}
                >
                  {notifications.filter((n) => !n.is_read && n.unread !== false).length}
                </div>
              )}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
                style={{ border: `1px solid ${c.border}`, background: "transparent" }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}
                >
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight" style={{ color: c.txt }}>{fullName}</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>ID: #{user?.id || "----"}</p>
                </div>
                <ChevronDown size={13} style={{ color: c.txt3 }} />
              </button>

              {/* Dropdown profil — animation slide-down */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-12 w-60 rounded-[20px] overflow-hidden z-50"
                  style={{
                    background: dk ? c.card : "#ffffff",
                    border: `1px solid ${dk ? c.border : "#F1F5F9"}`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    animation: "dropdownIn 0.2s ease forwards",
                  }}
                >
                  <style>{`
                    @keyframes dropdownIn {
                      from { opacity:0; transform:translateY(-8px) scale(0.97); }
                      to   { opacity:1; transform:translateY(0) scale(1); }
                    }
                    .pd-item { color: #64748B; background: transparent; transition: background 0.15s, color 0.15s; }
                    .pd-item:hover { background: #F8FAFC; color: #1E293B; }
                    .pd-item-danger { color: #EF4444; background: transparent; transition: background 0.15s; }
                    .pd-item-danger:hover { background: rgba(239,68,68,0.08); }
                  `}</style>

                  {/* En-tête utilisateur */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: dk ? c.border : "#F1F5F9" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}
                      >
                        {userInitials}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: c.txt }}>{fullName}</p>
                        <p className="text-xs" style={{ color: c.txt3 }}>Garde-Malade · ID #{user?.id || "----"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1 group">
                    {/* Urgences */}
                    <button
                      onClick={() => { setPage("emergencies"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer"
                    >
                      <Bell size={16} className="hover:rotate-45 transition-transform" />
                      Urgences & Alertes
                    </button>

                    {/* Paramètres */}
                    <button
                      onClick={() => { setPage("settings"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer"
                    >
                      <Settings size={16} className="hover:rotate-45 transition-transform" />
                      Paramètres
                    </button>

                    {/* Toggle jour/nuit */}
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Sun size={14} style={{ color: dk ? c.txt3 : "#E8A838" }} />
                      <button
                        onClick={toggleTheme}
                        className="relative rounded-full transition-all duration-300"
                        style={{
                          width: 42,
                          height: 24,
                          background: dk ? "linear-gradient(135deg, #304B71, #4A6FA5)" : "#D5DEEF",
                          border: `1.5px solid ${dk ? c.blue + "80" : "#BBC8DC"}`,
                          padding: 0,
                        }}
                      >
                        <div
                          className="absolute top-0.5 rounded-full bg-white shadow-md transition-all duration-300"
                          style={{ width: 18, height: 18, left: dk ? 20 : 2 }}
                        />
                      </button>
                      <Moon size={13} style={{ color: dk ? c.blue : c.txt3 }} />
                    </button>

                    {/* Séparateur */}
                    <div className="h-px my-1 mx-2" style={{ background: dk ? c.border : "#F1F5F9" }} />

                    {/* Déconnexion */}
                    <button
                      onClick={onLogout}
                      className="pd-item-danger w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl cursor-pointer"
                    >
                      <LogOut size={16} className="hover:translate-x-1 transition-transform" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu mobile */}
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ color: c.txt2 }}
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Menu size={17} />
            </button>
          </div>
        </div>

        {/* Nav mobile */}
        {mobileMenu && (
          <div
            className="lg:hidden border-t px-4 py-3 flex flex-wrap gap-2"
            style={{ borderColor: c.border, background: c.nav }}
          >
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMobileMenu(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: page === item.id ? "#fff" : c.txt2,
                  background: page === item.id ? c.blue : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-6 py-8">{renderPage()}</main>

      {profileOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
      )}
    </div>
  );
}