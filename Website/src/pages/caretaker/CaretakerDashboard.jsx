import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { 
  Users, Heart, Calendar, Star, CheckCircle2, Circle, Phone, AlertCircle, 
  MoreHorizontal, ChevronRight, MapPin, ShieldAlert, Navigation, Activity, 
  Droplet, User, UserPlus, Bell, Pill, X, ChevronLeft, FileText, Trash2, 
  Plus, ShoppingCart, AlertTriangle, Search, Filter, Minus, RefreshCw, 
  QrCode, Download, Eye, Clock, ExternalLink, Stethoscope, Shield, Settings, 
  ClipboardList, ChevronDown, LogOut, Menu, Sun, Moon, HeartPulse
} from "lucide-react";

// ============================================================================
// CONSTANTES STATIQUES (Déplacées depuis les fichiers du binôme)
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

// ============================================================================
// SOUS-COMPOSANTS (Fusion des fichiers du binôme)
// ============================================================================

function HomeView({ onChangePage }) {
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
    { name: "Dr. Benali Karim", role: "Primary physician", initials: "BK", color: "emerald" },
    { name: "SAMU 15", role: "Medical emergency", initials: "15", color: "red" },
    { name: "Alex's Family", role: "+213 555 890 123", initials: "FJ", color: "blue" },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome, <span className="text-blue-400">{userName}</span></h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Thursday, October 24 · {patients.length} patients in your care</p>
        </div>
        <button onClick={() => onChangePage("emergencies")} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2">
          <AlertCircle size={18} /> Emergency Alert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Patients in care", value: patients.length.toString(), icon: <Users size={20} className="text-blue-400" /> },
          { label: "Medications today", value: "7", sub: "4 done · 3 pending", icon: <Heart size={20} className="text-red-400" /> },
          { label: "Appointments today", value: "2", icon: <Calendar size={20} className="text-blue-400" /> },
          { label: "My rating", value: "4.8", sub: "48 reviews", icon: <Star size={20} className="text-amber-400" /> },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#141B27] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group">
            <div className="w-10 h-10 bg-[#1F2937] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {kpi.icon}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-white leading-none">{kpi.value}</div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-2">{kpi.label}</div>
                {kpi.sub && <div className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-tighter">{kpi.sub}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">MY PATIENTS</h2>
            <button onClick={() => onChangePage("myPatients")} className="text-xs font-bold text-blue-400 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {patients.length === 0 ? (
              <div className="bg-[#141B27] rounded-2xl border border-gray-800 p-8 text-center text-gray-500 flex flex-col items-center justify-center h-48">
                <Users size={32} className="mb-4 opacity-50" />
                <p>No patients assigned yet.</p>
              </div>
            ) : patients.map((patient) => (
              <div key={patient.id} className="bg-[#141B27] rounded-2xl border border-gray-800 p-6 hover:border-blue-500/30 transition-all group overflow-hidden relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white border-2 border-gray-700 font-bold text-lg">
                      {patient.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{patient.name}</h3>
                      <p className="text-xs font-medium text-gray-500">{patient.condition}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 bg-[#1F2937] border border-gray-700 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    patient.status === 'Stable' ? 'text-blue-400' : patient.status === 'Monitor' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {patient.status}
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Adherence this week</span>
                    <span className="text-[10px] font-bold text-gray-400">{patient.adherence}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${patient.color === 'blue' ? 'bg-blue-500' : patient.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${patient.adherence}%` }}></div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] text-gray-500 italic">Next med in {patient.nextMed}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => onChangePage("patientProfile")} className="px-5 py-2 bg-[#1F2937] hover:bg-gray-700 text-gray-300 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border border-gray-700">
                    Profile
                  </button>
                  <button onClick={() => onChangePage("emergencies")} className="px-5 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all">
                    Alert Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-[#141B27] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-sm font-bold text-white mb-6">Medication Schedule Today</h3>
            <div className="space-y-4">
              {schedule.length === 0 ? (
                <div className="text-center text-gray-500 py-6 text-sm">No medication scheduled.</div>
              ) : schedule.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <button className="mt-0.5 shrink-0">
                    {item.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-gray-700 group-hover:text-blue-500 transition-colors" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-xs font-bold leading-none ${item.status === 'done' ? 'text-gray-400 font-medium' : 'text-gray-200'}`}>{item.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-gray-500">{item.time}</span>
                      {item.status === 'done' ? <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Done</span> : item.in && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">in {item.in}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#141B27] rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-2 text-red-400 mb-6">
              <AlertCircle size={18} />
              <h3 className="text-sm font-bold text-white">Emergency Contacts</h3>
            </div>
            <div className="space-y-4">
              {emergencyContacts.length === 0 ? (
                <div className="text-center text-gray-500 py-6 text-sm">No emergency contacts.</div>
              ) : emergencyContacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#1F2937]/50 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${contact.color === 'emerald' ? 'bg-emerald-500' : contact.color === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}>{contact.initials}</div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none">{contact.name}</p>
                      <p className="text-[10px] font-medium text-gray-500 mt-1">{contact.role}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-blue-500/20">Call</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmergenciesView() {
  const { gmPatients: patients } = useData();

  const emergencyContacts = [
    { name: "Dr. Benali Karim", role: "Primary physician · Cardiology", initials: "BK", action: "Call", color: "emerald" },
    { name: "SAMU — 15", role: "Medical emergency", initials: "15", action: "Call", color: "red" },
    ...(patients.length > 0 ? [{ name: "Johnson Family", role: "+213 555 890 123", initials: "FJ", action: "Call", color: "blue" }] : []),
    { name: "CHU Alger Central", role: "Nearest hospital · 2.3 km", initials: "HA", action: "Navigate", color: "amber" },
  ];

  const procedures = [
    { title: "Chest Pain / Cardiac Event", steps: ["Call SAMU 15 immediately", "Keep patient calm & still", "Do NOT give any medication", "Share GPS via app"], color: "red" },
    { title: "Hypoglycemia (Low Sugar)", steps: ["Give glucose tablet or juice", "Recheck in 15 min", "If unconscious — call SAMU 15"], color: "amber" },
    { title: "High Blood Pressure Crisis", steps: ["Seat patient", "Re-measure in 5 min", "Systolic >180 → Call SAMU immediately"], color: "blue" }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Emergency Protocols</h1>
        <p className="text-gray-500 font-medium tracking-tight">Contacts & procedures for urgent situations</p>
      </header>
      <div className="bg-red-950/20 border border-red-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500"><ShieldAlert size={32} /></div>
            <div>
               <h2 className="text-xl font-bold text-red-500 mb-2">Activate Emergency Alert</h2>
               <p className="text-gray-400 text-sm font-medium">Notifies all doctors & family with GPS location</p>
            </div>
         </div>
         <button className="w-full md:w-auto px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
            🚨 ACTIVATE NOW
         </button>
      </div>
      {patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-[#141B27] rounded-3xl border border-gray-800">
          <ShieldAlert size={48} className="text-gray-700 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Emergency Profiles</h2>
          <p className="text-gray-500 text-sm">Add patients to view their specific emergency contacts and procedures.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-base font-bold text-white mb-4">Emergency Contacts</h2>
          <div className="space-y-4">
             {emergencyContacts.map((contact, i) => (
               <div key={i} className="flex items-center justify-between p-5 bg-[#141B27] rounded-2xl border border-gray-800 hover:border-blue-500/20 transition-all">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${contact.color === 'emerald' ? 'bg-emerald-500' : contact.color === 'red' ? 'bg-red-500' : contact.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`}>{contact.initials}</div>
                     <div>
                        <p className="text-sm font-bold text-white leading-none mb-1.5">{contact.name}</p>
                        <p className="text-[11px] font-medium text-gray-500">{contact.role}</p>
                     </div>
                  </div>
                  <button className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${contact.action === 'Call' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'}`}>{contact.action}</button>
               </div>
             ))}
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-base font-bold text-white mb-4">Procedures</h2>
          <div className="space-y-4">
             {procedures.map((proc, i) => (
               <div key={i} className={`p-6 rounded-2xl border border-opacity-10 transition-all bg-opacity-5 ${proc.color === 'red' ? 'bg-red-500 border-red-500 h-fit' : proc.color === 'amber' ? 'bg-amber-500 border-amber-500 h-fit' : 'bg-blue-500 border-blue-500 h-fit'}`}>
                  <h3 className={`text-sm font-bold mb-3 ${proc.color === 'red' ? 'text-red-400' : proc.color === 'amber' ? 'text-amber-500' : 'text-blue-400'}`}>{proc.title}</h3>
                  <div className="space-y-2">
                    {proc.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-medium text-gray-400">
                         <span className="text-gray-600 font-bold shrink-0">{idx + 1}.</span>
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

function JobRequestsView() {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Job Requests</h1>
          <p className="text-gray-400 text-sm font-medium">New caregiving opportunities in your area</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#638ECB]/10 rounded-xl border border-[#638ECB]/20 text-[#638ECB] font-bold text-sm">
          <Users size={16} /> {SAMPLE_REQUESTS.length} Requests Found
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {["All Shifts", "Full-time", "Part-time", "Night Shift", "Short-term"].map((filter, i) => (
          <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all ${i === 0 ? "bg-[#638ECB] text-white shadow-md shadow-blue-500/20" : "bg-[#172133] border border-gray-800 text-gray-400 hover:bg-gray-800"}`}>
            {filter}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {SAMPLE_REQUESTS.map((req) => (
          <div key={req.id} className="bg-[#172133] rounded-2xl border border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#638ECB]/10 text-[#638ECB] flex items-center justify-center font-bold text-xl border border-[#638ECB]/20 group-hover:bg-[#638ECB] group-hover:text-white transition-all duration-300">
                  {req.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{req.patientName}</h3>
                  <p className="text-sm font-medium text-gray-400">{req.age} years · {req.condition}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 flex-1 border-y lg:border-y-0 lg:border-x border-gray-800 py-4 lg:py-0 lg:px-8">
                <div className="flex items-center gap-3 text-sm text-gray-400 font-medium"><MapPin size={16} className="text-[#638ECB]" />{req.location}</div>
                <div className="flex items-center gap-3 text-sm text-gray-400 font-medium"><Clock size={16} className="text-[#638ECB]" />{req.duration}</div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-200"><Calendar size={16} className="text-[#638ECB]" />{req.pay}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider h-fit mr-4 ${req.urgency === 'High' ? 'text-red-500 bg-red-900/20 border border-red-900/30' : 'text-blue-500 bg-blue-900/20 border border-blue-900/30'}`}>
                  {req.urgency}
                </div>
                <button className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl bg-[#638ECB] hover:bg-[#395886] text-white font-bold text-sm transition-all shadow-md active:scale-95">View Details</button>
                <div className="flex items-center gap-2">
                   <button className="w-10 h-10 rounded-xl border border-emerald-900/30 bg-emerald-900/20 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all"><Check size={18} /></button>
                   <button className="w-10 h-10 rounded-xl border border-red-900/30 bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"><X size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#638ECB] rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-[-100px] left-[-30px] w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shrink-0"><AlertCircle size={40} /></div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Want to see more relevant requests?</h2>
            <p className="text-white/80 text-sm max-w-xl">Complete your verification and upload your medical qualifications to gain access to premium care roles and higher pay offers.</p>
          </div>
          <button className="md:ml-auto px-6 py-3 bg-white text-[#395886] font-bold rounded-xl text-sm shadow-xl hover:bg-[#F5F7FB] transition-all whitespace-nowrap active:scale-95">Complete Profile</button>
        </div>
      </div>
    </div>
  );
}

function MyPatientsView({ onChangePage }) {
  const { gmPatients: patients, loadGMDemoData } = useData();

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">My Patients</h1>
        <p className="text-gray-500 font-medium">{patients.length} patients assigned to you</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {patients.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-[#141B27] rounded-3xl border border-gray-800">
            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6"><UserPlus size={32} /></div>
            <h2 className="text-2xl font-bold text-white mb-2">No Patients Assigned</h2>
            <p className="text-gray-400 text-sm max-w-md mb-8">You haven't been assigned to any patients yet. Click the button below to load the demo patients.</p>
            <button onClick={loadGMDemoData} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95">
              Add Demo Patients (Alex, Youcef, Nadia)
            </button>
          </div>
        ) : patients.map((p) => (
          <div key={p.id} className="bg-[#141B27] rounded-3xl border border-gray-800 p-8 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all group relative overflow-hidden">
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[80px] opacity-10 ${p.color === 'blue' ? 'bg-blue-500' : p.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="w-20 h-20 rounded-full bg-[#1F2937] border-4 border-gray-800 flex items-center justify-center text-2xl font-bold text-white shadow-xl">{p.initials}</div>
              <div>
                 <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{p.name}</h2>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{p.age} yrs · {p.gender} · {p.city}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                {p.conditions.map((c, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : p.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{c}</span>
                ))}
              </div>
              <div className="w-full space-y-3 pt-6 border-t border-gray-800/50">
                {p.vitals.map((v, i) => (
                  <div key={i} className="flex items-center justify-between text-sm group/vital">
                    <span className="text-gray-500 font-medium group-hover/vital:text-gray-400 transition-colors">{v.label}</span>
                    <span className={`font-bold ${v.highlight ? 'text-amber-500' : 'text-gray-200'}`}>{v.value} <small className="text-[10px] opacity-50 font-medium">{v.unit}</small></span>
                  </div>
                ))}
              </div>
              <div className="w-full space-y-2 pt-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Adherence</span>
                    <span className="text-[10px] font-bold text-gray-300">{p.adherence}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${p.color === 'blue' ? 'bg-blue-500' : p.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${p.adherence}%` }}></div>
                 </div>
              </div>
              <div className="w-full grid grid-cols-1 gap-3 pt-4">
                <button onClick={() => onChangePage("patientProfile")} className="w-full py-2.5 bg-[#1F2937] hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-gray-700">Full Profile</button>
                <button onClick={() => onChangePage("emergencies")} className="w-full py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Alert Doctor</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsView() {
  const { gmPatients: patients } = useData();
  const notifications = patients.length === 0 ? [] : [
    { id: 1, type: "medication", title: "Medication Reminder", desc: "Take Lisinopril 10mg now", time: "2 minutes ago", icon: <Pill className="text-red-400" />, unread: true },
    { id: 2, type: "appointment", title: "Appointment Confirmed", desc: "Dr. Benali confirmed your appointment for Oct 25", time: "1 hour ago", icon: <Calendar className="text-blue-400" />, unread: true },
    { id: 3, type: "analysis", title: "Analysis Results Available", desc: "Lipid Profile results are ready to view", time: "Yesterday", icon: <Activity className="text-gray-400" />, unread: false },
    { id: 4, type: "system", title: "Caregiver Update", desc: "Fatima B. completed today's medication round", time: "3 hours ago", icon: <Heart className="text-blue-400" />, unread: false },
    { id: 5, type: "emergency", title: "Prescription Expiring Soon", desc: "Your Metformin prescription expires in 5 days", time: "2 days ago", icon: <AlertCircle className="text-red-400" />, unread: false }
  ];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-500 font-medium tracking-tight">Stay updated with your health alerts</p>
        </div>
        <button className="px-5 py-2.5 bg-[#1F2937] hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-gray-700 shadow-lg active:scale-95">Mark all as read</button>
      </header>
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {["All", "Medications", "Appointments", "Emergencies", "System"].map((filter, i) => (
          <button key={i} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${i === 0 ? "bg-[#3B82F6] text-white border-blue-500 shadow-lg shadow-blue-500/20" : "bg-[#1F2937] text-gray-400 border-gray-700 hover:text-white"}`}>{filter}</button>
        ))}
      </div>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="group relative bg-[#141B27] rounded-2xl p-6 border border-gray-800 hover:border-blue-500/20 transition-all flex items-center justify-between cursor-pointer">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#1F2937] border border-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">{notif.icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 group-hover:text-blue-400 transition-colors">{notif.title}</h3>
                  <p className="text-xs font-medium text-gray-500 mt-1">{notif.desc}</p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">{notif.time}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                {notif.unread && <div className="w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/40"></div>}
                <button className="p-2 text-gray-700 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
             </div>
          </div>
        ))}
      </div>
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-[#0B0F16] rounded-3xl border border-gray-800">
          <Bell size={64} className="text-gray-700 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">No Notifications</h2>
          <p className="text-gray-400 max-w-md">You're all caught up! There are no new alerts to show currently.</p>
        </div>
      )}
    </div>
  );
}

function PatientProfileView({ onBack }) {
  const patient = {
    name: "Ahmed Meziane", age: 72, bloodType: "A+", weight: "78 kg", height: "174 cm", condition: "Post-surgery recovery (Cardiac)", allergies: ["Penicillin", "Peanuts"],
    emergencyContact: { name: "Samir Meziane", relation: "Son", phone: "+213 550 12 34 56" },
    address: "12 Rue des Frères Benali, El Biar, Algiers",
    bio: "Patient is recovering from a recent heart valve replacement surgery. Requires daily monitoring of blood pressure and heart rate. Must follow a low-sodium diet and take medications exactly on time."
  };

  const dailyNeeds = [
    { title: "Medication Admin.", desc: "3 times daily as per prescription", status: "In progress" },
    { title: "Physical Therapy", desc: "Light walking for 15 mins daily", status: "Pending" },
    { title: "Vitals Monitoring", desc: "BP and Pulserate every 4 hours", status: "Continuous" },
    { title: "Wound Care", desc: "Clean surgical site once daily", status: "Done" }
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"><ChevronLeft size={16} /> Retour aux patients</button>
      <div className="bg-[#172133] rounded-3xl border border-gray-800 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#638ECB]/5 rounded-bl-[100px]"></div>
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#638ECB] to-[#395886] flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg border-4 border-gray-950">AM</div>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1.5">{patient.name}</h1>
              <div className="flex items-center gap-4 text-sm font-semibold text-gray-400">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#638ECB]" /> {patient.age} years old</span>
                <span className="flex items-center gap-1.5"><Droplet size={14} className="text-[#638ECB]" /> Blood: {patient.bloodType}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#638ECB]" /> Algiers, DZ</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-md active:scale-95"><Phone size={14} /> Call Family</button>
              <button className="px-4 py-2 border border-[#E84040] text-[#E84040] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#E84040] hover:text-white transition-all shadow-sm active:scale-95"><AlertCircle size={14} /> Emergency</button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {patient.allergies.map((allergy, i) => (
              <span key={i} className="px-3 py-1 bg-red-900/20 text-red-500 border border-red-900/30 rounded-full text-[11px] font-bold uppercase tracking-wider">{allergy} Allergy</span>
            ))}
            <span className="px-3 py-1 bg-[#638ECB]/10 text-[#638ECB] border border-[#638ECB]/20 rounded-full text-[11px] font-bold uppercase tracking-wider">{patient.condition}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#172133] rounded-3xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><FileText size={18} className="text-[#638ECB]" /> Health Summary</h2>
            <p className="text-sm font-medium text-gray-400 leading-relaxed italic border-l-4 border-[#638ECB] pl-4 mb-8">"{patient.bio}"</p>
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest border-b border-gray-800 pb-2">Emergency Contact</h3>
              <div className="p-4 rounded-2xl bg-[#1E2D4A]/30 border border-gray-800">
                <p className="text-sm font-bold text-white">{patient.emergencyContact.name}</p>
                <p className="text-xs font-medium text-gray-400">{patient.emergencyContact.relation}</p>
                <div className="flex items-center gap-2 mt-3 text-sm font-bold text-[#638ECB]"><Phone size={14} /> {patient.emergencyContact.phone}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#172133] rounded-3xl border border-gray-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white">Daily Care Needs</h2>
              <button className="text-[11px] font-bold text-[#638ECB] uppercase tracking-wider bg-[#638ECB]/10 px-3 py-1 rounded-full border border-[#638ECB]/20">4 Tasks Pending</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyNeeds.map((need, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-800 hover:border-[#638ECB]/30 hover:bg-gray-800/50 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#638ECB] transition-colors">{need.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${need.status === 'Done' ? 'bg-emerald-50 text-emerald-500' : need.status === 'Continuous' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>{need.status.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{need.desc}</p>
                  <button className="w-full py-2 bg-[#638ECB]/5 text-[#638ECB] text-xs font-bold rounded-lg border border-[#638ECB]/10 hover:bg-[#638ECB] hover:text-white transition-all">Update Progress</button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#172133] rounded-3xl border border-gray-800 p-8 shadow-sm">
              <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Log Vitals</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <input type="text" placeholder="BP (e.g. 120/80)" className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm outline-none focus:border-[#638ECB] text-white" />
                   <input type="text" placeholder="Temp (°C)" className="w-24 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm outline-none focus:border-[#638ECB] text-white" />
                </div>
                <button className="w-full py-3 bg-[#638ECB] text-white font-bold text-sm rounded-xl hover:bg-[#395886] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"><Plus size={16} /> Save Readings</button>
              </div>
            </div>
            <div className="bg-[#172133] rounded-3xl border border-gray-800 p-8 shadow-sm">
              <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Recent Trend</h2>
              <div className="flex items-end justify-between h-20 gap-2">
                {[40, 70, 45, 90, 65, 80, 55].map((v, i) => (
                  <div key={i} className="flex-1 bg-[#638ECB]/20 rounded-t-sm hover:bg-[#638ECB] transition-all cursor-pointer relative group" style={{ height: `${v}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100">7{v % 10}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold text-gray-400">MON</span>
                <span className="text-[10px] font-bold text-gray-400">SUN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PharmacyView() {
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
          <h1 className="text-2xl font-bold text-white mb-1">Pharmacy & Stock</h1>
          <p className="text-gray-400 text-sm font-medium">Monitor and refill patient's daily medications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#172133] border border-gray-800 rounded-xl text-sm font-bold text-[#638ECB] hover:bg-blue-900/10 transition-all flex items-center gap-2">
            <RefreshCw size={16} /> Sync Stock
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#172133] rounded-3xl border border-gray-800 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
               <h2 className="text-lg font-bold text-white flex items-center gap-2"><Pill size={20} className="text-[#638ECB]" /> Medication Stock</h2>
               <div className="flex items-center gap-2 flex-1 md:flex-none">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search stock..." className="pl-9 pr-4 py-1.5 bg-gray-800 text-white border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#638ECB] w-full" />
                  </div>
                  <button className="p-1.5 border border-gray-800 rounded-lg text-gray-400"><Filter size={14} /></button>
               </div>
            </div>
            <div className="space-y-4">
               {stock.map((item) => (
                 <div key={item.id} className={`p-5 rounded-2xl border transition-all ${item.status === 'critical' ? 'bg-red-900/10 border-red-900/20' : item.status === 'low' ? 'bg-amber-900/10 border-amber-900/20' : 'bg-transparent border-gray-800 hover:border-blue-900/50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${item.status === 'critical' ? 'bg-red-500 text-white' : item.status === 'low' ? 'bg-amber-500 text-white' : 'bg-[#638ECB] text-white'}`}><Pill size={18} /></div>
                         <div>
                            <h4 className="text-sm font-bold text-white">{item.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Threshold: {item.threshold} {item.unit}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className={`text-lg font-bold ${item.status === 'critical' ? 'text-red-500' : item.status === 'low' ? 'text-amber-500' : 'text-[#638ECB]'}`}>{item.quantity} <small className="text-[10px] font-medium text-gray-400">{item.unit}</small></p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">In Stock</p>
                         </div>
                         <button disabled={item.status === 'ok'} onClick={() => addToCart(item)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${item.status === 'ok' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#638ECB] text-white hover:bg-[#395886]'}`}>{item.status === 'ok' ? 'In Stock' : 'Order Refill'}</button>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#172133] rounded-3xl border border-gray-800 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={20} className="text-[#638ECB]" /> Order Refill</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cart.length} Items</span>
             </div>
             <div className="space-y-4 mb-8">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4 border border-gray-700"><ShoppingCart size={24} className="text-gray-500" /></div>
                    <p className="text-xs font-medium text-gray-400 max-w-[150px] mx-auto">Add low stock items to your refill order.</p>
                  </div>
                ) : cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-md bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={12} /></button>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-[#638ECB]">{item.name}</p>
                            <p className="text-[10px] text-gray-400">1 Box (30 tabs)</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="w-6 h-6 rounded-md border border-gray-700 text-gray-400 font-bold flex items-center justify-center">-</button>
                          <span className="text-xs font-bold text-white">1</span>
                          <button className="w-6 h-6 rounded-md border border-gray-700 text-gray-400 font-bold flex items-center justify-center">+</button>
                       </div>
                    </div>
                ))}
             </div>
             <div className="pt-6 border-t border-gray-800 space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                   <span className="text-gray-400">Pharmacy</span>
                   <span className="text-gray-200">Pharmacie du Jardin</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                   <span className="text-gray-400">Delivery</span>
                   <span className="text-gray-200">Home Delivery</span>
                </div>
                <button disabled={cart.length === 0} className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${cart.length === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#638ECB] text-white hover:bg-[#395886]'}`}>Place Order <CheckCircle2 size={18} /></button>
             </div>
          </div>
          <div className="bg-red-500 rounded-3xl p-8 relative overflow-hidden group shadow-xl shadow-red-500/10">
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2"><AlertTriangle size={14} /> Immediate Action</div>
                <h3 className="text-white font-bold text-lg mb-2">Lisinopril Critical</h3>
                <p className="text-white/80 text-xs font-medium leading-relaxed">The stock level is below 1 day's dosage. Please place an order immediately to avoid interruption in treatment.</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrescriptionsView() {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Prescriptions</h1>
          <p className="text-gray-400 text-sm font-medium">Valid medical orders for your assigned patient</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by RX ID or Doctor..." className="pl-10 pr-4 py-2 bg-[#172133] border border-gray-800 rounded-xl text-sm outline-none focus:border-[#638ECB] w-full md:w-64 text-white" />
          </div>
          <button className="p-2 border border-gray-800 rounded-xl bg-[#172133] text-[#638ECB] hover:bg-blue-900/20 transition-all"><Download size={20} /></button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#172133] rounded-3xl border border-gray-800 shadow-sm overflow-hidden">
             <div className="bg-[#638ECB]/5 border-b border-gray-800/50 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#141B27] flex items-center justify-center text-[#638ECB] shadow-sm border border-gray-800"><FileText size={24} /></div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Active Prescription</h2>
                    <p className="text-xs font-bold text-[#638ECB] tracking-widest uppercase mt-0.5">ID: #RX-4482 · ISSUED 24 OCT</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-900/20 text-emerald-500 border border-emerald-900/30 rounded-full text-[10px] font-bold uppercase tracking-widest">Validated</div>
             </div>
             <div className="p-8 space-y-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900/20 text-[#638ECB] flex items-center justify-center"><User size={20} /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-100">Dr. Kamel Benali</p>
                      <p className="text-[11px] font-medium text-gray-400">Cardiologist · MedSmart Verified</p>
                    </div>
                  </div>
                  <button className="p-2 text-[#638ECB] hover:bg-gray-700 rounded-lg transition-all border border-transparent hover:border-gray-600"><ExternalLink size={16} /></button>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Pill size={14} /> Prescribed Medications</h3>
                  {SAMPLE_PRESCRIPTIONS[0].medications.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-gray-800 hover:border-[#638ECB]/30 transition-all">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-100">{med.name} <small className="text-[#638ECB] opacity-70">({med.dosage})</small></span>
                        <span className="text-xs font-medium text-gray-400 mt-1">{med.freq}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-[#638ECB]/10 text-[#638ECB] rounded-lg text-[11px] font-bold hover:bg-[#638ECB] hover:text-white transition-all">Administer Now</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-amber-900/10 border border-amber-900/20">
                  <h4 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock size={12} /> Instructions from Doctor</h4>
                  <p className="text-xs font-medium text-amber-500/80 leading-relaxed italic">"Ensure patient takes medication with water. Administer Metformin exactly at 08:00 and 20:00. Monitor for any dizziness or nausea after Aspirin intake."</p>
                </div>
             </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#172133] rounded-3xl border border-gray-800 p-8 shadow-sm text-center space-y-6">
             <div className="mx-auto w-48 h-48 p-4 bg-white rounded-2xl border-4 border-gray-800 shadow-inner flex items-center justify-center relative group">
                <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden"><QrCode size={120} className="text-white opacity-90" /></div>
             </div>
             <div>
                <h3 className="text-lg font-bold text-white mb-2">Pharmacy Verification</h3>
                <p className="text-xs font-medium text-gray-400 leading-relaxed">Use this QR code at any MedSmart-partnered pharmacy to verify the prescription and pick up medications.</p>
             </div>
             <button className="w-full py-3 bg-[#395886] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#0D2644] transition-all shadow-lg active:scale-95"><Download size={16} /> Save QR to Gallery</button>
          </div>
          <div className="bg-[#172133] rounded-3xl border border-gray-800 p-8 shadow-sm">
             <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">RX History</h3>
             <div className="space-y-6">
                {SAMPLE_PRESCRIPTIONS.slice(1).map((rx, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-800 group-hover:bg-blue-900/20 text-gray-400 group-hover:text-[#638ECB] flex items-center justify-center transition-all border border-gray-700 group-hover:border-blue-900/50"><FileText size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-gray-200 group-hover:text-[#638ECB]">{rx.id}</p>
                        <p className="text-[10px] font-medium text-gray-400">{rx.date}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{rx.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-[70rem] mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-[28px] font-bold text-white mb-2">Settings</h1>
        <p className="text-sm font-medium text-blue-400">Manage your account and preferences</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-6">Profile Settings</h2>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-gray-400 block mb-2">Full Name</label><input type="text" defaultValue="Fatima B." className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" /></div>
              <div><label className="text-xs font-bold text-gray-400 block mb-2">Email</label><input type="email" defaultValue="fatima@example.com" className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" /></div>
              <div><label className="text-xs font-bold text-gray-400 block mb-2">Phone</label><input type="tel" defaultValue="+213 555 123 456" className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" /></div>
              <div><label className="text-xs font-bold text-gray-400 block mb-2">City</label><input type="text" defaultValue="Alger" className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" /></div>
              <div className="pt-2"><button className="px-6 py-2.5 bg-[#60A5FA] hover:bg-blue-400 text-[#0B0F16] text-sm font-bold rounded-lg transition-colors">Save Changes</button></div>
            </div>
          </div>
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-6">Security</h2>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-gray-400 block mb-2">Current Password</label><input type="password" defaultValue="........" className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" /></div>
              <div><label className="text-xs font-bold text-gray-400 block mb-2">New Password</label><input type="password" defaultValue="........" className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" /></div>
              <div className="pt-2"><button className="px-6 py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 text-sm font-bold rounded-lg transition-colors">Update Password</button></div>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-6">Notifications</h2>
            <div className="space-y-5">
               {["Medication reminders", "Appointment confirmations", "Analysis results ready", "Emergency alerts"].map((item, i) => (
                 <div key={i} className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#60A5FA]"></div>
                      <span className="ml-4 text-xs font-bold text-gray-300">{item}</span>
                    </label>
                 </div>
               ))}
            </div>
          </div>
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-6">Language / لغة</h2>
            <div className="flex gap-4">
              <button className="px-5 py-2.5 bg-[#60A5FA] text-[#0B0F16] text-xs font-bold rounded-lg transition-colors">FR Français</button>
              <button className="px-5 py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 text-xs font-bold rounded-lg transition-colors">العربية DZ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreatmentsView() {
  const { gmTreatments: treatments } = useData();

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Treatment Plans</h1>
        <p className="text-gray-500 font-medium tracking-tight">Active medication protocols per patient</p>
      </header>
      <div className="space-y-12">
        {treatments.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-[#141B27] rounded-3xl border border-gray-800">
            <ClipboardList size={48} className="text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Treatment Plans</h2>
            <p className="text-gray-500 text-sm">No active treatment protocols found.</p>
          </div>
        ) : treatments.map((t) => (
          <div key={t.id} className="bg-[#141B27] rounded-3xl border border-gray-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-[#1F2937] border-2 border-gray-800 flex items-center justify-center text-white font-bold text-lg">{t.initials}</div>
                 <div>
                    <h2 className="text-xl font-bold text-white leading-none">{t.patientName}</h2>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-2">{t.condition}</p>
                 </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current bg-opacity-10 ${t.status === 'Active' ? 'text-emerald-400 font-bold border-emerald-400/20 bg-emerald-400' : 'text-amber-400 font-bold border-amber-400/20 bg-amber-400'}`}>{t.status}</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="bg-[#1F2937]/50 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">MORNING · 8:00 AM</h3>
                  <div className="space-y-4">
                    {t.morning.map((med, i) => (
                      <div key={i} className="flex items-start gap-4">
                         <div className="mt-1">{med.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-gray-600" />}</div>
                         <div><p className="text-sm font-bold text-gray-100">{med.name}</p><p className="text-[11px] text-gray-400 mt-1">{med.dosage}</p></div>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-[#1F2937]/50 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">AFTERNOON · 1:00 PM</h3>
                  <div className="space-y-4">
                    {t.afternoon.map((med, i) => (
                      <div key={i} className="flex items-start gap-4">
                         <div className="mt-1">{med.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-gray-600" />}</div>
                         <div><p className="text-sm font-bold text-gray-100">{med.name}</p><p className="text-[11px] text-gray-400 mt-1">{med.dosage}</p></div>
                      </div>
                    ))}
                  </div>
               </div>
               {t.specialInstructions ? (
                 <div className="bg-amber-900/10 rounded-2xl p-6 border border-amber-500/10">
                    <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={14} /> SPECIAL INSTRUCTIONS</h3>
                    <p className="text-xs font-medium text-blue-400 leading-relaxed italic">{t.specialInstructions}</p>
                 </div>
               ) : (
                 <div className="bg-[#1F2937]/50 rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">EVENING · 8:00 PM</h3>
                    <div className="space-y-4">
                      {t.evening.map((med, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className="mt-1">{med.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-gray-600" />}</div>
                           <div><p className="text-sm font-bold text-gray-100">{med.name}</p><p className="text-[11px] text-gray-400 mt-1">{med.dosage}</p></div>
                        </div>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPOSANT PRINCIPAL (COQUILLE DE NAVIGATION)
// ============================================================================

export default function GardeMaladeDashboard({ onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const { userData: user } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  const NAV = [
    { id: "dashboard", label: "Accueil" },
    { id: "jobRequests", label: "Offres & Missions" },
    { id: "myPatients", label: "Mes Patients" },
    { id: "treatments", label: "Traitements" },
    { id: "pharmacy", label: "Pharmacie" },
    { id: "prescriptions", label: "Ordonnances" },
  ];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <HomeView onChangePage={setPage} />;
      case "emergencies": return <EmergenciesView />;
      case "jobRequests": return <JobRequestsView />;
      case "myPatients": return <MyPatientsView onChangePage={setPage} />;
      case "notifications": return <NotificationsView />;
      case "patientProfile": return <PatientProfileView onBack={() => setPage("myPatients")} />;
      case "pharmacy": return <PharmacyView />;
      case "prescriptions": return <PrescriptionsView />;
      case "profile": return <SettingsView />;
      case "treatments": return <TreatmentsView />;
      default: return <HomeView onChangePage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F16] font-sans transition-all duration-500 dark">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
      
      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-30 border-b shadow-sm backdrop-blur-md bg-[#141B27] border-gray-800">
        <div className="w-full px-6 h-[65px] flex items-center justify-between">
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}>
              <HeartPulse size={18} color="white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base text-white">MedSmart</span>
              <span className="ml-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#7B5EA7]/15 text-[#7B5EA7]">
                Garde-Malade
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${page === item.id ? "bg-[#6492C9] text-white shadow-sm" : "text-gray-400 hover:bg-white/5"}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setPage("notifications")} className="relative p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400">
              <Bell size={18} />
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[#141B27]"></span>
            </button>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-xl border hover:opacity-80 transition-all border-gray-700">
                <div className="w-8 h-8 rounded-lg bg-[#6492C9] text-white flex items-center justify-center font-bold text-sm">
                  {user?.firstName?.[0] || "F"}
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-2xl shadow-xl border overflow-hidden z-50 animate-in slide-in-from-top-2 bg-[#141B27] border-gray-800">
                  <div className="p-4 border-b border-gray-800">
                    <p className="font-bold text-sm text-white">{user?.firstName || "Fatima"} B.</p>
                    <p className="text-xs text-gray-500">Garde-malade à domicile</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button onClick={() => { setPage("profile"); setProfileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/5 text-gray-300">
                      <Settings size={16} /> Paramètres
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="lg:hidden p-2 rounded-xl border text-white border-gray-700" onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu size={18} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden p-4 border-t bg-[#141B27] border-gray-800">
            <div className="grid grid-cols-2 gap-2">
              {NAV.map(item => (
                <button key={item.id} onClick={() => { setPage(item.id); setMobileMenu(false); }}
                  className={`p-3 rounded-xl text-sm font-bold text-left transition-all ${page === item.id ? "bg-[#6492C9] text-white" : "bg-[#1F2937] text-gray-400"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ═══ CONTENU ═══ */}
      <main className="max-w-7xl mx-auto p-6 pb-24">
        {renderPage()}
      </main>

      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </div>
  );
}