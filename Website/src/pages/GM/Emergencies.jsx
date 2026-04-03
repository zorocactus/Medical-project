import { 
  AlertCircle, 
  Phone, 
  MapPin, 
  ChevronRight, 
  ShieldAlert,
  Navigation,
  Activity,
  Droplet,
  Heart
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function GMEmergencies() {
  const { gmPatients: patients } = useData();

  const emergencyContacts = [
    { name: "Dr. Benali Karim", role: "Primary physician · Cardiology", initials: "BK", action: "Call", color: "emerald" },
    { name: "SAMU — 15", role: "Medical emergency", initials: "15", action: "Call", color: "red" },
    ...(patients.length > 0 ? [
      { name: "Johnson Family", role: "+213 555 890 123", initials: "FJ", action: "Call", color: "blue" },
    ] : []),
    { name: "CHU Alger Central", role: "Nearest hospital · 2.3 km", initials: "HA", action: "Navigate", color: "amber" },
  ];

  const procedures = [
    {
      title: "Chest Pain / Cardiac Event",
      steps: [
        "Call SAMU 15 immediately",
        "Keep patient calm & still",
        "Do NOT give any medication",
        "Share GPS via app"
      ],
      color: "red"
    },
    {
      title: "Hypoglycemia (Low Sugar)",
      steps: [
        "Give glucose tablet or juice",
        "Recheck in 15 min",
        "If unconscious — call SAMU 15"
      ],
      color: "amber"
    },
    {
      title: "High Blood Pressure Crisis",
      steps: [
        "Seat patient",
        "Re-measure in 5 min",
        "Systolic >180 → Call SAMU immediately"
      ],
      color: "blue"
    }
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Emergency Protocols</h1>
        <p className="text-gray-500 font-medium tracking-tight">Contacts & procedures for urgent situations</p>
      </header>

      {/* Extreme Emergency Banner */}
      <div className="bg-red-950/20 border border-red-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
               <ShieldAlert size={32} />
            </div>
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
        {/* Contacts */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-white mb-4">Emergency Contacts</h2>
          <div className="space-y-4">
             {emergencyContacts.map((contact, i) => (
               <div key={i} className="flex items-center justify-between p-5 bg-[#141B27] rounded-2xl border border-gray-800 hover:border-blue-500/20 transition-all">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                        contact.color === 'emerald' ? 'bg-emerald-500' : 
                        contact.color === 'red' ? 'bg-red-500' : 
                        contact.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
                     }`}>
                        {contact.initials}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white leading-none mb-1.5">{contact.name}</p>
                        <p className="text-[11px] font-medium text-gray-500">{contact.role}</p>
                     </div>
                  </div>
                  <button className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                     contact.action === 'Call' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white' 
                        : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}>
                     {contact.action}
                  </button>
               </div>
             ))}
          </div>
        </div>

        {/* Procedures */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-white mb-4">Procedures</h2>
          <div className="space-y-4">
             {procedures.map((proc, i) => (
               <div key={i} className={`p-6 rounded-2xl border border-opacity-10 transition-all bg-opacity-5 ${
                  proc.color === 'red' ? 'bg-red-500 border-red-500 h-fit' : 
                  proc.color === 'amber' ? 'bg-amber-500 border-amber-500 h-fit' : 
                  'bg-blue-500 border-blue-500 h-fit'
               }`}>
                  <h3 className={`text-sm font-bold mb-3 ${
                     proc.color === 'red' ? 'text-red-400' : 
                     proc.color === 'amber' ? 'text-amber-500' : 'text-blue-400'
                  }`}>
                    {proc.title}
                  </h3>
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
