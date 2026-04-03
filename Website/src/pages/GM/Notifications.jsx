import { 
  Bell, 
  Pill, 
  Calendar, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  X,
  User,
  Heart
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function GMNotifications() {
  const { gmPatients: patients } = useData();

  const notifications = patients.length === 0 ? [] : [
    {
      id: 1,
      type: "medication",
      title: "Medication Reminder",
      desc: "Take Lisinopril 10mg now",
      time: "2 minutes ago",
      icon: <Pill className="text-red-400" />,
      unread: true
    },
    {
      id: 2,
      type: "appointment",
      title: "Appointment Confirmed",
      desc: "Dr. Benali confirmed your appointment for Oct 25",
      time: "1 hour ago",
      icon: <Calendar className="text-blue-400" />,
      unread: true
    },
    {
      id: 3,
      type: "analysis",
      title: "Analysis Results Available",
      desc: "Lipid Profile results are ready to view",
      time: "Yesterday",
      icon: <Activity className="text-gray-400" />,
      unread: false
    },
    {
      id: 4,
      type: "system",
      title: "Caregiver Update",
      desc: "Fatima B. completed today's medication round",
      time: "3 hours ago",
      icon: <Heart className="text-blue-400" />,
      unread: false
    },
    {
      id: 5,
      type: "emergency",
      title: "Prescription Expiring Soon",
      desc: "Your Metformin prescription expires in 5 days",
      time: "2 days ago",
      icon: <AlertCircle className="text-red-400" />,
      unread: false
    }
  ];

  const filters = ["All", "Medications", "Appointments", "Emergencies", "System"];

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-500 font-medium tracking-tight">Stay updated with your health alerts</p>
        </div>
        <button className="px-5 py-2.5 bg-[#1F2937] hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-gray-700 shadow-lg active:scale-95">
          Mark all as read
        </button>
      </header>

      {/* Filter Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {filters.map((filter, i) => (
          <button 
            key={i}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
              i === 0 
                ? "bg-[#3B82F6] text-white border-blue-500 shadow-lg shadow-blue-500/20" 
                : "bg-[#1F2937] text-gray-400 border-gray-700 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="group relative bg-[#141B27] rounded-2xl p-6 border border-gray-800 hover:border-blue-500/20 transition-all flex items-center justify-between cursor-pointer">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#1F2937] border border-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                   {notif.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    {notif.title}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-1">{notif.desc}</p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">{notif.time}</p>
                </div>
             </div>

             <div className="flex items-center gap-4">
                {notif.unread && (
                  <div className="w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/40"></div>
                )}
                <button className="p-2 text-gray-700 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                   <X size={16} />
                </button>
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
