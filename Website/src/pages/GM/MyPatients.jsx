import { 
  Users, 
  User, 
  MapPin, 
  Heart, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  UserPlus
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function MyPatients() {
  const { gmPatients: patients, loadGMDemoData } = useData();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">My Patients</h1>
        <p className="text-gray-500 font-medium">{patients.length} patients assigned to you</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {patients.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-[#141B27] rounded-3xl border border-gray-800">
            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <UserPlus size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Patients Assigned</h2>
            <p className="text-gray-400 text-sm max-w-md mb-8">You haven't been assigned to any patients yet. Click the button below to load the demo patients.</p>
            <button 
              onClick={loadGMDemoData}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              Add Demo Patients (Alex, Youcef, Nadia)
            </button>
          </div>
        ) : patients.map((p) => (
          <div key={p.id} className="bg-[#141B27] rounded-3xl border border-gray-800 p-8 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all group relative overflow-hidden">
            {/* Background Blob */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[80px] opacity-10 ${
              p.color === 'blue' ? 'bg-blue-500' : p.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></div>

            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="w-20 h-20 rounded-full bg-[#1F2937] border-4 border-gray-800 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                {p.initials}
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{p.name}</h2>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                   {p.age} yrs · {p.gender} · {p.city}
                 </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                {p.conditions.map((c, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    p.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                    p.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {c}
                  </span>
                ))}
              </div>

              <div className="w-full space-y-3 pt-6 border-t border-gray-800/50">
                {p.vitals.map((v, i) => (
                  <div key={i} className="flex items-center justify-between text-sm group/vital">
                    <span className="text-gray-500 font-medium group-hover/vital:text-gray-400 transition-colors">{v.label}</span>
                    <span className={`font-bold ${v.highlight ? 'text-amber-500' : 'text-gray-200'}`}>
                      {v.value} <small className="text-[10px] opacity-50 font-medium">{v.unit}</small>
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full space-y-2 pt-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Adherence</span>
                    <span className="text-[10px] font-bold text-gray-300">{p.adherence}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                       className={`h-full rounded-full transition-all duration-1000 ${
                         p.color === 'blue' ? 'bg-blue-500' : p.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                       }`}
                       style={{ width: `${p.adherence}%` }}
                    ></div>
                 </div>
              </div>

              <div className="w-full grid grid-cols-1 gap-3 pt-4">
                <button className="w-full py-2.5 bg-[#1F2937] hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-gray-700">
                  Full Profile
                </button>
                <button className="w-full py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                  Alert Doctor
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
