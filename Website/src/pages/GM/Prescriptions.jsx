import { 
  FileText, 
  Search, 
  QrCode, 
  Calendar, 
  User, 
  Download, 
  Eye, 
  Pill,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";

const SAMPLE_PRESCRIPTIONS = [
  {
    id: "#RX-4482",
    date: "24 Oct 2023",
    doctor: "Dr. Kamel Benali",
    specialty: "Cardiologist",
    patient: "Ahmed Meziane",
    status: "Active",
    medications: [
      { name: "Metformin", dosage: "500mg", freq: "Twice daily" },
      { name: "Aspirin", dosage: "75mg", freq: "Once daily" }
    ]
  },
  {
    id: "#RX-3921",
    date: "12 Sep 2023",
    doctor: "Dr. Sara Meziane",
    specialty: "General Practitioner",
    patient: "Ahmed Meziane",
    status: "Expired",
    medications: [
      { name: "Amoxicillin", dosage: "1g", freq: "Three times daily" }
    ]
  }
];

export default function GMPrescriptions() {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2644] dark:text-white mb-1">Prescriptions</h1>
          <p className="text-[#5C738A] dark:text-gray-400 text-sm font-medium">Valid medical orders for your assigned patient</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by RX ID or Doctor..." className="pl-10 pr-4 py-2 bg-white dark:bg-[#172133] border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:border-[#638ECB] w-full md:w-64" />
          </div>
          <button className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-[#172133] text-[#638ECB] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active Prescription Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
             <div className="bg-[#638ECB]/5 border-b border-gray-50 dark:border-gray-800/50 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#141B27] flex items-center justify-center text-[#638ECB] shadow-sm border border-gray-100 dark:border-gray-800">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0D2644] dark:text-white">Active Prescription</h2>
                    <p className="text-xs font-bold text-[#638ECB] tracking-widest uppercase mt-0.5">ID: #RX-4482 · ISSUED 24 OCT</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 border border-emerald-100 dark:border-emerald-900/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Validated
                </div>
             </div>

             <div className="p-8 space-y-8">
                {/* Doctor Info */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-[#638ECB] flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0D2644] dark:text-gray-100">Dr. Kamel Benali</p>
                      <p className="text-[11px] font-medium text-[#5C738A] dark:text-gray-400">Cardiologist · MedSmart Verified</p>
                    </div>
                  </div>
                  <button className="p-2 text-[#638ECB] hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                    <ExternalLink size={16} />
                  </button>
                </div>

                {/* Medications List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#5C738A] dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Pill size={14} /> Prescribed Medications
                  </h3>
                  {SAMPLE_PRESCRIPTIONS[0].medications.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#638ECB]/30 transition-all">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0D2644] dark:text-gray-100">{med.name} <small className="text-[#638ECB] opacity-70">({med.dosage})</small></span>
                        <span className="text-xs font-medium text-gray-400 mt-1">{med.freq}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-[#638ECB]/10 text-[#638ECB] rounded-lg text-[11px] font-bold hover:bg-[#638ECB] hover:text-white transition-all">
                          Administer Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Patient / Notes Area */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                  <h4 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Clock size={12} /> Instructions from Doctor
                  </h4>
                  <p className="text-xs font-medium text-amber-700/80 dark:text-amber-500/80 leading-relaxed italic">
                    "Ensure patient takes medication with water. Administer Metformin exactly at 08:00 and 20:00. Monitor for any dizziness or nausea after Aspirin intake."
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column - QR & History */}
        <div className="lg:col-span-1 space-y-6">
          {/* QR Verification Card */}
          <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm text-center space-y-6">
             <div className="mx-auto w-48 h-48 p-4 bg-white rounded-2xl border-4 border-gray-50 shadow-inner flex items-center justify-center relative group">
                {/* Fake QR Rendering */}
                <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                  <QrCode size={120} className="text-white opacity-90" />
                </div>
                <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-all duration-500 rounded-2xl"></div>
             </div>
             <div>
                <h3 className="text-lg font-bold text-[#0D2644] dark:text-white mb-2">Pharmacy Verification</h3>
                <p className="text-xs font-medium text-[#5C738A] dark:text-gray-400 leading-relaxed">
                  Use this QR code at any MedSmart-partnered pharmacy to verify the prescription and pick up medications.
                </p>
             </div>
             <button className="w-full py-3 bg-[#395886] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#0D2644] transition-all shadow-lg active:scale-95">
                <Download size={16} /> Save QR to Gallery
             </button>
          </div>

          {/* History List */}
          <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
             <h3 className="text-sm font-bold text-[#0D2644] dark:text-white mb-6 uppercase tracking-wider">RX History</h3>
             <div className="space-y-6">
                {SAMPLE_PRESCRIPTIONS.slice(1).map((rx, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 text-gray-400 group-hover:text-[#638ECB] flex items-center justify-center transition-all border border-gray-100 dark:border-gray-700 group-hover:border-blue-100">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0D2644] dark:text-gray-200 group-hover:text-[#638ECB]">{rx.id}</p>
                        <p className="text-[10px] font-medium text-gray-400">{rx.date}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{rx.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
