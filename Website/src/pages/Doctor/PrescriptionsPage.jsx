import { useState } from "react";
import { ChevronDown, Plus, Search, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const AVATAR_COLORS = [
  "#6492C9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#3B82F6", "#6366F1",
];

const STATUS_BADGES = {
  Active:    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
  Expiring:  "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 font-medium",
  Expired:   "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/30 font-medium",
};

const FREQUENCY_OPTIONS = [
  "Once daily", "Twice daily", "Three times daily", "As needed"
];

function getInitials(firstName = "", lastName = "") {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}

export default function PrescriptionsPage() {
  const { patients, prescriptions, addPrescription } = useData();

  const [form, setForm] = useState({
    patientIndex: "",
    medication: "",
    strength: "",
    dosage: "",
    frequency: "Once daily",
    duration: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const newErrors = {};
    if (!form.patientIndex) newErrors.patientIndex = "Select a patient";
    if (!form.medication.trim()) newErrors.medication = "Required";
    if (!form.dosage.trim()) newErrors.dosage = "Required";
    if (!form.duration.trim()) newErrors.duration = "Required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const patient = patients[Number(form.patientIndex)] || null;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    const rx = {
      id: `#RX${String(prescriptions.length + 1000 + 1).padStart(4, "0")}`,
      patient,
      patientIdx: Number(form.patientIndex),
      medication: form.medication,
      strength: form.strength,
      dosage: form.dosage,
      frequency: form.frequency,
      duration: form.duration,
      notes: form.notes,
      date: dateStr,
      status: "Active",
    };

    addPrescription(rx);
    setForm({
      patientIndex: "", medication: "", strength: "", dosage: "",
      frequency: "Once daily", duration: "", notes: "",
    });
    setErrors({});
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0D2644] dark:text-white mb-1">Prescriptions</h1>
          <p className="text-[#5C738A] dark:text-gray-400 text-[15px] font-medium">{prescriptions.length} issued this month</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#6492C9] hover:bg-[#304B71] text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
          <Plus size={16} /> New Prescription
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column — Write New Prescription Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#172133] rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-8">Write New Prescription</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-[#5C738A] dark:text-gray-400">Patient</label>
                <div className="relative">
                  <select 
                    name="patientIndex" 
                    value={form.patientIndex} 
                    onChange={handleChange}
                    className={`w-full appearance-none px-4 py-3 rounded-xl border ${errors.patientIndex ? "border-red-400" : "border-gray-200 dark:border-gray-700"} text-gray-700 dark:text-white bg-white dark:bg-transparent focus:outline-none focus:border-[#6492C9] transition-colors`}
                  >
                    <option value="" className="dark:bg-[#172133]"># Select patient #</option>
                    {patients.map((p, i) => (
                      <option key={i} value={i} className="dark:bg-[#172133]">{`${p.firstName || ""} ${p.lastName || ""}`.trim()}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0B5CD] pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#5C738A] dark:text-gray-400">Medication</label>
                  <input type="text" name="medication" placeholder="e.g. Metformin" value={form.medication} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.medication ? "border-red-400" : "border-gray-200 dark:border-gray-700"} text-gray-700 dark:text-white bg-transparent focus:outline-none focus:border-[#6492C9] transition-colors placeholder-[#A0B5CD]`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#5C738A] dark:text-gray-400">Strength</label>
                  <input type="text" name="strength" placeholder="500mg" value={form.strength} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white bg-transparent focus:outline-none focus:border-[#6492C9] transition-colors placeholder-[#A0B5CD]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#5C738A] dark:text-gray-400">Dosage</label>
                  <input type="text" name="dosage" placeholder="1 tablet" value={form.dosage} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.dosage ? "border-red-400" : "border-gray-200 dark:border-gray-700"} text-gray-700 dark:text-white bg-transparent focus:outline-none focus:border-[#6492C9] transition-colors placeholder-[#A0B5CD]`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#5C738A] dark:text-gray-400">Frequency</label>
                  <div className="relative">
                    <select name="frequency" value={form.frequency} onChange={handleChange} className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white bg-white dark:bg-transparent focus:outline-none focus:border-[#6492C9] transition-colors">
                      {FREQUENCY_OPTIONS.map(opt => <option key={opt} value={opt} className="dark:bg-[#172133]">{opt}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0B5CD] pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#5C738A] dark:text-gray-400">Duration</label>
                  <input type="text" name="duration" placeholder="30 days" value={form.duration} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.duration ? "border-red-400" : "border-gray-200 dark:border-gray-700"} text-gray-700 dark:text-white bg-transparent focus:outline-none focus:border-[#6492C9] transition-colors placeholder-[#A0B5CD]`} />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#6492C9] hover:bg-[#304B71] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95">
                Generate QR
              </button>
            </form>
          </div>
        </div>

        {/* Right Column — Recent Prescriptions */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#172133] rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800 p-8 h-fit">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-8">Recent Prescriptions</h2>
            <div className="space-y-6">
              {prescriptions.length === 0 ? (
                 <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                       <FileText size={24} className="text-[#A0B5CD]" />
                    </div>
                    <p className="text-[#A0B5CD] text-sm font-medium">No recent prescriptions.</p>
                 </div>
              ) : (
                prescriptions.map((rx, idx) => (
                  <div key={rx.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
                        {getInitials(rx.patient?.firstName || "I", rx.patient?.lastName || "K")}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#0D2644] dark:text-white group-hover:text-[#6492C9] transition-colors">
                          {`${rx.patient?.firstName || "Unknwon"} ${rx.patient?.lastName || ""}`.trim()}
                        </h4>
                        <p className="text-[11px] font-medium text-[#5C738A] dark:text-gray-400">
                          {rx.medication} {rx.strength && `· ${rx.strength}`}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${STATUS_BADGES[rx.status] || STATUS_BADGES.Active}`}>
                      {rx.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
