import { 
  User, 
  ChevronLeft, 
  Phone, 
  MapPin, 
  Calendar, 
  AlertCircle,
  FileText,
  Activity,
  Droplet,
  Trash2,
  Plus
} from "lucide-react";

export default function PatientProfile() {
  const patient = {
    name: "Ahmed Meziane",
    age: 72,
    bloodType: "A+",
    weight: "78 kg",
    height: "174 cm",
    condition: "Post-surgery recovery (Cardiac)",
    allergies: ["Penicillin", "Peanuts"],
    emergencyContact: {
      name: "Samir Meziane",
      relation: "Son",
      phone: "+213 550 12 34 56"
    },
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
      {/* Patient Header Card */}
      <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#638ECB]/5 rounded-bl-[100px]"></div>

        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#638ECB] to-[#395886] flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg border-4 border-white dark:border-gray-950">
          AM
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0D2644] dark:text-white mb-1.5">{patient.name}</h1>
              <div className="flex items-center gap-4 text-sm font-semibold text-[#5C738A] dark:text-gray-400">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#638ECB]" /> {patient.age} years old</span>
                <span className="flex items-center gap-1.5"><Droplet size={14} className="text-[#638ECB]" /> Blood: {patient.bloodType}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#638ECB]" /> Algiers, DZ</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-md active:scale-95">
                <Phone size={14} /> Call Family
              </button>
              <button className="px-4 py-2 border border-[#E84040] text-[#E84040] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#E84040] hover:text-white transition-all shadow-sm active:scale-95">
                <AlertCircle size={14} /> Emergency
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {patient.allergies.map((allergy, i) => (
              <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-900/30 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {allergy} Allergy
              </span>
            ))}
            <span className="px-3 py-1 bg-[#638ECB]/10 text-[#638ECB] border border-[#638ECB]/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {patient.condition}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#0D2644] dark:text-white mb-6 flex items-center gap-2">
              <FileText size={18} className="text-[#638ECB]" /> Health Summary
            </h2>
            <p className="text-sm font-medium text-[#5C738A] dark:text-gray-400 leading-relaxed italic border-l-4 border-[#638ECB] pl-4 mb-8">
              "{patient.bio}"
            </p>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#0D2644] dark:text-gray-300 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800 pb-2">Emergency Contact</h3>
              <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#1E2D4A]/30 border border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold text-[#0D2644] dark:text-white">{patient.emergencyContact.name}</p>
                <p className="text-xs font-medium text-[#5C738A] dark:text-gray-400">{patient.emergencyContact.relation}</p>
                <div className="flex items-center gap-2 mt-3 text-sm font-bold text-[#638ECB]">
                  <Phone size={14} /> {patient.emergencyContact.phone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tasks/Needs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-[#0D2644] dark:text-white">Daily Care Needs</h2>
              <button className="text-[11px] font-bold text-[#638ECB] uppercase tracking-wider bg-[#638ECB]/10 px-3 py-1 rounded-full border border-[#638ECB]/20">
                4 Tasks Pending
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyNeeds.map((need, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#638ECB]/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[#0D2644] dark:text-white group-hover:text-[#638ECB] transition-colors">{need.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      need.status === 'Done' ? 'bg-emerald-50 text-emerald-500' : 
                      need.status === 'Continuous' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {need.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C738A] dark:text-gray-400 mb-4">{need.desc}</p>
                  <button className="w-full py-2 bg-[#638ECB]/5 text-[#638ECB] text-xs font-bold rounded-lg border border-[#638ECB]/10 hover:bg-[#638ECB] hover:text-white transition-all">
                    Update Progress
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick vitals log */}
            <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
              <h2 className="text-sm font-bold text-[#0D2644] dark:text-white mb-6 uppercase tracking-wider">Log Vitals</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <input type="text" placeholder="BP (e.g. 120/80)" className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm outline-none focus:border-[#638ECB]" />
                   <input type="text" placeholder="Temp (°C)" className="w-24 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm outline-none focus:border-[#638ECB]" />
                </div>
                <button className="w-full py-3 bg-[#638ECB] text-white font-bold text-sm rounded-xl hover:bg-[#395886] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                  <Plus size={16} /> Save Readings
                </button>
              </div>
            </div>

            {/* Recent Vitals Trend */}
            <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
              <h2 className="text-sm font-bold text-[#0D2644] dark:text-white mb-6 uppercase tracking-wider">Recent Trend</h2>
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
