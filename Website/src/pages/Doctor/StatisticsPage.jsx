import { Users, FileText, Star, Activity, ChevronDown, ArrowUp } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function StatisticsPage() {
  const { patients, appointments, prescriptions } = useData();

  const stats = [
    {
      label: "Consultations",
      value: appointments.length || 312,
      trend: "+8%",
      trendColor: "text-emerald-500",
      icon: <Users size={22} className="text-emerald-500" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      label: "Prescriptions",
      value: prescriptions.length || 94,
      trend: "12 this month",
      trendColor: "text-emerald-500",
      icon: <FileText size={22} className="text-blue-500" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      label: "Avg rating",
      value: "4.8",
      trend: "Top 5% Cardiology",
      trendColor: "text-emerald-500",
      icon: <Star size={22} className="text-amber-500" fill="currentColor" />,
      iconBg: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      label: "Show-up rate",
      value: "96%",
      trend: "+2%",
      trendColor: "text-emerald-500",
      icon: <Activity size={22} className="text-emerald-500" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20"
    }
  ];

  const dailyData = [
    { day: 15, value: 35 }, { day: 16, value: 55 }, { day: 17, value: 28 }, 
    { day: 18, value: 78 }, { day: 19, value: 45 }, { day: 20, value: 85 }, 
    { day: 21, value: 65 }, { day: 22, value: 48 }, { day: 23, value: 72 }, 
    { day: 24, value: 58 },
  ];

  const consultationTypes = [
    { label: "In-Person", percentage: 68, color: "bg-[#6492C9]" },
    { label: "Teleconsultation", percentage: 24, color: "bg-emerald-500" },
    { label: "Home Visit", percentage: 8, color: "bg-amber-500" }
  ];

  return (
    <div className="animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2644] dark:text-white mb-1">Statistics</h1>
          <p className="text-[#5C738A] dark:text-gray-400 text-sm font-medium">Performance overview — October 2023</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#172133] text-sm font-semibold text-[#0D2644] dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
          Last 30 days <ChevronDown size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#172133] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0D2644] dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-[#5C738A] dark:text-gray-300">{stat.label}</div>
              <div className={`text-[12px] font-bold mt-2 flex items-center gap-1 ${stat.trendColor}`}>
                {stat.trend.startsWith('+') && <ArrowUp size={14} strokeWidth={3} />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#172133] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-8">Consultations per Day</h2>
          <div className="flex items-end justify-between h-48 gap-2 mb-2">
            {dailyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                <div 
                  className="w-full bg-[#6492C9]/40 hover:bg-[#6492C9] transition-all rounded-md cursor-pointer relative group"
                  style={{ height: `${data.value}%` }}
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0D2644] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.day} Oct: {data.value}
                    </div>
                </div>
                <span className="text-[11px] font-bold text-[#A0B5CD] dark:text-gray-500">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#172133] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-8">Consultation Types</h2>
          <div className="space-y-8">
            {consultationTypes.map((type, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-[#5C738A] dark:text-gray-400">{type.label}</span>
                  <span className="text-[#0D2644] dark:text-white">{type.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-50 dark:bg-gray-800 overflow-hidden">
                  <div className={`h-full rounded-full ${type.color} transition-all duration-1000`} style={{ width: `${type.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
