import React, { useState, useEffect, useRef } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import DashSelect from "../../components/ui/DashSelect";
import { ParticlesHero } from '../../components/backgrounds/MedParticles';
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import * as api from "../../services/api";
import ChatButton from "../../components/chat/ChatButton";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import { useLanguage } from "../../context/LanguageContext";
import {
  Users, Heart, Calendar, Star, CheckCircle2, Circle, Phone, AlertCircle,
  MoreHorizontal, ChevronRight, MapPin, ShieldAlert, Navigation, Activity,
  Droplet, User, UserPlus, Bell, Pill, X, ChevronLeft, FileText, Trash2,
  Plus, ShoppingCart, AlertTriangle, Search, Filter, Minus, RefreshCw,
  QrCode, Download, Eye, EyeOff, Clock, ExternalLink, Stethoscope, Shield, Settings,
  ClipboardList, ChevronDown, LogOut, Menu, Sun, Moon, Check,
  Link as LinkIcon, Brain, Send, MessageSquare,
  Mic, Paperclip, History
} from "lucide-react";
import { T } from "../_shared/theme";

// ─── Reusable Card Component ──────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk, empty = false }) {
  const c = dk ? T.dark : T.light;
  const hoverClasses = empty ? "" : "card-hover";
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border ${hoverClasses} ${className}`}
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

// Données de démonstration uniquement actives en développement
// Plus de données fictives — les offres de missions proviennent de l'API.
const SAMPLE_REQUESTS = [];

// ─── Profils patients détaillés (pour le modal "Détails du profil") ────────────
const PATIENT_PROFILES = {
  1: {
    name: "Nadia Khelifa", age: 58, gender: "F", city: "Alger-Centre",
    conditions: ["Diabète Type 2", "Hypertension artérielle"],
    vitals: [
      { label: "Glycémie à jeun", value: "8.2 mmol/L", highlight: true },
      { label: "Tension artérielle", value: "145/92 mmHg", highlight: true },
      { label: "IMC", value: "28.4 kg/m²", highlight: false },
    ],
    treatments: ["Metformin 500mg (2×/jour)", "Lisinopril 10mg (1×/jour)", "Aspirine 75mg (1×/jour)"],
    notes: "Patiente stable. Surveillance glycémique et tensionnelle quotidienne requise. Régime alimentaire contrôlé.",
    difficulty: "Modérée",
    diffColor: "#E8A838",
  },
  2: {
    name: "Youcef Belaid", age: 72, gender: "M", city: "El Biar",
    conditions: ["Post-chirurgie cardiaque (bypass)", "Insuffisance cardiaque légère"],
    vitals: [
      { label: "Fréquence cardiaque", value: "72 bpm", highlight: false },
      { label: "SpO2", value: "97%", highlight: false },
      { label: "Tension artérielle", value: "130/85 mmHg", highlight: true },
    ],
    treatments: ["Warfarin 5mg (1×/jour)", "Amiodarone 200mg (1×/jour)", "Bisoprolol 2.5mg"],
    notes: "Surveillance nocturne intensive requise. Pansement cicatrice à refaire toutes les 48h. Mobilisation assistée.",
    difficulty: "Élevée",
    diffColor: "#E05555",
  },
  3: {
    name: "Meriem Kaci", age: 32, gender: "F", city: "Sidi Yahia",
    conditions: ["Fracture membre inférieur", "Rééducation post-fracture"],
    vitals: [
      { label: "Tension artérielle", value: "120/80 mmHg", highlight: false },
      { label: "Température", value: "37.1°C", highlight: false },
      { label: "Saturation O2", value: "99%", highlight: false },
    ],
    treatments: ["Ibuprofène 400mg (3×/jour)", "Calcium D3 (1×/jour)", "Anticoagulant préventif"],
    notes: "Aide à la mobilité et soins de plaie requis. Exercices de rééducation supervisés. Patient coopératif.",
    difficulty: "Faible",
    diffColor: "#2D8C6F",
  },
};

// ─── AI HISTORIQUE ─────────────────────────────────────────────────────────────

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
  const { t } = useLanguage();
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
                {t('emergency_title') || "Emergency Alert"}
              </h3>
              <p className="text-xs" style={{ color: c.txt2 }}>
                {t('emergency_desc') || "Contacts will be notified immediately"}
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
            {t('emergency_warning') || "This will alert your emergency contacts and share your GPS location with nearby medical services."}
          </p>
        </div>
        <div className="space-y-3 mb-4">
          <button
            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: "#E05555", boxShadow: "0 4px 20px rgba(224,85,85,0.4)" }}
          >
            <Phone size={16} /> {t('call_samu_btn') || "Call 15 (SAMU) Now"}
          </button>
          <button
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{
              background: "rgba(224,85,85,0.1)",
              color: "#E05555",
              border: "1px solid rgba(224,85,85,0.2)",
            }}
          >
            <MapPin size={15} /> {t('share_location_btn') || "Share My Location"}
          </button>
          <button
            className="w-full py-3 rounded-xl font-semibold transition-colors"
            style={{
              background: "rgba(224,85,85,0.06)",
              color: "#E05555",
              border: "1px solid rgba(224,85,85,0.15)",
            }}
          >
            {t('notify_contacts_btn') || "Notify Emergency Contact"}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-sm font-medium rounded-xl transition-colors"
          style={{ color: c.txt3, background: "transparent", border: `1px solid ${c.border}` }}
        >
          {t('im_fine_btn') || "Cancel — I'm fine"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SOUS-COMPOSANTS
// ============================================================================

function HomeView({ onChangePage, dk, c, setEmergency }) {
  const { t } = useLanguage();
  const { userData } = useAuth();
  const { gmPatients: patients } = useData();
  const userName = userData?.first_name || userData?.firstName || "Fatima";

  const schedule = patients.length === 0 ? [] : [
    { time: "8:00 AM", name: "Alex — Lisinopril 10mg", status: "done" },
    { time: "9:00 AM", name: "Youcef — Warfarin 5mg", status: "done" },
    { time: "12:00 PM", name: "Nadia — Metformin 500mg", status: "done" },
    { time: "2:30 PM", name: "Alex — Metformin 500mg", status: "pending", in: "2h 30min" },
    { time: "5:00 PM", name: "Youcef — Amiodarone 200mg", status: "pending", in: "5h" },
    { time: "8:00 PM", name: "All — Evening doses", status: "pending" },
  ];

  const emergencyContacts = patients.length === 0 ? [] : [
    { name: "Dr. Benali Karim", role: t('primary_physician') || "Médecin traitant", initials: "BK", color: c.green },
    { name: "SAMU 15", role: t('medical_emergency') || "Urgences Médicales", initials: "15", color: c.red },
    { name: "Famille Alex", role: "+213 555 890 123", initials: "FJ", color: c.blue },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: c.txt }}>
            {t('welcome_back_prefix') || "Bonjour"}, <span style={{ color: c.blue }}>{userName}</span>
          </h1>
        </div>
        <button
          onClick={() => setEmergency(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg"
          style={{ background: "linear-gradient(135deg, #E05555, #c93535)", color: "#fff" }}
        >
          <AlertTriangle size={15} /> {t('emergency_btn') || "URGENCE"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: c.txt3 }}>{t('my_patients_title') || "MES PATIENTS"}</h2>
            <button onClick={() => onChangePage("myPatients")} className="text-xs font-bold hover:underline" style={{ color: c.blue }}>{t('view_all_btn') || "Voir tout"}</button>
          </div>
          <div className="space-y-4">
            {patients.length === 0 ? (
              <Card dk={dk} empty={true} className="h-48 flex flex-col items-center justify-center text-center">
                <Users size={32} style={{ color: c.txt3, opacity: 0.5 }} className="mb-4" />
                <p style={{ color: c.txt3 }}>{t('no_patients_assigned') || "Aucun patient assigné."}</p>
              </Card>
            ) : patients.map((patient) => (
              <Card key={patient.id} dk={dk} className="group overflow-hidden relative hover:border-blue-500/30">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0"
                    style={{ background: patient.color === 'blue' ? c.blue : patient.color === 'amber' ? c.amber : c.green }}>
                    {patient.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold transition-colors group-hover:text-blue-500" style={{ color: c.txt }}>{patient.name}</h3>
                    <p className="text-xs font-medium" style={{ color: c.txt3 }}>{patient.age} ans · {patient.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => onChangePage("myPatients")} className="px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border"
                    style={{ background: dk ? "rgba(255,255,255,0.05)" : "#fff", borderColor: c.border, color: c.txt2 }}>
                    {t('patient_profile_btn') || "Profil"}
                  </button>
                  <a href={`tel:${patient.emergencyPhone || "+21355500000"}`} className="px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white">
                    {t('alert_patient_btn') || "Alerter"}
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <Card dk={dk} empty={true}>
            <h3 className="text-sm font-bold mb-6" style={{ color: c.txt }}>{t('medication_planning') || "Planning Médicaments"}</h3>
            <div className="space-y-4">
              {schedule.length === 0 ? (
                <div className="text-center py-6 text-sm" style={{ color: c.txt3 }}>{t('no_care_planned') || "Aucun soin prévu."}</div>
              ) : schedule.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group cursor-pointer card-hover">
                  <button className="mt-0.5 shrink-0">
                    {item.status === 'done' ? <CheckCircle2 size={18} style={{ color: c.green }} /> : <Circle size={18} style={{ color: c.border }} className="group-hover:text-blue-500 transition-colors" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-xs font-bold leading-none ${item.status === 'done' ? 'font-medium opacity-50' : ''}`} style={{ color: c.txt }}>{item.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold" style={{ color: c.txt3 }}>{item.time}</span>
                      {item.status === 'done' ? <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.green }}>{t('done_status') || "Fait"}</span> : item.in && <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.blue }}>{t('in_time_remaining', {time: item.in}) || `dans ${item.in}`}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card dk={dk} empty={true}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: c.txt }}>{t('my_rating_reviews') || "Ma Note & Avis"}</h3>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: c.amber + "18" }}>
                <Star size={13} style={{ color: c.amber }} />
                <span className="text-sm font-bold" style={{ color: c.amber }}>4.8</span>
                <span className="text-xs font-medium" style={{ color: c.txt3 }}>/5</span>
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: c.txt3 }}>{t('patient_reviews_count', {count: 48}) || "48 avis patients"}</p>
            <div className="space-y-3">
              {[
                { author: "Famille Johnson", note: "Très professionnelle, ponctuelle et bienveillante.", stars: 5, date: "Il y a 2 jours" },
                { author: "Dr. Benali", note: "Bonne exécution des prescriptions, communication claire.", stars: 5, date: "Il y a 5 jours" },
                { author: "Famille Belaid", note: "Service satisfaisant, quelques retards.", stars: 4, date: "Il y a 1 sem." },
              ].map((avis, i) => (
                <div key={i} className="p-3 rounded-xl border cursor-pointer card-hover" style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: c.txt }}>{avis.author}</span>
                    <span className="text-[10px]" style={{ color: c.txt3 }}>{avis.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={10} style={{ color: s < avis.stars ? c.amber : c.border }} fill={s < avis.stars ? c.amber : "none"} />
                    ))}
                  </div>
                  <p className="text-xs italic" style={{ color: c.txt2 }}>{avis.note}</p>
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
  const { t } = useLanguage();
  const { gmPatients: patients } = useData();

  const emergencyContacts = [
    { name: "Dr. Benali Karim", role: t('primary_physician_role') || "Médecin Traitant · Cardiologie", initials: "BK", action: t('call_action') || "Appel", color: c.green },
    { name: "SAMU — 15", role: t('medical_emergency_role') || "Secours Médicaux", initials: "15", action: t('call_action') || "Appel", color: c.red },
    ...(patients.length > 0 ? [{ name: "Famille Johnson", role: "+213 555 890 123", initials: "FJ", action: t('call_action') || "Appel", color: c.blue }] : []),
    { name: "CHU Alger Central", role: t('nearby_hospital_role') || "Hôpital plus proche · 2.3 km", initials: "HA", action: t('route_action') || "Itinéraire", color: c.amber },
  ];

  const procedures = [
    { title: t('thoracic_pain_proc') || "Douleur Thoracique / Crise Cardiaque", steps: [t('call_samu_step') || "Appeler le SAMU 15 immédiatement", t('keep_calm_step') || "Garder le patient calme et immobile", t('no_meds_step') || "Ne PAS donner de médicaments", t('share_gps_step') || "Partager la position GPS via l'app"], color: c.red },
    { title: t('hypoglycemia_proc') || "Hypoglycémie (Sucre Bas)", steps: [t('give_sugar_step') || "Donner du sucre ou un jus", t('reevaluate_step') || "Réévaluer après 15 min", t('unconscious_step') || "Si inconscient — appeler le SAMU 15"], color: c.amber },
    { title: t('hypertension_proc') || "Crise d'Hypertension", steps: [t('sit_patient_step') || "Faire asseoir le patient", t('remeasure_step') || "Remesurer après 5 min", t('systolic_high_step') || "Systolique >180 → SAMU immédiat"], color: c.blue }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2" style={{ color: c.txt }}>{t('emergency_protocols') || "Protocoles d'Urgence"}</h1>
        <p className="text-sm font-medium tracking-tight" style={{ color: c.txt3 }}>{t('emergency_desc') || "Contacts et procédures pour les situations critiques"}</p>
      </header>

      <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 group border-2"
        style={{ background: dk ? "rgba(224,85,85,0.05)" : "#FFF5F5", borderColor: c.red + "33" }}>
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500"
              style={{ background: c.red }}>
              <ShieldAlert size={32} />
            </div>
            <div>
               <h2 className="text-xl font-bold mb-2" style={{ color: c.red }}>{t('activate_emergency_btn') || "Activer l'Alerte d'Urgence"}</h2>
               <p className="text-sm font-medium" style={{ color: c.txt2 }}>{t('activate_emergency_desc') || "Notifie médecins et famille avec position GPS"}</p>
            </div>
         </div>
         <button className="w-full md:w-auto px-10 py-4 text-white font-bold rounded-2xl text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
           style={{ background: c.red, boxShadow: `0 8px 30px ${c.red}33` }}>
            🚨 {t('activate_now_btn') || "ACTIVER MAINTENANT"}
         </button>
      </div>

      {patients.length === 0 ? (
        <Card dk={dk} empty={true} className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <ShieldAlert size={48} style={{ color: c.border }} className="mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: c.txt }}>{t('no_emergency_profile') || "Aucun Profil d'Urgence"}</h2>
          <p className="text-sm" style={{ color: c.txt3 }}>{t('add_patients_emergency_desc') || "Ajoutez des patients pour voir leurs contacts et procédures spécifiques."}</p>
        </Card>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-base font-bold mb-4" style={{ color: c.txt }}>{t('emergency_contacts_title') || "Contacts d'Urgence"}</h2>
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
          <h2 className="text-base font-bold mb-4" style={{ color: c.txt }}>{t('procedures_title') || "Procédures"}</h2>
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
  const { t } = useLanguage();
  const [profileModal, setProfileModal] = useState(null); // req id
  const [dismissed, setDismissed] = useState([]); // ids refusés
  const [accepted, setAccepted] = useState([]); // ids acceptés (confirmés après 5 min)
  const [pendingAccept, setPendingAccept] = useState({}); // id -> secondes restantes

  // Compte à rebours de 5 minutes par mission acceptée
  useEffect(() => {
    const ids = Object.keys(pendingAccept).filter(id => pendingAccept[id] > 0);
    if (ids.length === 0) return;
    const interval = setInterval(() => {
      setPendingAccept(prev => {
        const next = { ...prev };
        ids.forEach(id => {
          if (next[id] > 0) {
            next[id]--;
            if (next[id] === 0) {
              // Confirmation définitive après 5 min
              setAccepted(a => [...a, Number(id)]);
            }
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pendingAccept]);

  const handleAccept = (id) => {
    setPendingAccept(prev => ({ ...prev, [id]: 300 }));
  };

  const handleRetract = (id) => {
    setPendingAccept(prev => { const next = { ...prev }; delete next[id]; return next; });
  };

  const active = SAMPLE_REQUESTS.filter(r => !dismissed.includes(r.id) && !accepted.includes(r.id));
  const profile = profileModal !== null ? PATIENT_PROFILES[profileModal] : null;

  return (
    <div className="animate-in fade-in duration-500 space-y-8">

      {/* ── Modal Profil Patient ── */}
      {profile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setProfileModal(null); }}
        >
          <div className="rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border"
            style={{ background: c.card, borderColor: c.border }}>
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: c.border }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: profile.diffColor }}>
                  {profile.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: c.txt }}>{profile.name}</h2>
                  <p className="text-sm" style={{ color: c.txt3 }}>{profile.age} ans · {profile.gender === "F" ? (t('female') || "Femme") : (t('male') || "Homme")} · {profile.city}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ background: profile.diffColor + "18", color: profile.diffColor }}>
                    {t('care_difficulty') || "Difficulté de soins"} : {profile.difficulty}
                  </span>
                </div>
              </div>
              <button onClick={() => setProfileModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
                style={{ background: c.blueLight }}>
                <X size={15} style={{ color: c.txt3 }} />
              </button>
            </div>

            {/* Corps */}
            <div className="p-6 space-y-5 max-h-[450px] overflow-y-auto">
              {/* Conditions */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>{t('pathologies_label') || "Pathologies"}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.conditions.map((cond) => (
                    <span key={cond} className="text-xs px-3 py-1 rounded-full border font-medium"
                      style={{ background: c.blueLight, color: c.blue, borderColor: c.blue + "30" }}>{cond}</span>
                  ))}
                </div>
              </div>

              {/* Traitements */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>{t('current_treatments_label') || "Traitements en cours"}</p>
                <div className="space-y-1.5">
                  {profile.treatments.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm" style={{ color: c.txt2 }}>
                      <Pill size={13} style={{ color: c.blue }} /> {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>{t('doctor_notes_label') || "Notes du médecin"}</p>
                <p className="text-sm p-3 rounded-xl italic" style={{ background: dk ? "#1A2333" : "#F8FAFC", color: c.txt2 }}>
                  "{profile.notes}"
                </p>
              </div>
            </div>

            {/* Footer — lecture seule, pas d'action ici */}
            <div className="px-6 pb-5">
              <p className="text-xs text-center" style={{ color: c.txt3 }}>
                {t('read_only_view_desc') || "Vue en lecture seule — Acceptez ou refusez depuis la liste des offres."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── En-tête ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: c.txt }}>{t('mission_offers_title') || "Offres de Missions"}</h1>
          <p className="text-sm font-medium" style={{ color: c.txt3 }}>{t('new_opportunities_desc') || "Nouvelles opportunités dans votre zone"}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm"
          style={{ background: c.blue + "10", borderColor: c.blue + "20", color: c.blue }}>
          <Users size={16} /> {t('missions_available_count', {count: active.length}) || `${active.length} Mission(s) disponible(s)`}
        </div>
      </div>

      {/* ── Liste ── */}
      <div className="space-y-4">
        {active.length === 0 && (
          <Card dk={dk} className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 size={40} style={{ color: c.green }} className="mb-4" />
            <h2 className="text-lg font-bold mb-1" style={{ color: c.txt }}>{t('all_offers_processed') || "Toutes les offres traitées"}</h2>
            <p className="text-sm" style={{ color: c.txt3 }}>{t('offers_responded_desc') || "Vous avez répondu à toutes les demandes disponibles."}</p>
          </Card>
        )}
        {active.map((req) => {
          const isPending = pendingAccept[req.id] !== undefined && pendingAccept[req.id] > 0;
          const secs = pendingAccept[req.id] || 0;
          const mins = Math.floor(secs / 60);
          const ss = String(secs % 60).padStart(2, "0");
          return (
            <Card key={req.id} dk={dk} className={`hover:shadow-md group transition-all ${isPending ? "border-amber-500/40" : ""}`}
              style={isPending ? { borderColor: c.amber + "60" } : {}}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                {/* Identité patient */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl border"
                    style={{ background: c.blue + "10", color: c.blue, borderColor: c.blue + "20" }}>
                    {req.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: c.txt }}>{req.patientName}</h3>
                    <p className="text-sm font-medium" style={{ color: c.txt3 }}>{req.age} ans · {req.condition}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: c.txt3 }}>{req.posted}</p>
                  </div>
                </div>

                {/* Adresse */}
                <div className="flex-1 flex items-center gap-2 text-sm font-medium border-y lg:border-y-0 lg:border-x py-4 lg:py-0 lg:px-8"
                  style={{ borderColor: c.border, color: c.txt2 }}>
                  <MapPin size={15} style={{ color: c.blue }} />{req.location}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-3 shrink-0">
                  {/* Bouton Détails du profil */}
                  <button
                    onClick={() => setProfileModal(req.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:opacity-80 whitespace-nowrap"
                    style={{ background: "transparent", borderColor: c.border, color: c.txt2 }}>
                    <User size={14} /> {t('view_profile_btn') || "Détails du profil"}
                  </button>

                  {/* Accepter / Refuser */}
                  {isPending ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
                        style={{ background: c.amber + "15", color: c.amber, border: `1px solid ${c.amber}30` }}>
                        <Clock size={15} /> {t('pending_tab') || "En attente"} — {mins}:{ss}
                      </div>
                      <button
                        onClick={() => handleRetract(req.id)}
                        className="text-[11px] font-bold underline transition-opacity hover:opacity-70"
                        style={{ color: c.red }}>
                        {t('retract_acceptance_btn') || "Retirer l'acceptation"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:opacity-90 active:scale-95 whitespace-nowrap"
                        style={{ background: c.green }}>
                        <CheckCircle2 size={16} /> {t('accept_btn') || "Accepter"}
                      </button>
                      <button
                        onClick={() => setDismissed(prev => [...prev, req.id])}
                        className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"
                        style={{ background: c.red + "15", borderColor: c.red + "25", color: c.red }}>
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Historique des missions ── */}
      {(accepted.length > 0 || dismissed.length > 0) && (
        <div>
          <h2 className="text-base font-bold mb-4" style={{ color: c.txt }}>Historique</h2>
          <div className="space-y-3">
            {accepted.map(id => {
              const req = SAMPLE_REQUESTS.find(r => r.id === id);
              if (!req) return null;
              return (
                <div key={`acc-${id}`} className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{ background: c.green + "08", borderColor: c.green + "30" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border"
                      style={{ background: c.green + "15", color: c.green, borderColor: c.green + "25" }}>
                      {req.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: c.txt }}>{req.patientName}</p>
                      <p className="text-xs font-medium" style={{ color: c.txt3 }}>{req.condition} · {req.location}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: c.green + "15", color: c.green }}>
                    <CheckCircle2 size={12} /> {t('accepted_status') || "Acceptée"}
                  </span>
                </div>
              );
            })}
            {dismissed.map(id => {
              const req = SAMPLE_REQUESTS.find(r => r.id === id);
              if (!req) return null;
              return (
                <div key={`dis-${id}`} className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{ background: c.red + "08", borderColor: c.red + "25" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border"
                      style={{ background: c.red + "15", color: c.red, borderColor: c.red + "25" }}>
                      {req.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: c.txt }}>{req.patientName}</p>
                      <p className="text-xs font-medium" style={{ color: c.txt3 }}>{req.condition} · {req.location}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: c.red + "15", color: c.red }}>
                    <X size={12} /> {t('refused_status') || "Refusée"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI DIAGNOSIS PAGE (Garde-Malade) ────────────────────────────────────────

function highlightTerms(text) {
  if (!text) return "";
  let t = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  t = t.replace(/^(\d+[\.\)]\s*)([^\n—\-:]+)/gm, (match, num, title) =>
    `${num}<strong style="color:#0D1B2E;font-weight:500;">${title.trim()}</strong>`);
  t = t.replace(/^Urgence\s*:\s*([^\n]+)/gim, (match, level) => {
    const l = level.toLowerCase();
    let bg, color, label;
    if (l.includes("non urgent") || l.includes("généralement non")) { bg="#EEEDFE"; color="#534AB7"; label="Non urgent"; }
    else if (l.includes("relativ") || l.includes("évaluer") || l.includes("médecin traitant")) { bg="#E6F1FB"; color="#185FA5"; label="À évaluer"; }
    else if (l.includes("variable")) { bg="#E1F5EE"; color="#0F6E56"; label="Variable"; }
    else if (l.includes("urgent") || l.includes("immédiat") || l.includes("sévère")) { bg="#FCEBEB"; color="#A32D2D"; label="Urgence possible"; }
    else if (l.includes("bilan") || l.includes("diagnostic")) { bg="#FAEEDA"; color="#854F0B"; label="Bilan recommandé"; }
    else { bg="#F0F4F8"; color="#5A6E8A"; label="À confirmer"; }
    return `<span style="background:${bg};color:${color};padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;margin-left:6px;white-space:nowrap;">${label}</span>`;
  });
  const maladies = ["pneumonie","pleurésie","embolie pulmonaire","infarctus","angine de poitrine","péricardite","costochondrite","hypertension","diabète","anémie","asthme","migraine","bronchite","gastrite","ulcère","hépatite","thrombose","arythmie","tachycardie","fibrillation","insuffisance cardiaque","insuffisance rénale","hypothyroïdie","hyperthyroïdie","épilepsie","méningite","sepsis","grippe","covid","tuberculose","sinusite","angine","otite","conjonctivite","appendicite","pancréatite","cholécystite","pyélonéphrite","cystite","infection","inflammation","ischémie","nécrose","fibrose","cancer","tumeur","leucémie","lymphome","sclérose","arthrite","arthrose","ostéoporose","goutte","lupus","polyarthrite","spondylarthrite","myopathie","neuropathie","dépression","anxiété","schizophrénie","alzheimer","parkinson","AVC","accident vasculaire","embolie","phlébite","varices","anévrisme","reflux","RGO","gastro-œsophagien","hernie","prolapsus","endométriose","SOPK","ménopause","ostéite","ostéomyélite","psoriasis","eczéma","dermatite","urticaire","allergie","choc anaphylactique","hypoglycémie","hyperglycémie","acidose","déshydratation","malnutrition","carence"];
  const maladiesPattern = new RegExp(`\\b(${maladies.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
  t = t.replace(maladiesPattern, match => `<span style="background:#FFF8E1;color:#795548;padding:0px 3px;border-radius:3px;font-weight:500;">${match}</span>`);
  const medicaments = ["Lisinopril","Paracétamol","Ibuprofène","Metformine","Aspirine","Amoxicilline","Doliprane","Voltarène","Cortisone","Ventoline","Metoprolol","Ramipril","Amlodipine","Atorvastatine","Oméprazole","Pantoprazole","Lorazépam","Diazépam","Sertraline","Fluoxétine","Insuline","Levothyrox","Warfarine","Héparine","Morphine","Tramadol","Codéine","Azithromycine","Ciprofloxacine","Doxycycline","Prednisolone","Prednisone","Budesonide","Salbutamol","Tiotropium","Fluticasone","Methotrexate","Hydroxychloroquine","Adalimumab","Infliximab","Rituximab","Bisoprolol","Carvedilol","Furosémide","Spironolactone","Digoxine","Amiodarone","Clopidogrel","Rivaroxaban","Apixaban","Dabigatran","Simvastatine","Rosuvastatine","Metoclopramide","Dompéridone","Ranitidine","Esoméprazole","Lansoprazole","Baclofen","Gabapentine","Prégabaline","Carbamazépine","Valproate","Lamotrigine","Lévétiracétam"];
  const medPattern = new RegExp(`\\b(${medicaments.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
  t = t.replace(medPattern, match => `<span style="background:#E6F1FB;color:#185FA5;padding:1px 5px;border-radius:4px;font-size:12px;font-weight:500;">${match}</span>`);
  return t;
}

function renderAIMessage(text, isStreaming, c) {
  if (!text) return null;
  const clean = text.replace(/={3,}/g, "").replace(/\\n/g, "\n").replace(/\*\*\*(.*?)\*\*\*/g, "$1").replace(/\*\*(.*?)\*\*/g, "$1").replace(/^\*\s*/gm, "").replace(/\*+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
  const highlighted = isStreaming ? null : highlightTerms(clean);
  return (
    <div style={{ background: c.card, border: `0.5px solid ${c.border}`, borderRadius: 12, padding: "20px 22px" }}>
      <div style={{ fontSize: 14, color: c.txt, lineHeight: 1.9, whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{ __html: isStreaming ? clean : highlighted }} />
      {isStreaming && (
        <span style={{ display: "inline-block", width: 2, height: 15, background: c.txt2, marginLeft: 2, verticalAlign: "middle", animation: "blink 1s infinite" }} />
      )}
      {!isStreaming && (
        <div style={{ borderTop: `0.5px solid ${c.border}`, marginTop: 16, paddingTop: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10" stroke="#888780" strokeWidth="1.5"/>
            <path d="M12 8v4M12 16v.5" stroke="#888780" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: 12, color: c.txt2, margin: 0, lineHeight: 1.6 }}>
            Ces informations sont indicatives et ne remplacent pas un avis médical. Consultez un professionnel de santé pour un diagnostic adapté.
          </p>
        </div>
      )}
    </div>
  );
}

const URGENCY_CONF = {
  low:  { label: "Conseil médical",  color: "#4ade80", bg: "rgba(74,222,128,.10)",  border: "rgba(74,222,128,.22)"  },
  med:  { label: "Urgence modérée", color: "#fbbf24", bg: "rgba(251,191,36,.10)",  border: "rgba(251,191,36,.22)"  },
  high: { label: "Urgence élevée",  color: "#f87171", bg: "rgba(248,113,113,.10)", border: "rgba(248,113,113,.22)" },
};

function ConfRing({ val, color }) {
  const R = 30, CV = 2 * Math.PI * R, offset = CV - (val / 100) * CV;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(99,142,203,0.2)" strokeWidth="6"/>
      <circle cx="40" cy="40" r={R} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={CV} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 40 40)" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,0,0,1)" }}/>
      <text x="40" y="44" textAnchor="middle" fontSize="15" fontWeight="700" fill={color} fontFamily="DM Sans,sans-serif">{val}%</text>
    </svg>
  );
}

function DiagResultPanel({ result, c, setPage }) {
  if (!result) return null;
  const urg = URGENCY_CONF[result.urgency] || URGENCY_CONF.med;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(57,88,134,.08)", animation: "diagSlideUp .4s ease" }}>
        <div style={{ background: "linear-gradient(135deg,#304B71,#4A6FA5)", padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,.45)", display: "block", marginBottom: 6 }}>Niveau d'urgence</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: urg.bg, color: urg.color, border: `1px solid ${urg.border}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: urg.color, display: "inline-block" }}/>
                {urg.label}
              </span>
              {result.diagnosis && (
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginTop: 10 }}>{result.diagnosis}</p>
              )}
            </div>
            {result.confidence != null && <ConfRing val={result.confidence} color={urg.color}/>}
          </div>
        </div>
      </div>
      {result.recommendations?.length > 0 && (
        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 18, padding: "18px 20px", boxShadow: "0 2px 8px rgba(57,88,134,.05)" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: c.txt3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Médecin recommandé</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.recommendations.map((r, i) => (
              <div key={i}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, background: c.bg, border: `1px solid ${c.border}`, cursor: "pointer", transition: "all 200ms", animation: `diagBubbleIn .35s ease ${i * 80}ms both` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.blue + "88"; e.currentTarget.style.background = c.blueLight; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.bg; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${r.color}22,${r.color}11)`, border: `1px solid ${r.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Stethoscope size={20} color={r.color}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: c.txt, marginBottom: 3 }}>{r.title}</p>
                  <p style={{ fontSize: 11, color: c.txt2, lineHeight: 1.4 }}>{r.desc}</p>
                </div>
                <ChevronRight size={16} color={c.txt3}/>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "rgba(99,142,203,.05)", border: "1px solid rgba(99,142,203,.14)", borderRadius: 14 }}>
        <Shield size={16} color="#638ECB"/>
        <p style={{ fontSize: 11, color: c.txt3, lineHeight: 1.6 }}>
          <strong style={{ color: c.txt2 }}>Avertissement :</strong> Ce diagnostic est fourni à titre indicatif uniquement. Il ne remplace en aucun cas la consultation d'un professionnel de santé qualifié.
        </p>
      </div>
    </div>
  );
}

function AIDiagnosisPage({ dk, setPage }) {
  const c = dk ? T.dark : T.light;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Nouvelle session. Décrivez les symptômes du patient en détail — localisation, intensité, durée — et je vous fournirai une analyse immédiate." },
  ]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [diagResult, setDiagResult] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  useEffect(() => {
    api.getAISessions()
      .then(data => { if (data?.sessions) setSessions(data.sessions); })
      .catch(() => {});
  }, []);

  const quickSymptoms = ["Glycémie élevée", "Douleur thoracique", "Hypertension", "Fièvre", "Chute", "Essoufflement", "Prise de médicaments"];

  function newSession() {
    setMessages([{ role: "ai", text: "Nouvelle session. Décrivez les symptômes du patient en détail — localisation, intensité, durée — et je vous fournirai une analyse immédiate." }]);
    setDiagResult(null);
    setInput("");
    setAttachedFiles([]);
    setActiveSession(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  async function deleteSession(e, sessionId) {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSession === sessionId) newSession();
    api.deleteAISession(sessionId).catch(() => {});
  }

  function pickSession(s) {
    setActiveSession(s.id);
    setDiagResult(null);
    const history = s.history || s.messages || [];
    if (history.length) {
      setMessages(history.map(h => ({ role: h.role === "user" ? "user" : "ai", text: h.content || h.text || "", timestamp: h.timestamp })));
    } else {
      setMessages([{ role: "ai", text: "Session chargée. Vous pouvez continuer la conversation." }]);
    }
  }

  const send = async (text) => {
    const msg = text || input.trim();
    const hasFiles = attachedFiles.length > 0;
    if (!msg && !hasFiles) return;

    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(m => [...m, { role: "user", text: msg || `📎 ${attachedFiles.length} fichier(s)`, timestamp: ts }]);
    setInput("");
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);
    setLoading(true);
    setDiagResult(null);
    setCurrentAlert(null);

    const history = messages
      .filter(m => m.role !== "ai" || !m.text.includes("Nouvelle session"))
      .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    setMessages(m => [...m, { role: "ai", text: "", isStreaming: true, timestamp: ts }]);

    try {
      let aiText = "";
      if (hasFiles && filesToSend.length > 0) {
        await api.analyzeMedicalFileStream(filesToSend[0].file, msg, "fr", history, (chunk) => {
          aiText += chunk;
          setMessages(prev => { const last = prev[prev.length - 1]; return [...prev.slice(0, -1), { ...last, text: aiText }]; });
        });
        setMessages(prev => { const last = prev[prev.length - 1]; return [...prev.slice(0, -1), { ...last, isStreaming: false }]; });
      } else {
        let metaData = null;
        await api.analyzeSymptomsStream(
          { symptoms: msg, lang: "fr", history, session_id: activeSession },
          (chunk) => {
            aiText += chunk;
            setMessages(prev => { const last = prev[prev.length - 1]; return [...prev.slice(0, -1), { ...last, text: aiText }]; });
          },
          (meta) => { if (meta.type === "session_saved") { setActiveSession(meta.session_id); } else { metaData = meta; } },
          (alert) => setCurrentAlert(alert),
        );
        setMessages(prev => { const last = prev[prev.length - 1]; return [...prev.slice(0, -1), { ...last, isStreaming: false }]; });

        const rawUrgency = metaData?.urgency || "";
        const urgencyKey = /urgent|high|élevé/i.test(rawUrgency) ? "high" : /modéré|moderate|med|moyen/i.test(rawUrgency) ? "med" : "low";
        const specialtyName = metaData?.specialist?.specialty_fr || metaData?.specialist?.specialty || metaData?.recommended_specialist || null;
        const topDisease = metaData?.diseases?.length ? [...metaData.diseases].sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))[0] : null;
        const confidenceVal = topDisease ? Math.round(topDisease.probability ?? (topDisease.confidence ?? 0) * 100) : null;
        setDiagResult({
          urgency: urgencyKey,
          confidence: confidenceVal,
          diagnosis: topDisease?.name_fr || metaData?.diagnosis || null,
          tags: topDisease?.key_symptoms?.split(",").map(s => s.trim()).filter(Boolean) || [],
          recommendations: specialtyName ? [{ color: c.blue, title: specialtyName, desc: urgencyKey === "high" ? "Consultation urgente recommandée — sous 24h" : urgencyKey === "med" ? "Consultation recommandée cette semaine" : "Consultation de suivi conseillée" }] : [],
        });
      }
    } catch (err) {
      console.error("AI Error:", err);
      setMessages(m => { const last = m[m.length - 1]; const base = last?.isStreaming ? m.slice(0, -1) : m; return [...base, { role: "ai", text: "Désolé, une erreur est survenue lors de l'analyse. Vérifiez votre connexion et réessayez." }]; });
    } finally {
      setLoading(false);
      api.getAISessions().then(data => { if (data?.sessions) setSessions(data.sessions); }).catch(() => {});
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, file: f }))]);
    e.target.value = "";
  };

  const toggleRecording = () => {
    setIsRecording(r => !r);
    if (!isRecording) {
      setTimeout(() => { setIsRecording(false); setInput("Le patient présente une glycémie à 9.8 et des tremblements depuis ce matin"); }, 2000);
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)", background: c.bg, overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes diagBubbleIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes diagSlideUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes diagWaveFlow  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes diagSpin      { to{transform:rotate(360deg)} }
        @keyframes diagPulse     { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes blink         { 0%,100%{opacity:1} 50%{opacity:0} }
        .diag-wave-text { background: linear-gradient(90deg,#304B71,#638ECB,#8AAEE0,#638ECB,#304B71); background-size: 300% 100%; animation: diagWaveFlow 2.5s ease infinite; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .diag-scroll::-webkit-scrollbar { width:4px; }
        .diag-scroll::-webkit-scrollbar-track { background:transparent; }
        .diag-scroll::-webkit-scrollbar-thumb { background:rgba(99,142,203,.22); border-radius:99px; }
        .diag-chip:hover { opacity: 0.8; }
        .diag-textarea::placeholder { color: ${dk ? "rgba(240,243,250,0.38)" : "rgba(13,27,46,0.38)"} !important; }
      `}</style>

      {/* LEFT SIDEBAR */}
      <div style={{ width: showSidebar ? 240 : 0, background: c.card, borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 250ms ease", flexShrink: 0 }}>
        {showSidebar && (
          <>
            <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${c.border}` }}>
              <button onClick={newSession}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.blueLight, color: c.blue, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <Plus size={13} color={c.blue}/> Nouvelle session
              </button>
            </div>
            <div className="diag-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: c.txt3, padding: "6px 8px 4px" }}>Historique</p>
              {sessions.length === 0 && (
                <p style={{ fontSize: 11, color: c.txt3, textAlign: "center", padding: "20px 8px", opacity: .6 }}>Aucune session précédente</p>
              )}
              {sessions.map(s => {
                const isActive = activeSession === s.id;
                const d = new Date(s.updated_at);
                const dateStr = isNaN(d) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                return (
                  <div key={s.id} onClick={() => pickSession(s)}
                    style={{ padding: "10px", borderRadius: 10, marginBottom: 2, cursor: "pointer", transition: "all 150ms", background: isActive ? c.blueLight : "transparent", border: `1px solid ${isActive ? c.blue + "22" : "transparent"}` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: isActive ? c.blue : c.txt, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{s.title || "Session sans titre"}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <span style={{ fontSize: 9, color: c.txt3, whiteSpace: "nowrap" }}>{dateStr}</span>
                        <button onClick={(e) => deleteSession(e, s.id)} title="Supprimer"
                          style={{ width: 18, height: 18, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: c.txt3, opacity: .6, padding: 0 }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "#E05555"; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = ".6"; e.currentTarget.style.color = c.txt3; }}>
                          <Trash2 size={11}/>
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: 10, color: c.txt3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                      {s.message_count} échange{s.message_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${c.border}` }}>
              <p style={{ fontSize: 9, color: c.txt3, lineHeight: 1.5 }}>Non substitutif à un médecin. Usage informatif uniquement.</p>
            </div>
          </>
        )}
      </div>

      {/* CENTER CHAT */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: c.bg, borderRight: `1px solid ${c.border}` }}>
        <div style={{ height: 52, background: c.card, borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 10, flexShrink: 0 }}>
          <button onClick={() => setShowSidebar(v => !v)}
            style={{ width: 30, height: 30, borderRadius: 8, background: "transparent", border: `1px solid ${c.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <History size={14} color={c.txt3}/>
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: c.txt, lineHeight: 1.2 }}>Diagnostic IA</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", animation: "diagPulse 2s infinite", display: "inline-block" }}/>
              <span style={{ fontSize: 10, color: c.txt3 }}>Gemini + ChromaDB · En ligne</span>
            </div>
          </div>
        </div>

        <div className="diag-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: c.blueLight, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Brain size={26} color={c.blue}/>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: c.txt, marginBottom: 6 }}>Assistant Diagnostic IA</p>
              <p style={{ fontSize: 12, color: c.txt3, lineHeight: 1.65, maxWidth: 280, margin: "0 auto" }}>Décrivez les symptômes du patient en langage naturel pour obtenir une analyse médicale immédiate.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ animation: "diagBubbleIn .3s ease both", display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {msg.role === "user" ? (
                <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", background: "linear-gradient(135deg,#395886,#4A6FA5)", color: "#fff", fontSize: 13, lineHeight: 1.65, boxShadow: "0 2px 10px rgba(57,88,134,.2)" }}>{msg.text}</div>
              ) : (
                <div style={{ maxWidth: "90%", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: c.blueLight, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Brain size={14} color={c.blue}/>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {i === messages.length - 1 && currentAlert && (
                      <div style={{ background: currentAlert.level === "critical" ? "#FCEBEB" : "#FAEEDA", border: `1.5px solid ${currentAlert.level === "critical" ? "#E24B4A" : "#EF9F27"}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: currentAlert.level === "critical" ? "#E24B4A" : "#EF9F27", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 18 }}>{currentAlert.level === "critical" ? "🚨" : "⚠️"}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 4px", color: currentAlert.level === "critical" ? "#7A0D0D" : "#854F0B" }}>
                            {currentAlert.level === "critical" ? "Urgence médicale détectée" : "Attention médicale requise"}
                          </p>
                          <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6, color: currentAlert.level === "critical" ? "#A32D2D" : "#9e6400" }}>{currentAlert.message}</p>
                        </div>
                      </div>
                    )}
                    {renderAIMessage(msg.text, msg.isStreaming, c)}
                  </div>
                </div>
              )}
              {msg.timestamp && (
                <span style={{ fontSize: 10, opacity: .4, marginTop: 3, color: c.txt3, paddingLeft: msg.role === "ai" ? 38 : 0 }}>{msg.timestamp}</span>
              )}
            </div>
          ))}
          {loading && !messages[messages.length - 1]?.isStreaming && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", alignSelf: "flex-start", background: "linear-gradient(135deg,rgba(48,75,113,.08),rgba(99,142,203,.08))", border: "1px solid rgba(99,142,203,.15)", borderRadius: 14, animation: "diagBubbleIn .3s ease" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#638ECB", animation: "diagSpin 1s linear infinite", borderTop: "2px solid transparent", boxShadow: "0 0 0 2px rgba(99,142,203,.3)" }}/>
              <span className="diag-wave-text" style={{ fontSize: 12, fontWeight: 600 }}>MedSmart IA analyse les symptômes…</span>
            </div>
          )}
          <div ref={messagesEndRef}/>
        </div>

        <div className="diag-scroll" style={{ padding: "8px 14px 4px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0, borderTop: `1px solid ${c.border}` }}>
          {quickSymptoms.map(chip => (
            <button key={chip} onClick={() => send(chip)} className="diag-chip"
              style={{ padding: "5px 12px", borderRadius: 999, background: c.blueLight, border: `1px solid ${c.border}`, color: c.blue, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 150ms", flexShrink: 0 }}>
              {chip}
            </button>
          ))}
        </div>

        <div style={{ padding: "10px 14px 14px", flexShrink: 0, background: c.card, borderTop: `1px solid ${c.border}` }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, background: c.bg, border: `2px solid ${c.border}`, borderRadius: 16, padding: "10px 14px", transition: "border-color 200ms" }}
            onFocusCapture={e => e.currentTarget.style.borderColor = c.blue}
            onBlurCapture={e => e.currentTarget.style.borderColor = c.border}>
            <label style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" multiple style={{ display: "none" }} onChange={handleFileChange}/>
              <Paperclip size={13} color={c.txt3}/>
            </label>
            <textarea ref={textareaRef} value={input} className="diag-textarea"
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Décrivez les symptômes du patient en détail…" rows={1}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", resize: "none", fontSize: 13, color: c.txt, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif", maxHeight: 100, overflowY: "auto" }}/>
            <button onClick={toggleRecording}
              style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, border: `1px solid ${isRecording ? "#ef4444" : c.border}`, background: isRecording ? "rgba(239,68,68,.1)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mic size={13} color={isRecording ? "#ef4444" : c.txt3}/>
            </button>
            <button onClick={() => send()} disabled={!input.trim() && attachedFiles.length === 0}
              style={{ width: 36, height: 36, borderRadius: 10, border: "none", flexShrink: 0, cursor: (input.trim() || attachedFiles.length > 0) ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 200ms", background: (input.trim() || attachedFiles.length > 0) ? "#395886" : c.border, boxShadow: (input.trim() || attachedFiles.length > 0) ? "0 2px 8px rgba(57,88,134,.3)" : "none" }}>
              <Send size={14} color="#fff"/>
            </button>
          </div>
          {attachedFiles.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {attachedFiles.map((f, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, padding: "3px 10px", borderRadius: 999, border: `1px solid ${c.border}`, color: c.txt, background: c.bg }}>
                  📎 {f.name}
                  <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ marginLeft: 4, opacity: .5, background: "none", border: "none", cursor: "pointer", color: c.txt, lineHeight: 1 }}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: RESULTS PANEL */}
      <div className="diag-scroll" style={{ flex: "0 0 300px", overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2, flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: c.txt, marginBottom: 2 }}>Résultats & Recommandations</h2>
            <p style={{ fontSize: 11, color: c.txt3 }}>Basé sur votre dernière interaction</p>
          </div>
          {diagResult && (
            <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: c.blueLight, color: c.blue, border: `1px solid ${c.blue}22` }}>
              Score : {diagResult.confidence}% de confiance
            </span>
          )}
        </div>
        {!diagResult && !loading && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: c.blueLight, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Activity size={28} color={c.blue}/>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: c.txt, marginBottom: 8 }}>Aucun résultat pour l'instant</p>
            <p style={{ fontSize: 12, color: c.txt3, lineHeight: 1.7, maxWidth: 280 }}>Décrivez les symptômes dans le chat pour obtenir un diagnostic provisoire et des recommandations.</p>
          </div>
        )}
        {loading && !diagResult && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, background: "linear-gradient(135deg,#304B71,#638ECB)", boxShadow: "0 4px 20px rgba(57,88,134,.25)" }}>
              <div style={{ width: 20, height: 20, border: "2.5px solid rgba(255,255,255,.3)", borderTop: "2.5px solid white", borderRadius: "50%", animation: "diagSpin 0.9s linear infinite" }}/>
            </div>
            <span className="diag-wave-text" style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Analyse en cours…</span>
            <p style={{ fontSize: 11, color: c.txt3 }}>Gemini RAG traite les données médicales</p>
          </div>
        )}
        <DiagResultPanel result={diagResult} c={c} setPage={() => {}} />
      </div>
    </div>
  );
}

function MyPatientsView({ onChangePage, dk, c }) {
  const { t } = useLanguage();
  const { gmPatients: patients, loadGMDemoData } = useData();
  const [profilePatient, setProfilePatient] = useState(null);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">

      {/* ── Modal Profil Patient ── */}
      {profilePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={e => { if (e.target === e.currentTarget) setProfilePatient(null); }}>
          <div className="rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border"
            style={{ background: c.card, borderColor: c.border }}>

            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: c.border }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white"
                  style={{ background: profilePatient.color === 'blue' ? c.blue : profilePatient.color === 'amber' ? c.amber : c.green }}>
                  {profilePatient.initials}
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: c.txt }}>{profilePatient.name}</h2>
                  <p className="text-sm" style={{ color: c.txt3 }}>
                    {profilePatient.age} ans · {profilePatient.gender === 'Male' ? (t('male') || 'Homme') : (t('female') || 'Femme')} · {profilePatient.city}
                  </p>
                </div>
              </div>
              <button onClick={() => setProfilePatient(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
                style={{ background: c.blueLight }}>
                <X size={15} style={{ color: c.txt3 }} />
              </button>
            </div>

            {/* Corps */}
            <div className="p-6 space-y-5">
              {/* Pathologies */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>{t('pathologies_label') || "Pathologies"}</p>
                <div className="flex flex-wrap gap-2">
                  {profilePatient.conditions.map((cond, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full border font-medium"
                      style={{ background: c.blueLight, color: c.blue, borderColor: c.blue + "30" }}>{cond}</span>
                  ))}
                </div>
              </div>

              {/* Contacts */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>{t('patient_contacts_label') || "Contacts du patient"}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
                    <span className="text-xs font-medium" style={{ color: c.txt2 }}>{t('direct_phone_label') || "Téléphone direct"}</span>
                    <a href={`tel:${profilePatient.phone || "+21300000000"}`}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg"
                      style={{ background: c.green + "15", color: c.green }}>
                      <Phone size={12} /> {profilePatient.phone || t('not_specified') || "Non renseigné"}
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
                    <span className="text-xs font-medium" style={{ color: c.txt2 }}>{t('emergency_contact_label') || "Contact d'urgence"}</span>
                    <a href={`tel:${profilePatient.emergencyPhone || "+21300000001"}`}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg"
                      style={{ background: c.red + "15", color: c.red }}>
                      <Phone size={12} /> {profilePatient.emergencyContact || t('family_label') || "Famille"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>{t('address_label') || "Adresse"}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profilePatient.address || profilePatient.city || "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 p-3 rounded-xl border transition-opacity hover:opacity-80"
                  style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
                  <MapPin size={14} style={{ color: c.blue, flexShrink: 0, marginTop: 1 }} />
                  <span className="text-sm" style={{ color: c.txt2 }}>
                    {profilePatient.address || profilePatient.city || t('no_address_specified') || "Adresse non renseignée"}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <header>
        <h1 className="text-3xl font-bold mb-2" style={{ color: c.txt }}>{t('my_patients_title') || "Mes Patients"}</h1>
        <p className="font-medium" style={{ color: c.txt3 }}>{t('patients_assigned_count', {count: patients.length}) || `${patients.length} patients assignés à votre charge`}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {patients.length === 0 ? (
          <Card dk={dk} empty={true} className="col-span-full flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: c.blue + "15", color: c.blue }}><UserPlus size={32} /></div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: c.txt }}>{t('no_patient_assigned_title') || "Aucun Patient Assigné"}</h2>
            <p className="text-sm max-w-md mb-8" style={{ color: c.txt3 }}>{t('no_patient_assigned_desc_prod') || "Vous n'avez pas encore été assigné à des patients. Les patients apparaitront ici lorsqu'une demande de soins sera acceptée."}</p>
          </Card>
        ) : patients.map((p) => (
          <Card key={p.id} dk={dk} className="p-8 group relative overflow-hidden hover:shadow-xl hover:border-blue-500/20">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[80px] opacity-10"
              style={{ background: p.color === 'blue' ? c.blue : p.color === 'amber' ? c.amber : c.green }}></div>
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold shadow-xl"
                style={{ background: dk ? "#1F2937" : "#F8FAFC", borderColor: c.border }}>
                <span style={{ color: dk ? "#fff" : c.blue }}>{p.initials}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold group-hover:text-blue-500 transition-colors" style={{ color: c.txt }}>{p.name}</h2>
                <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: c.txt3 }}>{p.age} ans · {p.gender === 'Male' ? 'Homme' : 'Femme'} · {p.city}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {p.conditions.map((cond, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                    style={{ background: dk ? "rgba(255,255,255,0.05)" : "#fff", borderColor: c.border, color: c.txt2 }}>
                    {cond}
                  </span>
                ))}
              </div>
              <div className="w-full grid grid-cols-1 gap-3 pt-4 border-t" style={{ borderColor: c.border }}>
                <button
                  onClick={() => setProfilePatient(p)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border flex items-center justify-center gap-2"
                  style={{ background: dk ? "rgba(255,255,255,0.05)" : "#fff", borderColor: c.border, color: c.txt2 }}>
                  <User size={13} /> {t('view_profile_btn') || "Voir profil"}
                </button>
                <a href={`tel:${p.emergencyPhone || "+21300000000"}`}
                  className="w-full py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Phone size={13} /> Alerter
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TreatmentsView({ dk, c }) {
  const { t } = useLanguage();
  const {
    gmPatients: patients, gmTreatments: treatments, loadGMDemoData,
    addMedicationToTreatment, removeMedicationFromTreatment,
    addPatientToTreatments, removePatientFromTreatments,
  } = useData();

  const [editId, setEditId] = useState(null);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", slot: "morning" });
  const [showAddPatient, setShowAddPatient] = useState(null); // patient id to confirm add
  const [removedHistory, setRemovedHistory] = useState([]); // {id, initials, patientName, condition, removedAt}

  const editTreatment = treatments.find(t => t.id === editId) || null;
  const slots = [
    { key: "morning", label: t('morning_label') || "Matin" },
    { key: "afternoon", label: t('afternoon_label') || "Après-midi" },
    { key: "evening", label: t('evening_label') || "Soir" },
  ];

  const handleAddMed = () => {
    if (!newMed.name.trim() || !editTreatment) return;
    addMedicationToTreatment(editId, newMed.slot, { name: newMed.name.trim(), dosage: newMed.dosage.trim() });
    setNewMed({ name: "", dosage: "", slot: newMed.slot });
  };

  const patientsNotInPlan = patients.filter(p => !treatments.find(t => t.id === p.id));

  const inputCls = "px-3 py-2 rounded-xl text-sm outline-none border";
  const inputStyle = { background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">

      {/* ── Modal Modifier Traitement ── */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={e => { if (e.target === e.currentTarget) setEditId(null); }}>
          <div className="rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border"
            style={{ background: c.card, borderColor: c.border }}>
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: c.border }}>
              <h2 className="text-lg font-bold" style={{ color: c.txt }}>
                {t('modify_treatment_title', {name: editTreatment?.patientName}) || `Modifier — ${editTreatment?.patientName}`}
              </h2>
              <button onClick={() => setEditId(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
                style={{ background: c.blueLight }}>
                <X size={15} style={{ color: c.txt3 }} />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[50vh] overflow-y-auto">
              {slots.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>{label}</p>
                  <div className="space-y-2">
                    {(editTreatment?.[key] || []).length === 0 && (
                      <p className="text-xs italic" style={{ color: c.txt3 }}>{t('no_meds_text') || "Aucun médicament"}</p>
                    )}
                    {(editTreatment?.[key] || []).map((med, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-2.5 rounded-xl border"
                        style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
                        <div className="flex items-center gap-2">
                          <Pill size={14} style={{ color: c.blue }} />
                          <span className="text-sm font-semibold" style={{ color: c.txt }}>{med.name}</span>
                          {med.dosage && <span className="text-xs" style={{ color: c.txt3 }}>{med.dosage}</span>}
                        </div>
                        <button onClick={() => removeMedicationFromTreatment(editId, key, idx)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"
                          style={{ background: c.red + "15", color: c.red }}>
                          <Trash2 size={13} title={t('remove_btn') || "Supprimer"} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t space-y-3" style={{ borderColor: c.border }}>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>{t('add_medication_title') || "Ajouter un médicament"}</p>
              <div className="flex gap-2 flex-wrap">
                <input type="text" placeholder={t('name_placeholder') || "Nom"} value={newMed.name}
                  onChange={e => setNewMed(m => ({ ...m, name: e.target.value }))}
                  className={`flex-1 min-w-[120px] ${inputCls}`} style={inputStyle} />
                <input type="text" placeholder={t('dosage_placeholder') || "Dosage"} value={newMed.dosage}
                  onChange={e => setNewMed(m => ({ ...m, dosage: e.target.value }))}
                  className={`w-28 ${inputCls}`} style={inputStyle} />
                <div className="w-36">
                  <DashSelect
                    value={newMed.slot}
                    options={[
                      { value: "morning", label: "Matin" },
                      { value: "afternoon", label: "Après-midi" },
                      { value: "evening", label: "Soir" },
                    ]}
                    onSelect={v => setNewMed(m => ({ ...m, slot: v }))}
                    dk={dk}
                    c={c}
                  />
                </div>
                <button onClick={handleAddMed} disabled={!newMed.name.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                  style={{ background: newMed.name.trim() ? c.blue : c.border }}>
                  <Plus size={15} /> {t('add_btn') || "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── En-tête + boutons globaux ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: c.txt }}>{t('treatment_plans_title') || "Plans de Traitement"}</h1>
          <p className="text-sm font-medium" style={{ color: c.txt3 }}>{t('all_patients_at_planning', {count: treatments.length}) || `${treatments.length} patient(s) au planning`}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Ajouter un patient */}
          {patientsNotInPlan.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowAddPatient(showAddPatient ? null : "open")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{ background: c.blue }}>
                <UserPlus size={15} /> {t('add_patient_btn') || "Ajouter un patient"}
              </button>
              {showAddPatient === "open" && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAddPatient(null)} />
                  <div className="absolute right-0 top-12 z-50 rounded-2xl border shadow-xl py-2 min-w-[220px]"
                    style={{ background: c.card, borderColor: c.border }}>
                    {patientsNotInPlan.map(p => (
                      <button key={p.id}
                        onClick={() => { addPatientToTreatments(p); setShowAddPatient(null); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-all hover:opacity-80"
                        style={{ color: c.txt }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: p.color === 'blue' ? c.blue : p.color === 'amber' ? c.amber : c.green }}>
                          {p.initials}
                        </div>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {treatments.length === 0 && patients.length === 0 && null}
        </div>
      </div>

      {/* ── Liste des plans ── */}
      {treatments.length === 0 ? (
        <Card dk={dk} empty={true} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: c.blue + "15" }}>
            <Pill size={28} style={{ color: c.blue }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: c.txt }}>{t('no_treatment_plan_title') || "Aucun plan de traitement"}</h2>
          <p className="text-sm max-w-sm" style={{ color: c.txt3 }}>
            {patients.length === 0
              ? (t('load_demo_first_desc') || "Chargez d'abord les données démo pour voir les patients.")
              : (t('add_patient_to_planning_desc') || "Utilisez le bouton ci-dessus pour ajouter un patient au planning.")}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {treatments.map(t => (
            <Card key={t.id} dk={dk} className="hover:shadow-md transition-all">
              {/* Header carte */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ background: c.blue }}>
                    {t.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: c.txt }}>{t.patientName}</h3>
                    <p className="text-[11px] font-medium" style={{ color: c.txt3 }}>{t.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditId(t.id); setNewMed({ name: "", dosage: "", slot: "morning" }); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all hover:opacity-80"
                    style={{ borderColor: c.blue + "40", color: c.blue, background: c.blue + "10" }}>
                    <Plus size={12} /> {t('modify_btn') || "Modifier"}
                  </button>
                  <button onClick={() => {
                    setRemovedHistory(h => [...h, { id: t.id, initials: t.initials, patientName: t.patientName, condition: t.condition, removedAt: new Date().toLocaleDateString("fr-FR") }]);
                    removePatientFromTreatments(t.id);
                  }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:bg-red-500 hover:text-white"
                    style={{ borderColor: c.red + "30", color: c.red, background: c.red + "10" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Créneaux médicaments */}
              <div className="space-y-3">
                {slots.map(({ key, label }) => {
                  const meds = t[key] || [];
                  if (meds.length === 0) return null;
                  return (
                    <div key={key} className="rounded-xl p-3 border" style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.txt3 }}>{label}</p>
                      <div className="space-y-1.5">
                        {meds.map((med, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <Pill size={13} style={{ color: c.blue }} />
                              <span style={{ color: c.txt }}>{med.name}</span>
                              {med.dosage && <span className="text-xs font-medium" style={{ color: c.txt3 }}>{med.dosage}</span>}
                            </div>
                            <button onClick={() => removeMedicationFromTreatment(t.id, key, idx)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:bg-red-500 hover:text-white shrink-0"
                              style={{ color: c.red, background: c.red + "12" }}>
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {slots.every(({ key }) => (t[key] || []).length === 0) && (
                  <p className="text-xs text-center py-2 italic" style={{ color: c.txt3 }}>
                    {t('no_medications_added') || "Aucun médicament — cliquez sur Modifier pour en ajouter."}
                  </p>
                )}
              </div>

              {t.specialInstructions && (
                <div className="mt-4 p-3 rounded-xl border text-xs italic"
                  style={{ background: c.amber + "08", borderColor: c.amber + "25", color: c.txt2 }}>
                  {t.specialInstructions}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── Historique ── */}
      {removedHistory.length > 0 && (
        <div>
          <h2 className="text-base font-bold mb-4" style={{ color: c.txt }}>Historique</h2>
          <div className="space-y-3">
            {removedHistory.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border"
                style={{ background: c.red + "08", borderColor: c.red + "25" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border"
                    style={{ background: c.red + "15", color: c.red, borderColor: c.red + "25" }}>
                    {h.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: c.txt }}>{h.patientName}</p>
                    <p className="text-xs font-medium" style={{ color: c.txt3 }}>{h.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: c.txt3 + "15", color: c.txt3 }}>
                    Retiré le {h.removedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsView({ onTarifSaved, dk, c, user }) {
  const { t, lang, setLang } = useLanguage();
  const [showPwd, setShowPwd] = useState(false);
  const [locSaved, setLocSaved] = useState(false);
  const [tarifSaved, setTarifSaved] = useState(false);

  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwdStatus, setPwdStatus] = useState({ type: "", msg: "" });
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  const [locForm, setLocForm] = useState({ address: "", commune: "", wilaya: "Alger", mapsUrl: "" });
  const [tarifForm, setTarifForm] = useState({ tarifSoin: "", tarifNuit: "", tarifMensuel: "" });
  const [identityReason, setIdentityReason] = useState("");
  const [emailReason, setEmailReason] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setStatus({ type: "", msg: "" });
      const nameChanged = form.first_name !== (user?.first_name || "") || form.last_name !== (user?.last_name || "");
      const emailChanged = form.email !== (user?.email || "");

      if (nameChanged && !identityReason) {
        setStatus({ type: "info", msg: "Veuillez indiquer le motif du changement de nom." });
        setIsSaving(false);
        return;
      }
      if (emailChanged && !emailReason) {
        setStatus({ type: "info", msg: "Veuillez indiquer le motif du changement d'email." });
        setIsSaving(false);
        return;
      }

      const updatePromises = [
        api.updateMe({ email: emailChanged ? form.email : undefined, phone: form.phone }),
      ];
      if (nameChanged && identityReason) {
        updatePromises.push(
          api.requestProfileUpdate({ new_first_name: form.first_name, new_last_name: form.last_name, reason: identityReason })
        );
      } else if (!nameChanged) {
        updatePromises[0] = api.updateMe({
          first_name: form.first_name,
          last_name: form.last_name,
          email: emailChanged ? form.email : undefined,
          phone: form.phone,
        });
      }

      await Promise.all(updatePromises);
      setStatus({
        type: "success",
        msg: nameChanged
          ? "Profil mis à jour. La demande de changement de nom a été envoyée à l'administrateur."
          : "Profil mis à jour avec succès ✅",
      });
      setIdentityReason("");
      setEmailReason("");
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } catch {
      setStatus({ type: "error", msg: t('update_error') || "Erreur lors de la mise à jour ❌" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePwd = async () => {
    try {
      setIsSavingPwd(true);
      setPwdStatus({ type: "", msg: "" });
      await api.changePassword(pwdForm);
      setPwdStatus({ type: "success", msg: t('password_changed_success') || "Mot de passe modifié ✅" });
      setPwdForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPwdStatus({ type: "", msg: "" }), 4000);
    } catch {
      setPwdStatus({ type: "error", msg: t('password_change_error') || "Erreur lors du changement ❌" });
      setTimeout(() => setPwdStatus({ type: "", msg: "" }), 4000);
    } finally {
      setIsSavingPwd(false);
    }
  };

  const handleSaveLocation = () => {
    setLocSaved(true);
    setTimeout(() => setLocSaved(false), 3000);
  };

  const handleSaveTarifs = () => {
    setTarifSaved(true);
    if (onTarifSaved) onTarifSaved(tarifForm.tarifMensuel);
    setTimeout(() => setTarifSaved(false), 3000);
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
          <p className="font-semibold mb-5" style={{ color: c.txt }}>{t('profile_title') || "Profil"}</p>
          {status.msg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{
              background: status.type === "success" ? "#2D8C6F12" : status.type === "info" ? "#E8A83812" : "#E0555512",
              color: status.type === "success" ? "#2D8C6F" : status.type === "info" ? "#E8A838" : "#E05555",
              border: `1px solid ${status.type === "success" ? "#2D8C6F44" : status.type === "info" ? "#E8A83844" : "#E0555544"}`,
            }}>{status.msg}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Prénom</label>
              <input type="text"
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                style={{ background: c.card, borderColor: c.border, color: c.txt }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Nom</label>
              <input type="text"
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                style={{ background: c.card, borderColor: c.border, color: c.txt }}
              />
            </div>
            {(form.first_name !== (user?.first_name || "") || form.last_name !== (user?.last_name || "")) && (
              <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2">
                <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#E8A838" }}>
                  Motif du changement de nom (Requis pour validation Admin)
                </label>
                <textarea
                  value={identityReason}
                  onChange={(e) => setIdentityReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous souhaitez modifier votre identité officielle..."
                  className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all min-h-[60px]"
                  style={{ background: "#E8A83808", borderColor: "#E8A83844", color: c.txt }}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Email</label>
              <input type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                style={{ background: c.card, borderColor: c.border, color: c.txt }}
              />
            </div>
            {form.email !== (user?.email || "") && (
              <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2">
                <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#E8A838" }}>
                  Motif du changement d'email (Requis)
                </label>
                <textarea
                  value={emailReason}
                  onChange={(e) => setEmailReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous souhaitez changer votre adresse email..."
                  className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all min-h-[60px]"
                  style={{ background: "#E8A83808", borderColor: "#E8A83844", color: c.txt }}
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Téléphone</label>
              <input type="text"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                style={{ background: c.card, borderColor: c.border, color: c.txt }}
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: c.blue, opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? (t('saving_btn') || "Enregistrement...") : (t('save_changes_btn') || "Sauvegarder")}
          </button>
        </Card>

        {/* Sécurité */}
        <Card dk={dk}>
          <p className="font-semibold mb-5" style={{ color: c.txt }}>{t('security_title') || "Sécurité"}</p>
          {pwdStatus.msg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{
              background: pwdStatus.type === "success" ? "#2D8C6F12" : "#E0555512",
              color: pwdStatus.type === "success" ? "#2D8C6F" : "#E05555",
              border: `1px solid ${pwdStatus.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
            }}>{pwdStatus.msg}</div>
          )}
          {[
            { label: t('current_password_label') || "Mot de passe actuel", key: "currentPassword" },
            { label: t('new_password_label') || "Nouveau mot de passe", key: "newPassword" },
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
            {isSavingPwd ? (t('updating_btn') || "Mise à jour...") : (t('update_password_btn') || "Changer le mot de passe")}
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
            <p className="font-bold text-base" style={{ color: c.txt }}>{t('intervention_zone_title') || "Zone d'intervention & Maps"}</p>
            <p className="text-xs" style={{ color: c.txt3 }}>{t('intervention_zone_desc') || "Gérez votre zone d'intervention à domicile"}</p>
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
            <DashSelect
              label={t('wilaya_label') || "Wilaya"}
              value={locForm.wilaya}
              options={WILAYAS_LIST}
              onSelect={(w) => setLocForm((f) => ({ ...f, wilaya: w }))}
              dk={dk}
              c={c}
              placeholder={t('select_wilaya_placeholder') || "Sélectionner votre wilaya"}
            />
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
              <MapPin size={15} /> {t('update_map_btn') || "Mettre à jour la carte"}
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
                      <MapPin size={12} /> {t('open_in_maps_btn') || "Ouvrir dans Maps"}
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

      {/* ── Tarifs de garde ── */}
      <Card dk={dk}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.green + "18" }}>
            <Shield size={18} style={{ color: c.green }} />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: c.txt }}>{t('care_tariffs_title') || "Tarifs de garde"}</p>
            <p className="text-xs" style={{ color: c.txt3 }}>{t('care_tariffs_desc') || "Définissez vos tarifs affichés aux patients"}</p>
          </div>
        </div>

        {tarifSaved && (
          <div className="mb-5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2"
            style={{ background: "#2D8C6F12", color: "#2D8C6F", border: "1px solid #2D8C6F44" }}>
            <Check size={14} /> Tarifs mis à jour avec succès ✅
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          {[
            { key: "tarifSoin", label: t('tarif_soin_label') || "Tarif Soin Ponctuel", placeholder: "Ex: 2000", suffix: "DZD" },
            { key: "tarifNuit", label: t('tarif_nuit_label') || "Tarif Garde de Nuit", placeholder: "Ex: 4000", suffix: "DZD" },
            { key: "tarifMensuel", label: t('tarif_mensuel_label') || "Tarif Mensuel (optionnel)", placeholder: "Ex: 45000", suffix: "DZD" },
          ].map(({ key, label, placeholder, suffix }) => (
            <div key={key}>
              <label className={labelCls} style={{ color: c.txt2 }}>{label}</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={placeholder}
                  value={tarifForm[key]}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setTarifForm((f) => ({ ...f, [key]: v }));
                  }}
                  className={inputCls}
                  style={inputStyle}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none" style={{ color: c.txt3 }}>
                  {suffix}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveTarifs}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg, #1F6B50, ${c.green})` }}
        >
          <Shield size={15} /> {t('save_tariffs_btn') || "Enregistrer les tarifs"}
        </button>
      </Card>

      {/* ── Langue + À propos ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card dk={dk}>
          <p className="font-semibold mb-4" style={{ color: c.txt }}>Language</p>
          <div className="flex gap-2 flex-wrap">
            {["🇫🇷 Français", "🇬🇧 English"].map((langName, i) => {
              const targetLang = i === 0 ? 'fr' : 'en';
              const active = lang === targetLang;
              return (
                <button
                  key={langName}
                  onClick={() => setLang(targetLang)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    background: active ? c.blue : "transparent",
                    color: active ? "#fff" : c.txt2,
                    borderColor: active ? c.blue : c.border,
                  }}
                >
                  {langName}
                </button>
              );
            })}
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
  const { t } = useLanguage();
  const [page, setPage] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const { globalNotifications, markAllNotificationsRead } = useData();
  const [tarifMensuel, setTarifMensuel] = useState("");
  const unreadCount = globalNotifications.filter(n => !n.read).length;

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

  // ── Chat state ──
  const [activeChatConv, setActiveChatConv] = useState(null);
  const { unreadChatCount, setUnreadChatCount } = useData();

  const NAV = [
    { id: "dashboard", label: t('nav_home') || "Accueil" },
    { id: "jobRequests", label: t('nav_missions') || "Offres & Missions" },
    { id: "myPatients", label: t('nav_patients') || "Mes Patients" },
    { id: "treatments", label: t('nav_treatments') || "Traitements" },
    { id: "ai-diagnosis", label: t('nav_ai_diagnosis') || "IA Diagnostic" },
  ];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <HomeView onChangePage={setPage} dk={dk} c={c} setEmergency={setEmergency} />;
      case "emergencies": return <EmergenciesView dk={dk} c={c} />;
      case "jobRequests": return <JobRequestsView dk={dk} c={c} />;
      case "myPatients": return <MyPatientsView onChangePage={setPage} dk={dk} c={c} />;
      case "treatments": return <TreatmentsView dk={dk} c={c} />;
      case "ai-diagnosis": return <AIDiagnosisPage dk={dk} setPage={setPage} />;
      case "settings": return <SettingsView onTarifSaved={setTarifMensuel} dk={dk} c={c} user={user} />;
      case "messages":
        return (
          <div className="flex gap-5" style={{ height: "calc(100vh - 120px)", minHeight: 500 }}>
            {/* ConversationList — 30% */}
            <div
              className="rounded-2xl border overflow-hidden shrink-0 flex flex-col"
              style={{ width: "30%", minWidth: 260, background: c.card, borderColor: c.border }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0" style={{ borderColor: c.border }}>
                <MessageSquare size={15} style={{ color: c.blue }} />
                <h2 className="font-bold text-sm" style={{ color: c.txt }}>{t('messages_title') || "Messages"}</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <ConversationList
                  open={true}
                  onClose={() => {}}
                  onSelectConv={(conv) => setActiveChatConv(conv)}
                  isPatient={false}
                  onUnreadChange={(n) => setUnreadChatCount(n)}
                  c={c}
                  dk={dk}
                  inline={true}
                />
              </div>
            </div>
            {/* ChatWindow — 70% */}
            <div className="flex-1 min-w-0">
              {activeChatConv ? (
                <ChatWindow
                  conv={activeChatConv}
                  onClose={() => setActiveChatConv(null)}
                  onBack={null}
                  c={c}
                  dk={dk}
                  embedded={true}
                />
              ) : (
                <div
                  className="h-full rounded-2xl border flex flex-col items-center justify-center gap-4"
                  style={{ background: c.card, borderColor: c.border }}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: c.blueLight }}>
                    <MessageSquare size={28} style={{ color: c.blue }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: c.txt3 }}>
                    {t('select_conversation') || "Sélectionnez une conversation"}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      default: return <HomeView onChangePage={setPage} dk={dk} c={c} setEmergency={setEmergency} />;
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: c.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: c.txt,
        transition: "background 0.3s, color 0.2s",
      }}
    >
      <ParticlesHero darkMode={dk} />
      <div className="relative z-10">
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
            {/* Bouton Messages Icon */}
            <button
              onClick={() => setPage("messages")}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-blue-50 dark:hover:bg-white/5 border"
              style={{ 
                borderColor: page === "messages" ? c.blue + "44" : c.border, 
                background: page === "messages" ? c.blue + "11" : "transparent" 
              }}
              title={t('messages') || "Messages"}
            >
              <MessageSquare size={18} style={{ color: page === "messages" ? c.blue : c.txt2 }} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: c.red, fontSize: 9 }}>
                  {unreadChatCount > 9 ? "9+" : unreadChatCount}
                </span>
              )}
            </button>
            <div className="relative">
              {/* Point rouge notifications */}
              {unreadCount > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 z-10 flex items-center justify-center"
                  style={{ background: c.red, borderColor: c.nav, fontSize: 7, color: "#fff", fontWeight: 800, pointerEvents: "none" }}
                >
                  {unreadCount}
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
                        {tarifMensuel && (
                          <p className="text-xs font-bold mt-0.5" style={{ color: c.green }}>
                            Tarif mensuel : {Number(tarifMensuel).toLocaleString("fr-DZ")} DA
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1 group">
                    {/* Notifications */}
                    <button
                      onClick={() => { markAllNotificationsRead(); setPage("emergencies"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer"
                    >
                      <Bell size={16} className="hover:rotate-45 transition-transform" />
                      {t('notifications_label') || "Notifications"}
                      {unreadCount > 0 && (
                        <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: c.red, color: "#fff" }}>{unreadCount}</span>
                      )}
                    </button>

                    {/* Paramètres */}
                    <button
                      onClick={() => { setPage("settings"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer"
                    >
                      <Settings size={16} className="hover:rotate-45 transition-transform" />
                      {t('settings_label') || "Paramètres"}
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
                      {t('logout_label') || "Déconnexion"}
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
      <main className={`w-full ${page === "ai-diagnosis" ? "px-0 py-0" : "px-6 py-6"}`}><ErrorBoundary>{renderPage()}</ErrorBoundary></main>

      {profileOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
      )}
    </div>
    </div>
  );
}
