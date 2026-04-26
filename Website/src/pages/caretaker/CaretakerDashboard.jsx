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
  Link as LinkIcon, Brain, Send, MessageSquare
} from "lucide-react";
import { T } from "../_shared/theme";

// ─── Reusable Card Component ──────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk, empty = false }) {
  const c = dk ? T.dark : T.light;
  const hoverClasses = empty
    ? ""
    : "transition-transform duration-200 hover:scale-[1.02]";
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
const HISTORY_SESSIONS = [
  { id: 1, title: "Soins post-opératoires — Alex", date: "Aujourd'hui · 2h", badge: "med", badgeLabel: "Modérée" },
  { id: 2, title: "Suivi diabète — Youcef", date: "Hier · 5 échanges", badge: "low", badgeLabel: "Faible" },
  { id: 3, title: "Urgence hypertension — Nadia", date: "Hier · 4 échanges", badge: "high", badgeLabel: "Élevée" },
  { id: 4, title: "Consultation gériatrique", date: "18 Mar · 3 échanges", badge: "low", badgeLabel: "Faible" },
  { id: 5, title: "Douleur thoracique — Patient 2", date: "16 Mar · 4 échanges", badge: "high", badgeLabel: "Élevée" },
];
const BADGE_COLORS = { low: "#2D8C6F", med: "#E8A838", high: "#E05555" };

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
    { name: "Dr. Benali Karim", role: "Primary physician", initials: "BK", color: c.green },
    { name: "SAMU 15", role: "Medical emergency", initials: "15", color: c.red },
    { name: "Alex's Family", role: "+213 555 890 123", initials: "FJ", color: c.blue },
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
                <div key={i} className="flex items-start gap-3 group cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
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
                <div key={i} className="p-3 rounded-xl border cursor-pointer transition-transform duration-200 hover:scale-[1.02]" style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
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
function AIDiagnosisPage({ dk, c }) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: t('ai_intro_msg_caretaker') || "Bonjour 👋 Décrivez les symptômes de votre patient en détail — localisation, intensité, durée — et je vous fournirai une analyse clinique immédiate avec des recommandations de soins adaptées.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickSymptoms = [
    "Glycémie élevée",
    "Douleur thoracique",
    "Hypertension",
    "Fièvre",
    "Prise de médicaments",
    "Chute",
  ];

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg && attachedFiles.length === 0) return;
    const displayText = msg || `📎 ${attachedFiles.length} fichier(s) joint(s)`;
    setMessages((m) => [...m, { role: "user", text: displayText, files: attachedFiles }]);
    setInput("");
    setAttachedFiles([]);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages((m) => [...m, {
        role: "ai",
        text: "Analyse en cours…",
        result: {
          urgency: "Urgence modérée",
          color: "#E8A838",
          diagnosis: "Possible déséquilibre glycémique",
          confidence: 83,
          body: "Les symptômes décrits suggèrent une instabilité glycémique. Vérifiez la glycémie capillaire immédiatement et ajustez la dose de Metformin si nécessaire. Contactez le médecin traitant si la valeur dépasse 11 mmol/L.",
          tags: ["Vérifier glycémie", "Contacter médecin", "Hydratation accrue"],
        },
      }]);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
    e.target.value = "";
  };

  const toggleRecording = () => {
    setIsRecording((r) => !r);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput("Le patient présente une glycémie à 9.8 et des tremblements depuis ce matin");
      }, 2000);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-end justify-end w-full gap-2">
        <button
          onClick={() => setShowFullHistory(true)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all hover:opacity-80"
          style={{ color: showFullHistory ? "#fff" : c.blue, borderColor: c.blue, background: showFullHistory ? c.blue : c.card }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Voir tout l'historique
        </button>
        <button
          onClick={() => setMessages([{ role: "ai", text: "Nouvelle session. Décrivez les symptômes du patient." }])}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all hover:opacity-80"
          style={{ color: c.blue, borderColor: c.border, background: c.card }}>
          <Plus size={14} /> Nouvelle session
        </button>
      </div>

      {/* Historique Sidebar */}
      {showFullHistory && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowFullHistory(false)} />
          <div className="fixed top-0 left-0 w-[280px] h-full z-50 flex flex-col shadow-2xl"
            style={{ background: c.card, borderRight: `1px solid ${c.border}`, animation: "slideInLeft 0.3s ease forwards" }}>
            <style>{`@keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
            <div className="px-4 py-4 flex items-center justify-between border-b" style={{ borderColor: c.border }}>
              <p className="font-bold" style={{ color: c.txt }}>Historique</p>
              <button onClick={() => setShowFullHistory(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:opacity-70"
                style={{ color: c.txt3, background: c.bg }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {HISTORY_SESSIONS.map((s) => (
                <button key={s.id}
                  onClick={() => { setShowFullHistory(false); setMessages([{ role: "ai", text: `Session chargée : "${s.title}"` }]); }}
                  className="w-full flex items-center gap-3 px-4 py-4 border-b text-left hover:opacity-80"
                  style={{ borderColor: c.border, background: "transparent" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: BADGE_COLORS[s.badge] + "18" }}>
                    <Brain size={16} style={{ color: BADGE_COLORS[s.badge] }} />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-semibold truncate" style={{ color: c.txt }}>{s.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>{s.date}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ color: BADGE_COLORS[s.badge], background: BADGE_COLORS[s.badge] + "18" }}>
                    {s.badgeLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col gap-4" style={{ marginTop: "-60px" }}>
          <Card dk={dk} empty={true} style={{ padding: 0, overflow: "hidden" }}>
            {/* Messages */}
            <div className="p-4 space-y-4 overflow-y-auto" style={{ minHeight: 450, maxHeight: 600 }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: m.role === "ai" ? "linear-gradient(135deg, #4A6FA5, #304B71)" : "linear-gradient(135deg, #2D8C6F, #3aaa88)" }}>
                    {m.role === "ai" ? "AI" : "GM"}
                  </div>
                  <div className="max-w-[80%]">
                    <div className="rounded-2xl p-3.5 text-sm"
                      style={{
                        background: m.role === "ai" ? c.card : c.blue,
                        color: m.role === "ai" ? c.txt : "#fff",
                        border: m.role === "ai" ? `1px solid ${c.border}` : "none",
                        borderRadius: m.role === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                      }}>
                      {m.text}
                      {m.result && (
                        <div className="mt-3 rounded-xl p-3 border"
                          style={{ background: dk ? "rgba(255,255,255,0.05)" : "#F8FAFC", borderColor: c.border }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>Analyse IA</span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                              style={{ background: m.result.color + "18", color: m.result.color }}>{m.result.urgency}</span>
                          </div>
                          <p className="font-bold text-sm mb-1" style={{ color: c.txt }}>{m.result.diagnosis}</p>
                          <p className="text-xs mb-2" style={{ color: c.txt2 }}>{m.result.body}</p>
                          <div className="flex flex-wrap gap-1">
                            {m.result.tags.map((t) => (
                              <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: c.blueLight, color: c.blue }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #4A6FA5, #304B71)" }}>AI</div>
                  <div className="rounded-2xl p-3.5 flex items-center gap-1.5"
                    style={{ background: c.card, border: `1px solid ${c.border}` }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: c.txt3, animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t" style={{ borderColor: c.border }}>
              <div className="flex gap-2 flex-wrap mb-3">
                {quickSymptoms.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:opacity-80"
                    style={{ background: c.blueLight, color: c.blue, borderColor: c.blue + "40" }}>
                    {s}
                  </button>
                ))}
              </div>
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border"
                      style={{ background: c.blueLight, borderColor: c.border, color: c.txt }}>
                      <FileText size={11} style={{ color: c.blue }} />
                      {f.length > 20 ? f.slice(0, 18) + "…" : f}
                      <button onClick={() => setAttachedFiles((fs) => fs.filter((_, j) => j !== i))}
                        className="ml-1 hover:opacity-70" style={{ color: c.txt3 }}>
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {isRecording && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl border"
                  style={{ background: "rgba(224,85,85,0.08)", borderColor: "rgba(224,85,85,0.3)" }}>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold" style={{ color: "#E05555" }}>Enregistrement en cours…</span>
                </div>
              )}
              <div className="flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{ background: c.blueLight, borderColor: c.border }}>
                <label className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:opacity-70 shrink-0"
                  style={{ borderColor: c.border, background: c.card, cursor: "pointer" }}>
                  <input type="file" multiple accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: c.txt2 }}>
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </label>
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={isRecording ? "Enregistrement…" : "Décrivez les symptômes du patient…"}
                  disabled={isRecording}
                  className="flex-1 text-sm outline-none bg-transparent" style={{ color: c.txt }} />
                <button onClick={toggleRecording}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:opacity-80 shrink-0"
                  style={{ borderColor: isRecording ? "rgba(224,85,85,0.5)" : c.border, background: isRecording ? "rgba(224,85,85,0.12)" : c.card }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color: isRecording ? "#E05555" : c.txt2 }}>
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
                <button onClick={() => send()}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80 shrink-0"
                  style={{ background: c.blue }}>
                  <Send size={14} className="text-white" />
                </button>
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: c.txt3 }}>
                ⏎ Entrée pour envoyer · 🎤 Vocal disponible · 📎 Fichiers acceptés
              </p>
            </div>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-4">
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt3 }}>Niveau d'urgence</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: "#E8A838" }}>Modérée</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: "#E8A83818", color: "#E8A838" }}>65 / 100</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
              <div className="h-full rounded-full" style={{ width: "65%", background: "#E8A838" }} />
            </div>
          </Card>
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt3 }}>Médecin traitant</p>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-3" style={{ background: c.blueLight }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: c.blueLight, border: `1px solid ${c.border}` }}>
                <User size={16} style={{ color: c.blue }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: c.txt }}>Dr. Benali Karim</p>
                <p className="text-xs" style={{ color: c.txt2 }}>À contacter sous 2h</p>
              </div>
            </div>
            <a href="tel:+21300000000"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ background: c.blue }}>
              <Phone size={14} /> Appeler le médecin
            </a>
          </Card>
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt3 }}>Conseils immédiats</p>
            <div className="space-y-2.5">
              {[
                ["💊", "Vérifier la glycémie capillaire"],
                ["🛌", "Maintenir le patient au calme"],
                ["💧", "Assurer une bonne hydratation"],
                ["📋", "Documenter les symptômes observés"],
              ].map(([e, t]) => (
                <div key={t} className="flex items-start gap-2 text-sm" style={{ color: c.txt2 }}>
                  <span>{e}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
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
                    <Plus size={12} /> Modifier
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
                    Aucun médicament — cliquez sur Modifier pour en ajouter.
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
  const [showPwd, setShowPwd] = useState(false);
  const [locSaved, setLocSaved] = useState(false);
  const [tarifSaved, setTarifSaved] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwdStatus, setPwdStatus] = useState({ type: "", msg: "" });
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  const [locForm, setLocForm] = useState({ address: "", commune: "", wilaya: "Alger", mapsUrl: "" });
  const [tarifForm, setTarifForm] = useState({ tarifSoin: "", tarifNuit: "", tarifMensuel: "" });

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
      await api.changePassword(pwdForm);
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
            <DashSelect
              label="Wilaya"
              value={locForm.wilaya}
              options={WILAYAS_LIST}
              onSelect={(w) => setLocForm((f) => ({ ...f, wilaya: w }))}
              dk={dk}
              c={c}
              placeholder="Sélectionner votre wilaya"
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

      {/* ── Tarifs de garde ── */}
      <Card dk={dk}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.green + "18" }}>
            <Shield size={18} style={{ color: c.green }} />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: c.txt }}>Tarifs de garde</p>
            <p className="text-xs" style={{ color: c.txt3 }}>Définissez vos tarifs affichés aux patients</p>
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
            { key: "tarifSoin", label: "Tarif Soin Ponctuel", placeholder: "Ex: 2000", suffix: "DZD" },
            { key: "tarifNuit", label: "Tarif Garde de Nuit", placeholder: "Ex: 4000", suffix: "DZD" },
            { key: "tarifMensuel", label: "Tarif Mensuel (optionnel)", placeholder: "Ex: 45000", suffix: "DZD" },
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
          <Shield size={15} /> Enregistrer les tarifs
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
    { id: "dashboard", label: "Accueil" },
    { id: "jobRequests", label: "Offres & Missions" },
    { id: "myPatients", label: "Mes Patients" },
    { id: "treatments", label: "Traitements" },
    { id: "ai-diagnosis", label: "IA Diagnostic" },
    { id: "messages", label: "Messages" },
  ];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <HomeView onChangePage={setPage} dk={dk} c={c} setEmergency={setEmergency} />;
      case "emergencies": return <EmergenciesView dk={dk} c={c} />;
      case "jobRequests": return <JobRequestsView dk={dk} c={c} />;
      case "myPatients": return <MyPatientsView onChangePage={setPage} dk={dk} c={c} />;
      case "treatments": return <TreatmentsView dk={dk} c={c} />;
      case "ai-diagnosis": return <AIDiagnosisPage dk={dk} c={c} />;
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
                <h2 className="font-bold text-sm" style={{ color: c.txt }}>Messages</h2>
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
                    Sélectionnez une conversation
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
                {item.id === "messages" && unreadChatCount > 0 && (
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: page === item.id ? "rgba(255,255,255,0.35)" : c.red, fontSize: 9 }}>
                    {unreadChatCount > 9 ? "9+" : unreadChatCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Droite — profil + menu mobile */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
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
                      Notifications
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
      <main className="w-full px-6 py-6"><ErrorBoundary>{renderPage()}</ErrorBoundary></main>

      {profileOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
      )}
    </div>
    </div>
  );
}
