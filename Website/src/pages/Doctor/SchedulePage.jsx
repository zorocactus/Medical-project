import { useState } from "react";
import { Bell, Check, X, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const DAYS = [
  { day: "MON", date: 21 },
  { day: "TUE", date: 22 },
  { day: "WED", date: 23 },
  { day: "THU", date: 24 },
  { day: "FRI", date: 25 },
  { day: "SAT", date: 26 },
  { day: "SUN", date: 27 },
];

const SAMPLE_APPOINTMENTS = [
  { time: "08:00", patient: "Ahmed Meziane, 45", detail: "Follow-up · Hypertension", type: "in-person" },
  { time: "08:45", patient: "Meriem Kaci, 32", detail: "First visit · Chest pain", type: "in-person" },
  { time: "09:30", patient: "", detail: "", type: "empty" },
  { time: "10:00", patient: "Nadia Khelifa, 58", detail: "Teleconsultation · Diabetes", type: "tele" },
  { time: "10:30", patient: "Alex Johnson, 36", detail: "Follow-up · Lipid profile", type: "in-person" },
  { time: "12:00", patient: "Lunch break", detail: "", type: "break" },
  { time: "14:00", patient: "Youcef Belaid, 72", detail: "Home visit · Cardiac rehab", type: "home" },
  { time: "15:00", patient: "Sara Ait Ahmed, 29", detail: "Teleconsultation · Asthma", type: "tele" },
];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(24);
  const { appointments, patientRequests } = useData();

  const timelineItems = appointments.length > 0 ? appointments : SAMPLE_APPOINTMENTS;
  const pendingRequests = patientRequests;

  const getTypeStyle = (type) => {
    switch (type) {
      case "tele": return "bg-emerald-50 dark:bg-emerald-900/20 border-l-[3px] border-emerald-500";
      case "home": return "bg-amber-50 dark:bg-amber-900/20 border-l-[3px] border-amber-500";
      case "in-person": return "bg-[#F3F7FA] dark:bg-[#1E2D4A] border-l-[3px] border-[#6492C9]";
      case "break": return "text-[#A0B5CD] dark:text-gray-500 italic";
      default: return "";
    }
  };

  const getTextStyle = (type) => {
    switch (type) {
      case "tele": return "text-emerald-700 dark:text-emerald-400";
      case "home": return "text-amber-700 dark:text-amber-400";
      case "in-person": return "text-[#365885] dark:text-blue-300";
      case "break": return "text-[#A0B5CD] dark:text-gray-500";
      default: return "text-[#5C738A] dark:text-gray-400";
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2644] dark:text-white mb-1">My Schedule</h1>
          <p className="text-[#5C738A] dark:text-gray-400 text-sm font-medium">
            Thursday, October 24 · {appointments.length > 0 ? appointments.length : "12"} appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#172133] text-sm font-medium text-[#5C738A] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Week
          </button>
          <button className="px-4 py-2 rounded-xl bg-[#6492C9] hover:bg-[#304B71] text-white text-sm font-semibold flex items-center gap-1 transition-colors">
            <Plus size={16} /> Add Slot
          </button>
        </div>
      </div>

      {/* Week Calendar Strip */}
      <div className="bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
        <div className="flex items-center justify-center gap-2">
          {DAYS.map(({ day, date }) => (
            <button
              key={date}
              onClick={() => setSelectedDay(date)}
              className={`flex flex-col items-center px-5 py-3 rounded-xl transition-all ${
                selectedDay === date
                  ? "bg-[#6492C9] text-white shadow-md"
                  : "hover:bg-[#F3F7FA] dark:hover:bg-[#1E2D4A] text-[#5C738A] dark:text-gray-400"
              }`}
            >
              <span className={`text-[11px] font-semibold mb-1 ${selectedDay === date ? "text-white/80" : "text-[#A0B5CD] dark:text-gray-500"}`}>{day}</span>
              <span className="text-[18px] font-bold">{date}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Timeline */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white">Today's Timeline</h2>
          </div>

          <div className="space-y-3">
            {timelineItems.map((item, idx) => (
              <div key={idx} className="flex min-h-[52px] items-start gap-4">
                <div className="w-14 shrink-0 text-sm font-semibold text-[#5C738A] dark:text-gray-400 pt-3">{item.time}</div>
                <div className="flex-1">
                  {item.type === "empty" ? (
                    <div className="h-full border-b border-gray-50 dark:border-gray-800 pb-3">
                      <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mt-3"></div>
                    </div>
                  ) : item.type === "break" ? (
                    <div className="py-3 text-[#A0B5CD] dark:text-gray-500 text-sm italic">{item.patient}</div>
                  ) : (
                    <div className={`rounded-xl px-4 py-3 ${getTypeStyle(item.type)}`}>
                      <p className={`font-semibold text-[14px] ${getTextStyle(item.type)}`}>{item.patient}</p>
                      {item.detail && <p className={`text-[12px] mt-0.5 opacity-80 ${getTextStyle(item.type)}`}>{item.detail}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-5">Pending Requests</h2>
            <div className="space-y-4">
              {pendingRequests.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E90FF] text-white flex items-center justify-center text-xs font-bold">{req.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-[#0D2644] dark:text-white">{req.name}</p>
                      <p className="text-[11px] text-[#5C738A] dark:text-gray-400 font-medium">{req.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 rounded-md bg-emerald-500 text-white flex items-center justify-center"><Check size={14} /></button>
                    <button className="w-7 h-7 rounded-md bg-red-500 text-white flex items-center justify-center"><X size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
