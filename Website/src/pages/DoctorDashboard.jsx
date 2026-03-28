import { useState } from "react";
import { Users, User, FileText, Star, Bell, Moon, Sun, Heart, Check, X, ArrowUp, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import SchedulePage from "./Doctor/SchedulePage";
import PatientsPage from "./Doctor/PatientsPage";
import PrescriptionsPage from "./Doctor/PrescriptionsPage";
import StatisticsPage from "./Doctor/StatisticsPage";
import SettingsPage from "./Doctor/SettingsPage";

export default function DoctorDashboard() {
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const { user } = useAuth();
  const { patients, appointments, patientRequests } = useData();

  const doctorName = user?.firstName && user?.lastName 
    ? `Dr. ${user.firstName} ${user.lastName}` 
    : "Dr. Benali Karim";
  const doctorRole = user?.specialty || user?.role || "Cardiologist";
  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "BK";

  const navLinks = [
    "Dashboard", "Schedule", "Patients", "Prescriptions", "Statistics", "Settings"
  ];

  const scheduleTasks = appointments.length > 0 ? appointments : [
    { time: "08:00", duration: "0", title: "", color: "blue", isEmpty: true },
    { time: "09:00", duration: "0", title: "", color: "blue", isEmpty: true },
    { time: "10:00", duration: "0", title: "", color: "blue", isEmpty: true },
    { time: "10:30", duration: "0", title: "", color: "blue", isEmpty: true },
    { time: "11:30", duration: "0", title: "", color: "blue", isEmpty: true },
    { time: "14:00", duration: "0", title: "", color: "blue", isEmpty: true },
    { time: "15:30", duration: "0", title: "", color: "blue", isEmpty: true },
    { time: "17:00", duration: "0", title: "", color: "blue", isEmpty: true }
  ];

  const getColorClasses = (color) => {
    switch(color) {
      case "blue": return "bg-[#F3F7FA] dark:bg-[#1E2D4A] border-l-[3px] border-[#6492C9] text-[#365885] dark:text-blue-300";
      case "green": return "bg-emerald-50 dark:bg-emerald-900/20 border-l-[3px] border-emerald-500 text-emerald-700 dark:text-emerald-400";
      case "yellow": return "bg-amber-50 dark:bg-amber-900/20 border-l-[3px] border-amber-500 text-amber-700 dark:text-amber-400";
      default: return "bg-gray-50 dark:bg-gray-800 border-l-[3px] border-gray-300 text-gray-700 dark:text-gray-400";
    }
  };

  const renderContent = () => {
    switch(currentPage) {
      case "Schedule": return <SchedulePage onNavigate={setCurrentPage} />;
      case "Patients": return <PatientsPage onNavigate={setCurrentPage} />;
      case "Prescriptions": return <PrescriptionsPage onNavigate={setCurrentPage} />;
      case "Statistics": return <StatisticsPage onNavigate={setCurrentPage} />;
      case "Settings": return <SettingsPage onNavigate={setCurrentPage} />;
      default: return (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#0D2644] dark:text-white mb-1">Doctor Dashboard</h1>
              <p className="text-[#5C738A] dark:text-gray-400 text-sm font-medium">Wednesday, October 24, 2023</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-white dark:bg-[#172133] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-[#5C738A] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Bell size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1E90FF] text-white font-bold text-sm flex items-center justify-center shadow-sm hover:bg-blue-600 transition-colors">
                {initials}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-[#172133] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                <Users size={24} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0D2644] dark:text-white mb-1">{appointments.length > 0 ? 12 : 0}</h3>
                <p className="text-sm font-medium text-[#0D2644] dark:text-gray-300">Today's Consultations</p>
                <p className="text-xs font-semibold text-emerald-500 mt-2 flex items-center gap-1">
                  {appointments.length > 0 && <><ArrowUp size={14} strokeWidth={2.5} /> 3 more than yesterday</>}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#172133] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <User size={24} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0D2644] dark:text-white mb-1">{patients.length > 0 ? 847 : 0}</h3>
                <p className="text-sm font-medium text-[#0D2644] dark:text-gray-300">Total Patients</p>
                <p className="text-xs font-semibold text-emerald-500 mt-2 flex items-center gap-1">
                  {patients.length > 0 && <><ArrowUp size={14} strokeWidth={2.5} /> 12 this month</>}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#172133] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <FileText size={24} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0D2644] dark:text-white mb-1">{patients.length > 0 ? 94 : 0}</h3>
                <p className="text-sm font-medium text-[#0D2644] dark:text-gray-300">Prescriptions This Month</p>
                <p className="text-xs font-semibold text-emerald-500 mt-2 flex items-center gap-1">
                   {patients.length > 0 && <><ArrowUp size={14} strokeWidth={2.5} /> 8 vs last month</>}
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-[#172133] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                <Star size={24} className="text-orange-400" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0D2644] dark:text-white mb-1">{patients.length > 0 ? "4.8" : "-"}</h3>
                <p className="text-sm font-medium text-[#0D2644] dark:text-gray-300">Average Rating</p>
                <p className="text-xs font-semibold text-emerald-500 mt-2 flex items-center gap-1">
                  {patients.length > 0 && "Top 5% in Cardiology"}
                </p>
              </div>
            </div>
          </div>

          {/* 2 Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Schedule */}
            <div className="w-full lg:w-2/3 bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white">Today's Schedule</h2>
                <span className="bg-[#F3F7FA] dark:bg-[#1E2D4A] text-[#6492C9] text-xs font-bold px-3 py-1.5 rounded-full border border-blue-50 dark:border-blue-900/30">
                  {appointments.length} appointments
                </span>
              </div>

              <div className="space-y-4">
                {scheduleTasks.map((task, idx) => (
                  <div key={idx} className="flex min-h-[48px]">
                    {/* Time */}
                    <div className="w-16 shrink-0 text-sm font-medium text-[#5C738A] dark:text-gray-400 pt-3">
                      {task.time}
                    </div>
                    {/* Slot */}
                    <div className="flex-1 border-b border-gray-50 dark:border-gray-800 flex pb-4">
                      {!task.isEmpty ? (
                         <div className={`w-full rounded-lg px-4 flex justify-center flex-col ${task.color === 'blue' ? 'bg-[#F3F7FA] dark:bg-[#1E2D4A] border-l-[3px] border-[#6492C9] text-[#365885] dark:text-blue-300' : getColorClasses(task.color)}`}>
                           <span className="font-semibold text-[13px]">{task.title}</span>
                         </div>
                      ) : (
                        <div className="w-full pl-4 pt-3 border-l-[3px] border-transparent">
                          <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              
              {/* Quick Prescription */}
              <div className="bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
                <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-6">Quick Prescription</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">Patient</label>
                    <select className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white focus:outline-none focus:border-[#6492C9] appearance-none cursor-pointer">
                      {patients.length > 0 ? (
                        patients.map((p, i) => <option key={i}>{p.name}</option>)
                      ) : (
                        <option>No patients available</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">Medication</label>
                    <input type="text" placeholder="e.g. Metformin 500mg" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white placeholder-[#A0B5CD] focus:outline-none focus:border-[#6492C9]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">Dosage</label>
                      <input type="text" placeholder="1 tablet" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white focus:outline-none focus:border-[#6492C9]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">Duration</label>
                      <input type="text" placeholder="30 days" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white focus:outline-none focus:border-[#6492C9]" />
                    </div>
                  </div>

                  <button className="w-full mt-2 bg-[#6492C9] hover:bg-[#304B71] text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <span className="text-lg leading-none mb-0.5">+</span> Generate QR Prescription
                  </button>
                </div>
              </div>

              {/* Patient Requests */}
              <div className="bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white">Patient Requests</h2>
                   <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">
                    {patientRequests.length} pending
                   </span>
                </div>

                <div className="space-y-4">
                  {patientRequests.length > 0 ? (
                    patientRequests.map((req, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1E90FF] text-white flex items-center justify-center text-xs font-bold">
                            {req.initials}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#0D2644] dark:text-white">{req.name}</h4>
                            <p className="text-[11px] font-medium text-[#5C738A] dark:text-gray-400">{req.detail}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="w-7 h-7 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors">
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button className="w-7 h-7 rounded-md bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors">
                            <X size={14} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm font-medium text-[#5C738A] dark:text-gray-400 text-center py-4">No pending requests</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] font-sans transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="bg-white dark:bg-[#172133] border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="text-[#365885]">
            <Heart size={24} fill="currentColor" />
          </div>
          <span className="font-bold text-xl text-[#0D2644] dark:text-white">MedSmart</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button 
              key={link}
              onClick={() => setCurrentPage(link)}
              className={`text-[15px] font-medium transition-colors ${
                link === currentPage ? "text-[#6492C9]" : "text-[#5C738A] dark:text-gray-400 hover:text-[#0D2644] dark:hover:text-white"
              }`}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-[#365885]' : 'bg-gray-200'} relative flex items-center`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center`}>
              {theme === 'dark' ? <Moon size={10} className="text-[#365885]" /> : <Sun size={10} className="text-[#A0B5CD]" />}
            </div>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#304B71] text-white flex items-center justify-center text-xs font-bold">{initials}</div>
            <div className="text-right hidden sm:block">
              <div className="text-[13px] font-semibold text-[#0D2644] dark:text-gray-100 leading-tight">{doctorName}</div>
              <div className="text-[13px] text-[#5C738A] dark:text-gray-400 leading-tight">{doctorRole}</div>
            </div>
            <ChevronDown size={14} className="text-[#5C738A]" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
