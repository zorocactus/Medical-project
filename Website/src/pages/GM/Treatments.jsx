import { 
  ClipboardList, 
  CheckCircle2, 
  Circle,
  Clock,
  Pill,
  AlertTriangle,
  ChevronDown,
  User
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function GMTreatments() {
  const { gmTreatments: treatments } = useData();

  return (
    <div className="space-y-12">
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
                 <div className="w-12 h-12 rounded-full bg-[#1F2937] border-2 border-gray-800 flex items-center justify-center text-white font-bold text-lg">
                    {t.initials}
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-white leading-none">{t.patientName}</h2>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-2">{t.condition}</p>
                 </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current bg-opacity-10 ${
                t.status === 'Active' ? 'text-emerald-400 font-bold border-emerald-400/20 bg-emerald-400' : 'text-amber-400 font-bold border-amber-400/20 bg-amber-400'
              }`}>
                {t.status}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Morning */}
               <div className="bg-[#1F2937]/50 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    MORNING · 8:00 AM
                  </h3>
                  <div className="space-y-4">
                    {t.morning.map((med, i) => (
                      <div key={i} className="flex items-start gap-4">
                         <div className="mt-1">
                            {med.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-gray-600" />}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-100">{med.name}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{med.dosage}</p>
                         </div>
                      </div>
                    ))}
                    {t.morning.length === 0 && <p className="text-xs text-gray-500 italic">No medications scheduled.</p>}
                  </div>
               </div>

               {/* Afternoon */}
               <div className="bg-[#1F2937]/50 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    AFTERNOON · 1:00 PM
                  </h3>
                  <div className="space-y-4">
                    {t.afternoon.map((med, i) => (
                      <div key={i} className="flex items-start gap-4">
                         <div className="mt-1">
                            {med.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-gray-600" />}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-100">{med.name}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{med.dosage}</p>
                         </div>
                      </div>
                    ))}
                    {t.afternoon.length === 0 && <p className="text-xs text-gray-500 italic">No medications scheduled.</p>}
                  </div>
               </div>

               {/* Evening / Instructions */}
               {t.specialInstructions ? (
                 <div className="bg-amber-900/10 rounded-2xl p-6 border border-amber-500/10">
                    <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertTriangle size={14} /> SPECIAL INSTRUCTIONS
                    </h3>
                    <p className="text-xs font-medium text-blue-400 leading-relaxed italic">
                      {t.specialInstructions}
                    </p>
                 </div>
               ) : (
                 <div className="bg-[#1F2937]/50 rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      EVENING · 8:00 PM
                    </h3>
                    <div className="space-y-4">
                      {t.evening.map((med, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className="mt-1">
                              {med.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-gray-600" />}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-100">{med.name}</p>
                              <p className="text-[11px] text-gray-400 mt-1">{med.dosage}</p>
                           </div>
                        </div>
                      ))}
                      {t.evening.length === 0 && <p className="text-xs text-gray-500 italic">No medications scheduled.</p>}
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
