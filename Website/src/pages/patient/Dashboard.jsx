import { useState } from "react";
import {
  LayoutDashboard, User, Brain, Calendar, FileText,
  ShoppingBag, Heart, Bell, Settings, ChevronRight,
  Search, AlertTriangle, CheckCircle, Circle, Shield,
  LogOut, Menu, ChevronDown, Star, Activity, Phone,
  FileSearch, X, Sun, Moon, MapPin, Clock, Pill,
  TrendingUp, Filter, QrCode, Download, Send,
  Plus, Check, AlertCircle, Package, Zap, Eye, EyeOff
} from "lucide-react";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  light: {
    bg: "#F0F4F8", card: "#ffffff", nav: "#ffffff",
    border: "#E4EAF5", txt: "#0D1B2E", txt2: "#5A6E8A", txt3: "#9AACBE",
    blue: "#4A6FA5", blueLight: "#EEF3FB", green: "#2D8C6F", amber: "#E8A838", red: "#E05555",
    navHover: "#EEF3FB",
  },
  dark: {
    bg: "#0D1117", card: "#141B27", nav: "#141B27",
    border: "rgba(99,142,203,0.15)", txt: "#F0F3FA", txt2: "#8AAEE0", txt3: "#4A6080",
    blue: "#638ECB", blueLight: "#1A2333", green: "#4CAF82", amber: "#F0A500", red: "#E05555",
    navHover: "#1A2333",
  }
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const APPOINTMENTS = [
  { id: 1, name: "Dr. Sarah Smith",  role: "Cardiologist",  date: "Oct 24, 10:30 AM", initials: "SS", color: "#4A6FA5" },
  { id: 2, name: "Dr. Michael Chen", role: "Dermatologist", date: "Nov 02, 2:15 PM",  initials: "MC", color: "#2D8C6F" },
];
const MEDICATIONS = [
  { id: 1, name: "Lisinopril (10mg)",    time: "8:00 AM · 1 Tablet",  taken: true  },
  { id: 2, name: "Vitamin D3 (2000 IU)", time: "1:00 PM · 1 Capsule", taken: false },
  { id: 3, name: "Metformin (500mg)",    time: "8:00 PM · 1 Tablet",  taken: false },
];
const NOTIFICATIONS_DATA = [
  { id: 1, icon: Calendar,   color: "#4A6FA5", bg: "#EEF3FB",  bgDark: "#1A2333", title: "Appointment Confirmed", sub: "Dr. Benali — 5 min ago",       unread: true  },
  { id: 2, icon: Heart,      color: "#2D8C6F", bg: "#EEF8F4",  bgDark: "#1A2D28", title: "Medication Reminder",   sub: "Take Metformin — 1 hour ago",   unread: true  },
  { id: 3, icon: FileSearch, color: "#888",    bg: "#F5F5F5",  bgDark: "#1A1A1A", title: "Analysis Ready",        sub: "Lipid Profile — Yesterday",      unread: false },
  { id: 4, icon: AlertCircle,color: "#E8A838", bg: "#FFF8EC",  bgDark: "#1A1508", title: "Prescription Expiring", sub: "Metformin expires in 5 days",   unread: true  },
  { id: 5, icon: Check,      color: "#2D8C6F", bg: "#EEF8F4",  bgDark: "#1A2D28", title: "Caregiver Update",      sub: "Fatima B. completed medication", unread: false },
];
const PRESCRIPTIONS = [
  { id: 1, name: "Lisinopril Refill", status: "READY",      color: "#2D8C6F", pct: 100, note: "Pick up at: CVS Pharmacy, 5th Ave" },
  { id: 2, name: "New Antibiotic",    status: "PROCESSING", color: "#E8A838", pct: 55,  note: "Est. Time: Tomorrow, 2 PM" },
];
const DOCUMENTS = [
  { id: 1, name: "Complete Blood Count", date: "Oct 18" },
  { id: 2, name: "Chest X-Ray Report",   date: "Oct 10" },
  { id: 3, name: "ECG Analysis",         date: "Sep 28" },
];
const PHARMACY_ITEMS = [
  { id: 1, name: "Lisinopril 10mg",    molecule: "Lisinopril Dihydrate",    price: "320 DZD", stock: "In Stock",    cnas: true,  qty: 1 },
  { id: 2, name: "Metformin 500mg",    molecule: "Metformin HCl",           price: "180 DZD", stock: "In Stock",    cnas: true,  qty: 2 },
  { id: 3, name: "Vitamin D3 2000IU",  molecule: "Cholecalciferol",         price: "450 DZD", stock: "In Stock",    cnas: false, qty: 0 },
  { id: 4, name: "Aspirin 100mg",      molecule: "Acetylsalicylic Acid",    price: "90 DZD",  stock: "In Stock",    cnas: false, qty: 0 },
  { id: 5, name: "Amoxicillin 500mg",  molecule: "Amoxicillin Trihydrate",  price: "240 DZD", stock: "Out of Stock", cnas: true, qty: 0 },
  { id: 6, name: "Omeprazole 20mg",    molecule: "Omeprazole",              price: "280 DZD", stock: "In Stock",    cnas: true,  qty: 0 },
];
const CARETAKERS = [
  { id: 1, name: "Ahmed Meziane",     role: "Professional Caregiver", exp: "5 yrs", rating: 4.6, price: "1200 DZD/day", tags: ["Diabetes","Hypertension"],    initials: "AM", color: "#2D8C6F" },
  { id: 2, name: "Nadia Boumediene",  role: "Nursing Assistant",      exp: "8 yrs", rating: 5.0, price: "1500 DZD/day", tags: ["Elderly Care","Post-surgery"], initials: "NB", color: "#7B5EA7" },
];

// ─── Card component ───────────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk }) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm border ${className}`}
      style={{ background: dk ? T.dark.card : T.light.card, borderColor: dk ? T.dark.border : T.light.border, ...style }}>
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ color, bg, children }) {
  return <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border" style={{ color, background: bg, borderColor: color + "44" }}>{children}</span>;
}

// ─── Emergency Modal ──────────────────────────────────────────────────────────
function EmergencyModal({ onClose, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl p-8 w-full max-w-md shadow-2xl border-2" style={{ background: c.card, borderColor: "#E05555" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(224,85,85,0.15)" }}>
              <AlertTriangle size={22} style={{ color: "#E05555" }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: c.txt }}>Emergency Alert</h3>
              <p className="text-xs" style={{ color: c.txt2 }}>Contacts will be notified immediately</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
            <X size={18} style={{ color: c.txt3 }} />
          </button>
        </div>
        <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.2)" }}>
          <p className="text-sm" style={{ color: c.txt2 }}>
            This will alert <strong style={{ color: c.txt }}>your emergency contacts</strong> and share your GPS location with nearby medical services.
          </p>
        </div>
        <div className="space-y-3 mb-4">
          <button className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: "#E05555", boxShadow: "0 4px 20px rgba(224,85,85,0.4)" }}>
            <Phone size={16} /> Call 15 (SAMU) Now
          </button>
          <button className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors" style={{ background: "rgba(224,85,85,0.1)", color: "#E05555", border: "1px solid rgba(224,85,85,0.2)" }}>
            <MapPin size={15} /> Share My Location
          </button>
          <button className="w-full py-3 rounded-xl font-semibold transition-colors" style={{ background: "rgba(224,85,85,0.06)", color: "#E05555", border: "1px solid rgba(224,85,85,0.15)" }}>
            Notify Emergency Contact
          </button>
        </div>
        <button onClick={onClose} className="w-full py-2.5 text-sm font-medium rounded-xl transition-colors" style={{ color: c.txt3, background: "transparent", border: `1px solid ${c.border}` }}>
          Cancel — I'm fine
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ onNav, dk }) {
  const [meds, setMeds] = useState(MEDICATIONS);
  const [symptom, setSymptom] = useState("");
  const [emergency, setEmergency] = useState(false);
  const c = dk ? T.dark : T.light;

  return (
    <>
      {emergency && <EmergencyModal onClose={() => setEmergency(false)} dk={dk} />}

      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>
            Welcome back, <span style={{ color: c.blue }}>Alex</span>
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Here's your health summary for today, October 24.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 shadow-sm border" style={{ background: c.card, borderColor: c.border }}>
            <Search size={15} style={{ color: c.txt3 }} />
            <input placeholder="Search records..." className="outline-none text-sm w-44 bg-transparent" style={{ color: c.txt }} />
          </div>
          <button
            onClick={() => setEmergency(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #E05555, #c93535)", color: "#fff", boxShadow: "0 4px 16px rgba(224,85,85,0.45)" }}
          >
            <Star size={13} fill="white" strokeWidth={0} />
            EMERGENCY ALERT
          </button>
        </div>
      </div>

      {/* AI Checker */}
      <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #304B71 0%, #6492C9 100%)" }}>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full opacity-10 bg-white pointer-events-none" />
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-8 bg-white pointer-events-none" />
        <div className="flex items-center gap-2 mb-1 relative z-10">
          <div className="w-5 h-5 rounded-full border-2 border-white/70 flex items-center justify-center">
            <Activity size={10} className="text-white" />
          </div>
          <h2 className="text-white font-semibold text-base">AI Symptom Checker</h2>
        </div>
        <p className="text-white/75 text-sm mb-4 relative z-10">Feeling unwell? Describe your symptoms and get instant AI-guided advice from our medical knowledge base.</p>
        <div className="flex gap-3 relative z-10">
          <input value={symptom} onChange={e => setSymptom(e.target.value)}
            placeholder="e.g. Mild headache and fatigue..."
            className="flex-1 px-4 py-3 rounded-xl outline-none text-sm"
            style={{ background: "rgba(255,255,255,0.92)", color: "#0D1B2E" }}
          />
          <button onClick={() => onNav("ai-diagnosis")}
            className="px-7 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg"
            style={{ background: "#ffffff", color: "#304B71" }}>
            Analyze
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Appointments */}
            <Card dk={dk}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: c.txt }}>Appointments</h3>
                <button onClick={() => onNav("appointments")} className="text-sm font-semibold hover:underline" style={{ color: c.blue }}>View All</button>
              </div>
              <div className="space-y-3">
                {APPOINTMENTS.map(a => (
                  <div key={a.id} onClick={() => onNav("appointments")}
                    className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:opacity-80"
                    style={{ borderColor: c.border }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: a.color }}>{a.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: c.txt }}>{a.name}</p>
                      <p className="text-xs" style={{ color: c.txt2 }}>{a.role}</p>
                      <p className="text-xs font-semibold" style={{ color: c.blue }}>{a.date}</p>
                    </div>
                    <ChevronRight size={15} style={{ color: c.txt3 }} />
                  </div>
                ))}
              </div>
            </Card>
            {/* Medications */}
            <Card dk={dk}>
              <h3 className="font-semibold mb-4" style={{ color: c.txt }}>Medication Reminders</h3>
              <div className="space-y-4">
                {meds.map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <button onClick={() => setMeds(ms => ms.map(x => x.id === m.id ? { ...x, taken: !x.taken } : x))} className="shrink-0">
                      {m.taken ? <CheckCircle size={22} style={{ color: c.green }} /> : <Circle size={22} style={{ color: c.txt3 }} />}
                    </button>
                    <div>
                      <p className="text-sm font-medium" style={{ color: m.taken ? c.txt3 : c.txt, textDecoration: m.taken ? "line-through" : "none" }}>{m.name}</p>
                      <p className="text-xs" style={{ color: c.txt3 }}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Documents */}
            <Card dk={dk}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: c.txt }}>Recent Medical Documents</h3>
                <button onClick={() => onNav("medical-profile")} className="text-sm font-semibold hover:underline" style={{ color: c.blue }}>View All</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                    <th className="text-left text-xs font-bold uppercase pb-2 tracking-wide" style={{ color: c.txt3 }}>Document Name</th>
                    <th className="text-right text-xs font-bold uppercase pb-2 tracking-wide" style={{ color: c.txt3 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {DOCUMENTS.map(d => (
                    <tr key={d.id} className="cursor-pointer hover:opacity-70 transition-opacity" style={{ borderBottom: `1px solid ${c.border}` }}>
                      <td className="py-3 text-sm" style={{ color: c.txt }}>{d.name}</td>
                      <td className="py-3 text-sm text-right" style={{ color: c.txt2 }}>{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            {/* Caregiver + AI */}
            <div className="flex flex-col gap-4">
              <div onClick={() => onNav("care-taker")} className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity flex-1" style={{ background: "linear-gradient(135deg, #2D8C6F, #3aaa88)" }}>
                <Heart size={26} className="text-white shrink-0" />
                <div><p className="text-white font-semibold">Caregiver</p><p className="text-white/80 text-sm">Fatima B. is assigned to you</p></div>
              </div>
              <div onClick={() => onNav("ai-diagnosis")} className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity flex-1" style={{ background: "linear-gradient(135deg, #304B71, #4A6FA5)" }}>
                <Star size={26} className="text-white shrink-0" />
                <div><p className="text-white font-semibold">AI Suggestion</p><p className="text-white/80 text-sm">New health tip available</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-5">
          <Card dk={dk}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: c.txt }}>Notifications</h3>
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">3</span>
            </div>
            <div className="space-y-3">
              {NOTIFICATIONS_DATA.slice(0,3).map(n => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: dk ? n.bgDark : n.bg }}>
                  <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: n.color }} />
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: n.color + "22" }}>
                    <n.icon size={14} style={{ color: n.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: c.txt }}>{n.title}</p>
                    <p className="text-xs" style={{ color: c.txt3 }}>{n.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card dk={dk}>
            <h3 className="font-semibold mb-5" style={{ color: c.txt }}>Prescription Status</h3>
            <div className="space-y-5">
              {PRESCRIPTIONS.map(p => (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold" style={{ color: c.txt }}>{p.name}</p>
                    <Badge color={p.color} bg={p.color + "18"}>{p.status}</Badge>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: c.txt3 }}>{p.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── MEDICAL PROFILE PAGE ─────────────────────────────────────────────────────
function MedicalProfilePage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [tab, setTab] = useState("antecedents");
  const tabs = ["antecedents", "diagnostics", "prescriptions", "analyses", "treatments"];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>Medical Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Your complete health record</p>
      </div>
      {/* Profile header */}
      <div className="rounded-2xl p-6 mb-6 flex items-start gap-5 flex-wrap border" style={{ background: c.blueLight, borderColor: c.border }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: "linear-gradient(135deg, #4A6FA5, #304B71)" }}>AJ</div>
        <div className="flex-1">
          <h2 className="text-xl font-bold" style={{ color: c.txt }}>Alex Johnson</h2>
          <p className="text-sm mt-1 mb-3" style={{ color: c.txt2 }}>DOB: March 14, 1988 · Male · Alger, Algeria</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(224,85,85,0.12)", color: "#E05555", border: "1px solid rgba(224,85,85,0.25)" }}>Blood Type: A+</span>
            {["Penicillin", "Pollen"].map(a => <span key={a} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(224,85,85,0.1)", color: "#E05555", border: "1px solid rgba(224,85,85,0.2)" }}>⚠ {a}</span>)}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Family", "Verified Doctors", "Private"].map((opt, i) => (
              <button key={opt} className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{ background: i === 0 ? c.blue : "transparent", color: i === 0 ? "#fff" : c.txt2, borderColor: i === 0 ? c.blue : c.border }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <button className="text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:opacity-80" style={{ color: c.blue, borderColor: c.blue, background: c.blueLight }}>
          Edit Profile
        </button>
      </div>
      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6" style={{ borderColor: c.border }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm font-semibold capitalize transition-all"
            style={{ color: tab === t ? c.blue : c.txt2, borderBottom: tab === t ? `2px solid ${c.blue}` : "2px solid transparent", marginBottom: -1 }}>
            {t}
          </button>
        ))}
      </div>
      {/* Tab content */}
      {tab === "antecedents" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "🫀", name: "Hypertension",    year: 2018, type: "Chronic",  color: "#E8A838" },
            { icon: "🩸", name: "Type 2 Diabetes", year: 2020, type: "Chronic",  color: "#E8A838" },
            { icon: "🦴", name: "Lower Back Strain",year: 2022, type: "Resolved", color: "#2D8C6F" },
          ].map(item => (
            <Card key={item.name} dk={dk}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="font-bold text-sm mb-1" style={{ color: c.txt }}>{item.name}</p>
              <p className="text-xs mb-3" style={{ color: c.txt2 }}>Diagnosed {item.year}</p>
              <Badge color={item.color} bg={item.color + "18"}>{item.type}</Badge>
            </Card>
          ))}
        </div>
      )}
      {tab === "analyses" && (
        <div className="space-y-4">
          {[
            { name: "Complete Blood Count (CBC)", lab: "Center Pasteur", date: "Oct 18, 2023", note: "Hemoglobin slightly below normal. Consider iron-rich foods. Follow-up in 3 months recommended." },
            { name: "Lipid Profile", lab: "City Diagnostics", date: "Oct 12, 2023", note: "LDL elevated at 142 mg/dL. Reduce saturated fats, exercise 30min/day, consider statin therapy." },
          ].map(item => (
            <Card key={item.name} dk={dk}>
              <div className="flex items-center justify-between mb-4">
                <div><p className="font-bold" style={{ color: c.txt }}>{item.name}</p><p className="text-xs mt-1" style={{ color: c.txt2 }}>Lab: {item.lab} · {item.date}</p></div>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80" style={{ color: c.blue, borderColor: c.border }}>View Report</button>
              </div>
              <div className="flex items-end gap-1 h-16 mb-3">
                {[55,70,60,80,65,75,85,60,70,80].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: c.blue, opacity: 0.6 }} />
                ))}
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: c.blueLight, borderLeft: `3px solid ${c.blue}` }}>
                <Activity size={14} style={{ color: c.blue, marginTop: 2, flexShrink: 0 }} />
                <p className="text-xs" style={{ color: c.txt2 }}>{item.note}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {["diagnostics", "prescriptions", "treatments"].includes(tab) && (
        <Card dk={dk} className="text-center" style={{ padding: 48 }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: c.blueLight }}>
            <FileText size={28} style={{ color: c.blue }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: c.txt }}>No {tab} yet</p>
          <p className="text-sm" style={{ color: c.txt2 }}>Records will appear here after consultations.</p>
        </Card>
      )}
    </>
  );
}

// ─── AI DIAGNOSIS PAGE ────────────────────────────────────────────────────────
function AIDiagnosisPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Bonjour Alex 👋 Décrivez vos symptômes en détail — localisation, intensité, durée — et je vous fournirai une analyse immédiate avec des recommandations adaptées." }
  ]);
  const [loading, setLoading] = useState(false);

  const quickSymptoms = ["Maux de tête", "Fièvre", "Fatigue", "Douleur thoracique", "Nausées", "Toux"];

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(m => [...m, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages(m => [...m, {
        role: "ai",
        text: "J'analyse vos symptômes…",
        result: {
          urgency: "Urgence modérée", color: "#E8A838",
          diagnosis: "Possible Angine de Poitrine",
          confidence: 87,
          body: "La combinaison douleurs thoraciques + fatigue à l'effort peut indiquer une réduction du flux sanguin cardiaque. Une consultation médicale dans les 24–48h est fortement recommandée.",
          tags: ["Consultation sous 24h", "Éviter les efforts", "ECG recommandé"],
        }
      }]);
    }, 1500);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold" style={{ color: c.txt }}>AI Diagnosis</h1><p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Powered by MedSmart IA v2.1</p></div>
        <button onClick={() => setMessages([{ role: "ai", text: "Nouvelle session. Décrivez vos symptômes." }])}
          className="text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:opacity-80"
          style={{ color: c.blue, borderColor: c.border, background: c.card }}>
          + New Chat
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card dk={dk} style={{ padding: 0, overflow: "hidden" }}>
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: c.border }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4A6FA5, #304B71)" }}>
                <Brain size={17} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: c.txt }}>MedSmart IA — Diagnostic</p>
                <p className="text-xs flex items-center gap-1.5" style={{ color: "#2D8C6F" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />En ligne · Analyse activée
                </p>
              </div>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto" style={{ minHeight: 300, maxHeight: 400 }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: m.role === "ai" ? "linear-gradient(135deg, #4A6FA5, #304B71)" : "linear-gradient(135deg, #2D8C6F, #3aaa88)" }}>
                    {m.role === "ai" ? "AI" : "AJ"}
                  </div>
                  <div className="max-w-[80%]">
                    <div className="rounded-2xl p-3.5 text-sm" style={{
                      background: m.role === "ai" ? c.card : c.blue,
                      color: m.role === "ai" ? c.txt : "#fff",
                      border: m.role === "ai" ? `1px solid ${c.border}` : "none",
                      borderRadius: m.role === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px"
                    }}>
                      {m.text}
                      {m.result && (
                        <div className="mt-3 rounded-xl p-3 border" style={{ background: dk ? "rgba(255,255,255,0.05)" : "#F8FAFC", borderColor: c.border }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>Analyse IA</span>
                            <Badge color={m.result.color} bg={m.result.color + "18"}>{m.result.urgency}</Badge>
                          </div>
                          <p className="font-bold text-sm mb-1" style={{ color: c.txt }}>{m.result.diagnosis}</p>
                          <p className="text-xs mb-2" style={{ color: c.txt2 }}>{m.result.body}</p>
                          <div className="flex flex-wrap gap-1">
                            {m.result.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: c.blueLight, color: c.blue }}>{t}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #4A6FA5, #304B71)" }}>AI</div>
                  <div className="rounded-2xl p-3.5 flex items-center gap-1" style={{ background: c.card, border: `1px solid ${c.border}` }}>
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: c.txt3, animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t" style={{ borderColor: c.border }}>
              <div className="flex gap-2 flex-wrap mb-3">
                {quickSymptoms.map(s => (
                  <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:opacity-80"
                    style={{ background: c.blueLight, color: c.blue, borderColor: c.blue + "40" }}>{s}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Décrivez vos symptômes en détail…"
                  className="flex-1 rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{ background: c.blueLight, borderColor: c.border, color: c.txt }} />
                <button onClick={() => send()} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: c.blue }}>
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </div>
          </Card>
        </div>
        {/* Panel */}
        <div className="space-y-4">
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt3 }}>Niveau d'urgence</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: "#E8A838" }}>Modérée</span>
              <Badge color="#E8A838" bg="#E8A83818">65 / 100</Badge>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
              <div className="h-full rounded-full" style={{ width: "65%", background: "#E8A838" }} />
            </div>
          </Card>
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt3 }}>Spécialiste recommandé</p>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-3" style={{ background: c.blueLight }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: c.blueLight, border: `1px solid ${c.border}` }}>
                <User size={16} style={{ color: c.blue }} />
              </div>
              <div><p className="text-sm font-bold" style={{ color: c.txt }}>Cardiologue</p><p className="text-xs" style={{ color: c.txt2 }}>Sous 24–48 heures</p></div>
            </div>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90" style={{ background: c.blue }}>
              Prendre rendez-vous
            </button>
          </Card>
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt3 }}>Conseils immédiats</p>
            <div className="space-y-2.5">
              {[["💊","Paracétamol 1g max toutes 6h"],["🛌","Repos strict"],["💧","Hydratation 1.5L/jour"],["🧂","Réduire sel et caféine"]].map(([e,t]) => (
                <div key={t} className="flex items-start gap-2 text-sm" style={{ color: c.txt2 }}>
                  <span>{e}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── APPOINTMENTS PAGE ────────────────────────────────────────────────────────
function AppointmentsPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const doctors = [
    { name: "Dr. Sarah Smith",  spec: "Cardiologist",  loc: "Clinique El Rahma",  rating: 4.9, exp: 12, initials: "SS", color: "#4A6FA5", slots: ["10:30","11:00","11:30"] },
    { name: "Dr. Karim Benali", spec: "Cardiologist",  loc: "CHU Alger Central",  rating: 4.7, exp: 15, initials: "KB", color: "#2D8C6F", slots: ["14:00","16:30"] },
    { name: "Dr. Amira Boudali",spec: "Gynécologist",  loc: "Clinique El Azhar",  rating: 4.9, exp: 10, initials: "AB", color: "#7B5EA7", slots: ["09:00","10:00"] },
  ];
  const [selectedSlots, setSelectedSlots] = useState({});

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold" style={{ color: c.txt }}>Book Appointment</h1><p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Find the best healthcare experts</p></div>
        <button className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white" style={{ background: c.blue }}>
          <Plus size={15} /> New Appointment
        </button>
      </div>
      {/* Search bar */}
      <Card dk={dk} className="mb-5" style={{ padding: "14px 18px" }}>
        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex items-center gap-2 flex-1 min-w-48">
            <Search size={15} style={{ color: c.txt3 }} />
            <input placeholder="Search doctor, specialty or clinic…" className="outline-none text-sm bg-transparent flex-1" style={{ color: c.txt }} />
          </div>
          <select className="text-sm rounded-xl px-3 py-2 outline-none border" style={{ background: c.card, color: c.txt, borderColor: c.border }}>
            <option>Any Specialty</option><option>Cardiology</option><option>Dermatology</option><option>General</option>
          </select>
          <select className="text-sm rounded-xl px-3 py-2 outline-none border" style={{ background: c.card, color: c.txt, borderColor: c.border }}>
            <option>Any Type</option><option>In-Person</option><option>Teleconsult</option><option>Home Visit</option>
          </select>
          <button className="text-sm font-semibold px-4 py-2 rounded-xl text-white" style={{ background: c.blue }}>Search</button>
        </div>
      </Card>
      <p className="text-sm font-bold mb-4" style={{ color: c.txt2 }}>24 results found</p>
      <div className="space-y-4 mb-6">
        {doctors.map(doc => (
          <Card key={doc.name} dk={dk} style={{ padding: "18px" }}>
            <div className="flex gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base shrink-0" style={{ background: doc.color }}>{doc.initials}</div>
              <div className="flex-1 min-w-48">
                <h3 className="font-bold" style={{ color: c.txt }}>{doc.name}</h3>
                <p className="text-sm" style={{ color: c.blue }}>{doc.spec}</p>
                <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: c.txt2 }}><MapPin size={11} />{doc.loc}</p>
                <p className="text-xs mt-1" style={{ color: c.txt2 }}>⭐ {doc.rating} · {doc.exp} yrs exp.</p>
              </div>
              <div className="shrink-0">
                <p className="text-xs font-bold uppercase mb-2" style={{ color: c.txt3 }}>Today</p>
                <div className="flex gap-2 flex-wrap">
                  {doc.slots.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlots(s => ({ ...s, [doc.name]: slot }))}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                      style={{
                        background: selectedSlots[doc.name] === slot ? c.blue : c.blueLight,
                        color: selectedSlots[doc.name] === slot ? "#fff" : c.blue,
                        borderColor: c.blue + "44"
                      }}>{slot}</button>
                  ))}
                </div>
                <button className="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-80" style={{ background: c.blue }}>
                  Book Now
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* Upcoming */}
      <h2 className="font-bold text-base mb-3" style={{ color: c.txt }}>Upcoming Appointments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Dr. Sarah Chen", spec: "Dermatology", date: "Mar 15, 2026 · 10:00 AM" },
          { name: "Dr. Robert Fox",  spec: "Physiotherapy", date: "Apr 20, 2026 · 02:30 PM" },
        ].map(a => (
          <Card key={a.name} dk={dk} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.blueLight }}>
              <Calendar size={18} style={{ color: c.blue }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: c.txt }}>{a.name}</p>
              <p className="text-xs" style={{ color: c.txt2 }}>{a.spec}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: c.blue }}>📅 {a.date}</p>
            </div>
            <div className="flex gap-2 text-xs font-semibold">
              <button style={{ color: c.txt2 }}>Cancel</button>
              <button style={{ color: c.blue }}>Reschedule</button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

// ─── PRESCRIPTIONS PAGE ───────────────────────────────────────────────────────
function PrescriptionsPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const rxList = [
    { id: "RX-2023-0847", doctor: "Dr. Sarah Smith", date: "Oct 20, 2023", status: "ACTIVE",   statusColor: "#2D8C6F", meds: ["Lisinopril 10mg — 1 tablet daily","Metformin 500mg — 1 tablet twice daily"] },
    { id: "RX-2023-0791", doctor: "Dr. Benali Karim", date: "Sep 05, 2023", status: "EXPIRED", statusColor: "#E05555", meds: ["Amoxicillin 500mg — 3x daily for 7 days","Vitamin D3 2000 IU — 1 capsule daily"] },
  ];
  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold" style={{ color: c.txt }}>My Prescriptions</h1><p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Manage and scan your digital prescriptions</p></div>
      </div>
      {/* QR scan zone */}
      <Card dk={dk} className="mb-6">
        <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" style={{ borderColor: c.border }}>
          <QrCode size={40} style={{ color: c.txt3 }} />
          <p className="font-semibold" style={{ color: c.txt2 }}>Scan a Prescription QR Code</p>
          <p className="text-sm" style={{ color: c.txt3 }}>Position the QR code in front of camera · or · <span style={{ color: c.blue, fontWeight: 600 }}>Upload image</span></p>
        </div>
      </Card>
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All","Active","Expired","Pending"].map((label, i) => (
          <button key={label} className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
            style={{ background: i === 0 ? c.blue : "transparent", color: i === 0 ? "#fff" : c.txt2, borderColor: i === 0 ? c.blue : c.border }}>
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {rxList.map(rx => (
          <Card key={rx.id} dk={dk}>
            <div className="flex gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#000" }}>
                <QrCode size={36} className="text-white" />
              </div>
              <div className="flex-1 min-w-48">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <p className="font-bold" style={{ color: c.txt }}>Prescription #{rx.id}</p>
                    <p className="text-xs" style={{ color: c.txt2 }}>Issued by {rx.doctor} · {rx.date}</p>
                  </div>
                  <Badge color={rx.statusColor} bg={rx.statusColor + "18"}>{rx.status}</Badge>
                </div>
                <div className="space-y-1">
                  {rx.meds.map(m => <p key={m} className="text-sm" style={{ color: c.txt }}>• {m}</p>)}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="text-xs font-semibold px-3 py-2 rounded-lg border transition-colors hover:opacity-80" style={{ color: c.txt2, borderColor: c.border }}>⬇ PDF</button>
                <button className="text-xs font-semibold px-3 py-2 rounded-lg text-white transition-colors hover:opacity-80" style={{ background: c.blue }}>Show QR</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

// ─── PHARMACY PAGE ────────────────────────────────────────────────────────────
function PharmacyPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [cart, setCart] = useState({ 1: 1, 2: 2 });

  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const cartItems = PHARMACY_ITEMS.filter(item => (cart[item.id] || 0) > 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (parseInt(item.price) * (cart[item.id] || 0)), 0);

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold" style={{ color: c.txt }}>Connected Pharmacy</h1><p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Order medications online — CNAS & SHIFA integrated</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Medications grid */}
        <div className="lg:col-span-2">
          <Card dk={dk} className="mb-4" style={{ padding: "14px 18px" }}>
            <div className="flex items-center gap-2">
              <Search size={15} style={{ color: c.txt3 }} />
              <input placeholder="Search medication name…" className="outline-none text-sm bg-transparent flex-1" style={{ color: c.txt }} />
              <div className="flex gap-2">
                {["In Stock","Generic","CNAS"].map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full cursor-pointer border transition-colors" style={{ color: c.blue, borderColor: c.border, background: c.blueLight }}>{tag}</span>
                ))}
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {PHARMACY_ITEMS.map(item => (
              <Card key={item.id} dk={dk} style={{ padding: 16 }}>
                <p className="font-bold text-sm mb-0.5" style={{ color: c.txt }}>{item.name}</p>
                <p className="text-xs mb-3" style={{ color: c.txt2 }}>{item.molecule}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold" style={{ color: c.blue }}>{item.price}</span>
                  <div className="flex gap-1">
                    <Badge color={item.stock === "In Stock" ? c.green : c.red} bg={(item.stock === "In Stock" ? c.green : c.red) + "18"}>{item.stock}</Badge>
                    {item.cnas && <Badge color={c.blue} bg={c.blueLight}>CNAS</Badge>}
                  </div>
                </div>
                <button
                  onClick={() => item.stock === "In Stock" && addToCart(item.id)}
                  disabled={item.stock !== "In Stock"}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: item.stock === "In Stock" ? c.blue : c.border, color: item.stock === "In Stock" ? "#fff" : c.txt3, cursor: item.stock === "In Stock" ? "pointer" : "not-allowed" }}>
                  {item.stock === "In Stock" ? "Add to Cart" : "Unavailable"}
                </button>
              </Card>
            ))}
          </div>
        </div>
        {/* Cart */}
        <div className="sticky top-20">
          <Card dk={dk}>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={18} style={{ color: c.blue }} />
              <span className="font-bold" style={{ color: c.txt }}>My Cart</span>
              <Badge color={c.blue} bg={c.blueLight}>{cartItems.length} items</Badge>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: c.txt3 }}>Cart is empty</p>
            ) : (
              <>
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: c.border }}>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: c.txt }}>{item.name}</p>
                      <p className="text-xs" style={{ color: c.txt2 }}>{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCart(c => ({ ...c, [item.id]: Math.max(0, (c[item.id]||0)-1) }))} className="w-6 h-6 rounded-lg border flex items-center justify-center text-sm font-bold" style={{ borderColor: c.border, color: c.blue }}>−</button>
                      <span className="text-sm font-semibold w-4 text-center" style={{ color: c.txt }}>{cart[item.id]}</span>
                      <button onClick={() => addToCart(item.id)} className="w-6 h-6 rounded-lg border flex items-center justify-center text-sm font-bold" style={{ borderColor: c.border, color: c.blue }}>+</button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 space-y-2">
                  <div className="flex justify-between text-sm" style={{ color: c.txt2 }}><span>Subtotal</span><span>{subtotal} DZD</span></div>
                  <div className="flex justify-between text-sm" style={{ color: c.green }}><span>SHIFA Coverage</span><span>− {Math.round(subtotal * 0.6)} DZD</span></div>
                  <div className="flex justify-between font-bold border-t pt-2" style={{ borderColor: c.border, color: c.txt }}><span>Total</span><span>{Math.round(subtotal * 0.4)} DZD</span></div>
                </div>
                <button className="w-full py-3 rounded-xl text-sm font-bold text-white mt-4 transition-all hover:opacity-90" style={{ background: c.blue }}>
                  Confirm & Pay
                </button>
                <p className="text-center text-xs mt-2" style={{ color: c.txt3 }}>🔒 Secured · CNAS integrated</p>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── CARE TAKER PAGE ──────────────────────────────────────────────────────────
function CareTakerPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [tab, setTab] = useState("assigned");
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>Care Taker</h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Manage your assigned caregiver</p>
      </div>
      {/* Assigned caregiver */}
      <div className="rounded-2xl p-6 mb-6 flex items-center gap-5 flex-wrap" style={{ background: "linear-gradient(135deg, #2D8C6F, #3aaa88)" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg" style={{ background: "rgba(255,255,255,0.2)" }}>FB</div>
        <div className="flex-1">
          <p className="text-white font-bold text-lg">Fatima Benali</p>
          <p className="text-white/80 text-sm">Professional Caregiver · ⭐ 4.8 (48 reviews) · 5 years experience</p>
          <div className="flex gap-2 mt-3">
            {["💬 Message","📞 Call","🔄 Reassign"].map(btn => (
              <button key={btn} className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-white/20" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>{btn}</button>
            ))}
          </div>
        </div>
        <Badge color="#fff" bg="rgba(255,255,255,0.2)">Currently Assigned</Badge>
      </div>
      <div className="flex gap-1 border-b mb-6" style={{ borderColor: c.border }}>
        {["assigned","find"].map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2.5 text-sm font-semibold capitalize transition-all"
            style={{ color: tab === t ? c.blue : c.txt2, borderBottom: tab === t ? `2px solid ${c.blue}` : "2px solid transparent", marginBottom: -1 }}>
            {t === "assigned" ? "My Caregiver" : "Find a Caregiver"}
          </button>
        ))}
      </div>
      {tab === "assigned" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card dk={dk}>
            <p className="font-semibold mb-4" style={{ color: c.txt }}>Today's Tasks</p>
            {[
              { text: "Morning medication administered", time: "8:00 AM", done: true },
              { text: "Picked up Lisinopril from pharmacy", time: "10:30 AM", done: true },
              { text: "Evening medication — Metformin", time: "8:00 PM (pending)", done: false },
            ].map(task => (
              <div key={task.text} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: c.border }}>
                {task.done ? <CheckCircle size={20} style={{ color: c.green }} /> : <Circle size={20} style={{ color: c.txt3 }} />}
                <div>
                  <p className="text-sm font-medium" style={{ color: task.done ? c.txt3 : c.txt, textDecoration: task.done ? "line-through" : "none" }}>{task.text}</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>{task.time}</p>
                </div>
              </div>
            ))}
          </Card>
          <Card dk={dk}>
            <p className="font-semibold mb-4" style={{ color: c.txt }}>Compatibility</p>
            <p className="text-sm mb-3" style={{ color: c.txt2 }}>Fatima is matched to your medical profile:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Hypertension care","Diabetes management","Medication adherence"].map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ background: c.blueLight, color: c.blue }}>{tag}</span>
              ))}
            </div>
            <p className="text-xs font-semibold mb-2" style={{ color: c.txt2 }}>Treatment adherence this week</p>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
              <div className="h-full rounded-full" style={{ width: "86%", background: c.green }} />
            </div>
            <p className="text-xs mt-1" style={{ color: c.txt2 }}>86% — Excellent</p>
          </Card>
        </div>
      )}
      {tab === "find" && (
        <div className="space-y-4">
          {CARETAKERS.map(ct => (
            <Card key={ct.name} dk={dk}>
              <div className="flex gap-4 flex-wrap">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shrink-0" style={{ background: ct.color }}>{ct.initials}</div>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: c.txt }}>{ct.name}</p>
                  <p className="text-sm" style={{ color: c.txt2 }}>{ct.role} · {ct.exp}</p>
                  <p className="text-xs mt-0.5 mb-2" style={{ color: c.txt2 }}>⭐ {ct.rating} · {ct.price}</p>
                  <div className="flex gap-2 flex-wrap">
                    {ct.tags.map(t => <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: c.blueLight, color: c.blue }}>{t}</span>)}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button className="text-xs font-semibold px-4 py-2 rounded-xl border" style={{ color: c.txt2, borderColor: c.border }}>View Profile</button>
                  <button className="text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ background: c.blue }}>Assign</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [notifs, setNotifs] = useState(NOTIFICATIONS_DATA);
  const dismiss = (id) => setNotifs(n => n.filter(x => x.id !== id));

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold" style={{ color: c.txt }}>Notifications</h1><p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Stay updated with your health alerts</p></div>
        <button onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))} className="text-sm font-semibold px-4 py-2 rounded-xl border" style={{ color: c.blue, borderColor: c.border }}>
          Mark all as read
        </button>
      </div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All","Medications","Appointments","Emergencies"].map((label, i) => (
          <button key={label} className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
            style={{ background: i === 0 ? c.blue : "transparent", color: i === 0 ? "#fff" : c.txt2, borderColor: i === 0 ? c.blue : c.border }}>
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {notifs.map(n => (
          <div key={n.id} className="flex items-start gap-3 p-4 rounded-2xl border transition-all" style={{
            background: dk ? n.bgDark : n.bg,
            borderColor: n.unread ? n.color + "44" : c.border,
            borderLeft: n.unread ? `3px solid ${n.color}` : undefined
          }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: n.color + "22" }}>
              <n.icon size={18} style={{ color: n.color }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: c.txt }}>{n.title}</p>
              <p className="text-xs mt-0.5" style={{ color: c.txt2 }}>{n.sub}</p>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.color }} />}
            <button onClick={() => dismiss(n.id)} className="shrink-0 text-xs hover:opacity-70 transition-opacity" style={{ color: c.txt3 }}>✕</button>
          </div>
        ))}
        {notifs.length === 0 && (
          <Card dk={dk} className="text-center" style={{ padding: 48 }}>
            <Bell size={36} className="mx-auto mb-3" style={{ color: c.txt3 }} />
            <p style={{ color: c.txt3 }}>No notifications</p>
          </Card>
        )}
      </div>
    </>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ dk, onToggleDark }) {
  const c = dk ? T.dark : T.light;
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ name: "Alex Johnson", email: "alex@example.com", phone: "+213 555 123 456", city: "Alger" });

  return (
    <>
      <div className="mb-6"><h1 className="text-2xl font-bold" style={{ color: c.txt }}>Settings</h1><p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Manage your account and preferences</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="space-y-5">
          <Card dk={dk}>
            <p className="font-semibold mb-5" style={{ color: c.txt }}>Profile Settings</p>
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "tel" },
            ].map(field => (
              <div key={field.key} className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt2 }}>{field.label}</label>
                <input type={field.type} value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt }} />
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt2 }}>City</label>
              <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border" style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt }}>
                <option>Alger</option><option>Oran</option><option>Constantine</option>
              </select>
            </div>
            <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: c.blue }}>Save Changes</button>
          </Card>
          <Card dk={dk}>
            <p className="font-semibold mb-5" style={{ color: c.txt }}>Security</p>
            {["Current Password","New Password"].map(label => (
              <div key={label} className="mb-4 relative">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt2 }}>{label}</label>
                <input type={showPwd ? "text" : "password"} placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-12 rounded-xl text-sm outline-none border"
                  style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt }} />
                <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-8" style={{ color: c.txt3 }}>
                  {showPwd ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            ))}
            <button className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:opacity-80" style={{ color: c.blue, borderColor: c.border }}>Update Password</button>
          </Card>
        </div>
        <div className="space-y-5">
          <Card dk={dk}>
            <p className="font-semibold mb-5" style={{ color: c.txt }}>Preferences</p>
            <div className="space-y-4">
              {[
                { label: "Medication reminders", checked: true },
                { label: "Appointment confirmations", checked: true },
                { label: "Analysis results ready", checked: true },
                { label: "Emergency alerts", checked: true },
                { label: "Email notifications", checked: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: c.txt }}>{item.label}</span>
                  <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${item.checked ? "" : ""}`}
                    style={{ background: item.checked ? c.blue : c.border }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: item.checked ? "22px" : "2px" }} />
                  </div>
                </div>
              ))}
              {/* Dark mode toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: c.txt }}>Dark mode</span>
                <button onClick={onToggleDark} className="relative w-10 h-5 rounded-full transition-colors cursor-pointer" style={{ background: dk ? c.blue : c.border }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: dk ? "22px" : "2px" }} />
                </button>
              </div>
            </div>
          </Card>
          <Card dk={dk}>
            <p className="font-semibold mb-4" style={{ color: c.txt }}>Language</p>
            <div className="flex gap-2 flex-wrap">
              {["🇫🇷 Français","🇩🇿 العربية","🇬🇧 English"].map((lang, i) => (
                <button key={lang} className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                  style={{ background: i === 0 ? c.blue : "transparent", color: i === 0 ? "#fff" : c.txt2, borderColor: i === 0 ? c.blue : c.border }}>
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
    </>
  );
}

// ─── MAIN SHELL ───────────────────────────────────────────────────────────────
export default function PatientDashboard() {
  const [page, setPage] = useState("dashboard");
  const [dk, setDk] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const c = dk ? T.dark : T.light;

  const NAV = [
    { id: "dashboard",       label: "Dashboard"       },
    { id: "medical-profile", label: "Medical Profile" },
    { id: "ai-diagnosis",    label: "AI Diagnosis"    },
    { id: "appointments",    label: "Appointments"    },
    { id: "prescriptions",   label: "Prescriptions"   },
    { id: "pharmacy",        label: "Pharmacy"        },
    { id: "care-taker",      label: "Care Taker"      },
    { id: "notifications",   label: "Notifications", badge: 3 },
    { id: "settings",        label: "Settings"        },
  ];

  const renderPage = () => {
    const props = { onNav: setPage, dk };
    switch (page) {
      case "dashboard":       return <DashboardPage {...props} />;
      case "medical-profile": return <MedicalProfilePage dk={dk} />;
      case "ai-diagnosis":    return <AIDiagnosisPage dk={dk} />;
      case "appointments":    return <AppointmentsPage dk={dk} />;
      case "prescriptions":   return <PrescriptionsPage dk={dk} />;
      case "pharmacy":        return <PharmacyPage dk={dk} />;
      case "care-taker":      return <CareTakerPage dk={dk} />;
      case "notifications":   return <NotificationsPage dk={dk} />;
      case "settings":        return <SettingsPage dk={dk} onToggleDark={() => setDk(!dk)} />;
      default:                return <DashboardPage {...props} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: c.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: c.txt, transition: "background 0.3s, color 0.2s" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); * { transition: background-color 0.2s, border-color 0.2s; }`}</style>

      {emergency && <EmergencyModal onClose={() => setEmergency(false)} dk={dk} />}

      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-30 border-b shadow-sm" style={{ background: c.nav, borderColor: c.border }}>
        <div className="w-full px-6 h-[60px] flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.blue }}>
              <Shield size={15} className="text-white" />
            </div>
            <span className="font-bold text-base" style={{ color: c.txt }}>MedSmart</span>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  color: page === item.id ? c.blue : c.txt2,
                  background: page === item.id ? c.blueLight : "transparent",
                }}>
                {item.label}
                {item.badge && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span>}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            {/* Dark mode toggle */}
            <button onClick={() => setDk(!dk)}
              className="relative w-11 h-6 rounded-full transition-colors duration-300 flex items-center"
              style={{ background: dk ? c.blue : "#E8A838" }}>
              <div className="absolute w-5 h-5 rounded-full bg-white shadow flex items-center justify-center transition-all duration-300" style={{ left: dk ? "22px" : "2px" }}>
                {dk ? <Moon size={10} style={{ color: c.blue }} /> : <Sun size={10} style={{ color: "#E8A838" }} />}
              </div>
            </button>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors"
                style={{ border: `1px solid ${c.border}`, background: "transparent" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: c.blue }}>AJ</div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight" style={{ color: c.txt }}>Alex Johnson</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>ID: #8821</p>
                </div>
                <ChevronDown size={13} style={{ color: c.txt3 }} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 rounded-2xl shadow-xl border p-2 z-40" style={{ background: c.card, borderColor: c.border }}>
                  {[{ label: "My Profile", icon: User, page: "medical-profile" }, { label: "Settings", icon: Settings, page: "settings" }].map(item => (
                    <button key={item.label} onClick={() => { setPage(item.page); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:opacity-80"
                      style={{ color: c.txt2, background: "transparent" }}>
                      <item.icon size={15} style={{ color: c.txt3 }} /> {item.label}
                    </button>
                  ))}
                  <div className="border-t mt-1 pt-1" style={{ borderColor: c.border }}>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:opacity-80" style={{ color: "#E05555", background: "transparent" }}>
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg" style={{ color: c.txt2 }} onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu size={17} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenu && (
          <div className="lg:hidden border-t px-4 py-3 flex flex-wrap gap-2" style={{ borderColor: c.border, background: c.nav }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => { setPage(item.id); setMobileMenu(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: page === item.id ? c.blue : c.txt2, background: page === item.id ? c.blueLight : "transparent" }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="w-full px-6 py-6">{renderPage()}</main>

      {/* Close dropdown on outside click */}
      {profileOpen && <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />}
    </div>
  );
}