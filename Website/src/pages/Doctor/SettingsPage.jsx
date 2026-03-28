import { useState } from "react";
import { Heart, Moon, Sun, Bell, Shield, User, Globe, ChevronDown, Layout } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  
  const [form, setForm] = useState({
    fullName: "Alex Johnson",
    email: "alex@example.com",
    phone: "+213 555 123 456",
    city: "Alger"
  });

  const [notifications, setNotifications] = useState({
    medication: true,
    appointments: true,
    analysis: true,
    emergency: true
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const roles = [
    { name: "Patient Dashboard", icon: <Heart size={16} className="text-red-500" /> },
    { name: "Doctor Dashboard", icon: <Layout size={16} className="text-blue-500" /> },
    { name: "Pharmacist Dashboard", icon: <Globe size={16} className="text-orange-500" /> },
    { name: "Caretaker Dashboard", icon: <User size={16} className="text-amber-500" /> },
    { name: "Admin Dashboard", icon: <Shield size={16} className="text-blue-300" /> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-[#0D2644] dark:text-white mb-1">Settings</h1>
      <p className="text-[#5C738A] dark:text-gray-400 text-sm mb-8">Manage your account and preferences</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-[#172133] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-6">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">Full Name</label>
                <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white focus:outline-none focus:border-[#6492C9]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white focus:outline-none focus:border-[#6492C9]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white focus:outline-none focus:border-[#6492C9]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">City</label>
                <div className="relative">
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white focus:outline-none focus:border-[#6492C9] appearance-none">
                    <option>Alger</option>
                    <option>Oran</option>
                    <option>Constantine</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C738A]" />
                </div>
              </div>
              <button className="bg-[#6492C9] hover:bg-[#304B71] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2">Save Changes</button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-[#172133] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-6">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">Current Password</label>
                <input type="password" value="********" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C738A] dark:text-gray-400 mb-1.5">New Password</label>
                <input type="password" value="********" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-[#0D2644] dark:text-white" />
              </div>
              <button className="bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-[#0D2644] dark:text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mt-2">Update Password</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-white dark:bg-[#172133] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-6">Notifications</h2>
            <div className="space-y-5">
                <div key="darkMode" className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#5C738A] dark:text-gray-300">Dark mode</span>
                  <button 
                    onClick={toggleTheme}
                    className={`w-10 h-5 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-[#6492C9]' : 'bg-gray-200 dark:bg-gray-700'} relative flex items-center`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {[
                  { label: "Medication reminders", key: "medication" },
                  { label: "Appointment confirmations", key: "appointments" },
                  { label: "Analysis results ready", key: "analysis" },
                  { label: "Emergency alerts", key: "emergency" }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5C738A] dark:text-gray-300">{item.label}</span>
                    <button 
                      onClick={() => handleToggle(item.key)}
                      className={`w-10 h-5 rounded-full p-1 transition-colors ${notifications[item.key] ? 'bg-[#6492C9]' : 'bg-gray-200 dark:bg-gray-700'} relative flex items-center`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Switch Role View */}
          <div className="bg-white dark:bg-[#172133] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-2">Switch Role View</h2>
            <div className="space-y-2">
              {roles.map((role, i) => (
                <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${i === 4 ? 'border-[#6492C9] bg-[#F0F6FF] dark:bg-[#1E2D4A]' : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'} transition-colors`}>
                  {role.icon}
                  <span className={`text-[13px] font-medium ${i === 4 ? 'text-[#6492C9]' : 'text-[#0D2644] dark:text-gray-100'}`}>{role.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-[#172133] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-[17px] font-bold text-[#0D2644] dark:text-white mb-6">Language / اللغة</h2>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#6492C9] text-white py-2.5 rounded-xl text-xs font-bold transition-transform hover:scale-[1.02]">FR Français</button>
              <button className="flex-1 border border-gray-100 dark:border-gray-700 text-[#0D2644] dark:text-white py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-transform">العربية DZ</button>
              <button className="flex-1 border border-gray-100 dark:border-gray-700 text-[#0D2644] dark:text-white py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-transform">GB English</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
