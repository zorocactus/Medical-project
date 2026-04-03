import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  ChevronRight,
  User,
  AlertCircle
} from "lucide-react";

const SAMPLE_REQUESTS = [
  {
    id: 1,
    patientName: "Nadia Khelifa",
    age: 58,
    location: "Algiers Center (2.5 km away)",
    condition: "Diabetes T2 Monitoring",
    duration: "Full-time (8h/day)",
    pay: "45,000 DA/month",
    posted: "2 hours ago",
    urgency: "Normal",
    initials: "NK"
  },
  {
    id: 2,
    patientName: "Youcef Belaid",
    age: 72,
    location: "El Biar (4.8 km away)",
    condition: "Post-cardiac surgery care",
    duration: "Night shift (10h)",
    pay: "55,000 DA/month",
    posted: "5 hours ago",
    urgency: "High",
    initials: "YB"
  },
  {
    id: 3,
    patientName: "Meriem Kaci",
    age: 32,
    location: "Sidi Yahia (1.2 km away)",
    condition: "Temporary disability support",
    duration: "Part-time (4h/day)",
    pay: "28,000 DA/month",
    posted: "Yesterday",
    urgency: "Normal",
    initials: "MK"
  }
];

export default function JobRequests() {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2644] dark:text-white mb-1">Job Requests</h1>
          <p className="text-[#5C738A] dark:text-gray-400 text-sm font-medium">New caregiving opportunities in your area</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#638ECB]/10 rounded-xl border border-[#638ECB]/20 text-[#638ECB] font-bold text-sm">
          <Users size={16} /> {SAMPLE_REQUESTS.length} Requests Found
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {["All Shifts", "Full-time", "Part-time", "Night Shift", "Short-term"].map((filter, i) => (
          <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            i === 0 
              ? "bg-[#638ECB] text-white shadow-md shadow-blue-500/20" 
              : "bg-white dark:bg-[#172133] border border-gray-100 dark:border-gray-800 text-[#5C738A] dark:text-gray-400 hover:bg-gray-50"
          }`}>
            {filter}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {SAMPLE_REQUESTS.map((req) => (
          <div key={req.id} className="bg-white dark:bg-[#172133] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Patient Initials/Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#638ECB]/10 text-[#638ECB] flex items-center justify-center font-bold text-xl border border-[#638ECB]/20 group-hover:bg-[#638ECB] group-hover:text-white transition-all duration-300">
                  {req.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0D2644] dark:text-white">{req.patientName}</h3>
                  <p className="text-sm font-medium text-[#5C738A] dark:text-gray-400">{req.age} years · {req.condition}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 flex-1 border-y lg:border-y-0 lg:border-x border-gray-100 dark:border-gray-800 py-4 lg:py-0 lg:px-8">
                <div className="flex items-center gap-3 text-sm text-[#5C738A] dark:text-gray-400 font-medium">
                  <MapPin size={16} className="text-[#638ECB]" />
                  {req.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5C738A] dark:text-gray-400 font-medium">
                  <Clock size={16} className="text-[#638ECB]" />
                  {req.duration}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-[#0D2644] dark:text-gray-200">
                  <Calendar size={16} className="text-[#638ECB]" />
                  {req.pay}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider h-fit mr-4 ${
                  req.urgency === 'High' ? 'bg-red-50 text-red-500 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30' : 'bg-blue-50 text-blue-500 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30'
                }`}>
                  {req.urgency}
                </div>
                <button className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl bg-[#638ECB] hover:bg-[#395886] text-white font-bold text-sm transition-all shadow-md active:scale-95">
                  View Details
                </button>
                <div className="flex items-center gap-2">
                   <button className="w-10 h-10 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all dark:bg-emerald-900/20 dark:border-emerald-900/30">
                     <Check size={18} />
                   </button>
                   <button className="w-10 h-10 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all dark:bg-red-900/20 dark:border-red-900/30">
                     <X size={18} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Empty State or Info */}
      <div className="bg-[#638ECB] rounded-3xl p-8 relative overflow-hidden group">
        {/* Abstract background art */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-[-100px] left-[-30px] w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shrink-0">
            <AlertCircle size={40} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Want to see more relevant requests?</h2>
            <p className="text-white/80 text-sm max-w-xl">Complete your verification and upload your medical qualifications to gain access to premium care roles and higher pay offers.</p>
          </div>
          <button className="md:ml-auto px-6 py-3 bg-white text-[#395886] font-bold rounded-xl text-sm shadow-xl hover:bg-[#F5F7FB] transition-all whitespace-nowrap active:scale-95">
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
