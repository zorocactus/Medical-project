import { 
  Users, 
  Heart, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Circle,
  Phone,
  AlertCircle,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";

export default function GMDashboard() {
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome, <span className="text-blue-400">{userName}</span></h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Thursday, October 24 · {patients.length} patients in your care</p>
        </div>
        <button className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2">
          <AlertCircle size={18} /> Emergency Alert
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Patients in care", value: "3", icon: <Users size={20} className="text-blue-400" /> },
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
        {/* Left: My Patients */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">MY PATIENTS</h2>
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
                    patient.status === 'Stable' ? 'text-blue-400' : 
                    patient.status === 'Monitor' ? 'text-amber-400' : 'text-emerald-400'
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
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        patient.color === 'blue' ? 'bg-blue-500' : 
                        patient.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${patient.adherence}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] text-gray-500 italic">Next med in {patient.nextMed}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-5 py-2 bg-[#1F2937] hover:bg-gray-700 text-gray-300 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border border-gray-700">
                    Profile
                  </button>
                  <button className="px-5 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all">
                    Alert Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Schedule & Contacts */}
        <div className="space-y-8">
          {/* Schedule */}
          <div className="bg-[#141B27] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-sm font-bold text-white mb-6">Medication Schedule Today</h3>
            <div className="space-y-4">
              {schedule.length === 0 ? (
                <div className="text-center text-gray-500 py-6 text-sm">
                  No medication scheduled.
                </div>
              ) : schedule.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <button className="mt-0.5 shrink-0">
                    {item.status === 'done' 
                      ? <CheckCircle2 size={18} className="text-emerald-500" />
                      : <Circle size={18} className="text-gray-700 group-hover:text-blue-500 transition-colors" />
                    }
                  </button>
                  <div className="flex-1">
                    <p className={`text-xs font-bold leading-none ${item.status === 'done' ? 'text-gray-400 font-medium' : 'text-gray-200'}`}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-gray-500">{item.time}</span>
                      {item.status === 'done' 
                        ? <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Done</span>
                        : item.in && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">in {item.in}</span>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-[#141B27] rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-2 text-red-400 mb-6">
              <AlertCircle size={18} />
              <h3 className="text-sm font-bold text-white">Emergency Contacts</h3>
            </div>
            <div className="space-y-4">
              {emergencyContacts.length === 0 ? (
                <div className="text-center text-gray-500 py-6 text-sm">
                  No emergency contacts.
                </div>
              ) : emergencyContacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#1F2937]/50 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                      contact.color === 'emerald' ? 'bg-emerald-500' : 
                      contact.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {contact.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none">{contact.name}</p>
                      <p className="text-[10px] font-medium text-gray-500 mt-1">{contact.role}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-blue-500/20">
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
