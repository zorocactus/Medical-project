import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Heart, Stethoscope, Pill, Shield, Settings } from "lucide-react";

export default function GMProfile() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-[70rem] mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-[28px] font-bold text-white mb-2">Settings</h1>
        <p className="text-sm font-medium text-blue-400">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-6">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Alex Johnson"
                  className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue="alex@example.com"
                  className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">Phone</label>
                <input 
                  type="tel" 
                  defaultValue="+213 555 123 456"
                  className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">City</label>
                <input 
                  type="text" 
                  defaultValue="Alger"
                  className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="pt-2">
                <button className="px-6 py-2.5 bg-[#60A5FA] hover:bg-blue-400 text-[#0B0F16] text-sm font-bold rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-6">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">Current Password</label>
                <input 
                  type="password" 
                  defaultValue="........"
                  className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">New Password</label>
                <input 
                  type="password" 
                  defaultValue="........"
                  className="w-full bg-[#0B0F16] border border-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="pt-2">
                <button className="px-6 py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 text-sm font-bold rounded-lg transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-6">Notifications</h2>
            <div className="space-y-5">
               {[
                 "Medication reminders",
                 "Appointment confirmations",
                 "Analysis results ready",
                 "Dark mode",
                 "Emergency alerts"
               ].map((item, i) => (
                 <div key={i} className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={item === "Dark mode" ? theme === 'dark' : true}
                        onChange={item === "Dark mode" ? toggleTheme : undefined}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#60A5FA]"></div>
                      <span className="ml-4 text-xs font-bold text-gray-300">{item}</span>
                    </label>
                 </div>
               ))}
            </div>
          </div>

          {/* Switch Role View */}
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-2">Switch Role View</h2>
            <p className="text-xs text-gray-500 font-medium mb-6">Demo: switch between different role dashboards</p>
            <div className="space-y-2.5">
               <button className="w-full flex items-center p-3 rounded-lg border border-gray-800 hover:border-blue-500/30 bg-[#0B0F16] text-white transition-colors group">
                 <Heart size={16} className="text-red-400 mr-3" />
                 <span className="text-xs font-bold">Patient Dashboard</span>
               </button>
               <button className="w-full flex items-center p-3 rounded-lg border border-gray-800 hover:border-blue-500/30 bg-[#0B0F16] text-white transition-colors">
                 <Stethoscope size={16} className="text-blue-400 mr-3" />
                 <span className="text-xs font-bold">Doctor Dashboard</span>
               </button>
               <button className="w-full flex items-center p-3 rounded-lg border border-gray-800 hover:border-blue-500/30 bg-[#0B0F16] text-white transition-colors">
                 <Pill size={16} className="text-red-500 mr-3" />
                 <span className="text-xs font-bold">Pharmacist Dashboard</span>
               </button>
               <button className="w-full flex items-center p-3 rounded-lg border border-gray-800 hover:border-blue-500/30 bg-[#0B0F16] text-white transition-colors">
                 <Shield size={16} className="text-amber-400 mr-3" />
                 <span className="text-xs font-bold">Caretaker Dashboard</span>
               </button>
               <button className="w-full flex items-center p-3 rounded-lg border border-gray-800 hover:border-blue-500/30 bg-[#0B0F16] text-white transition-colors">
                 <Settings size={16} className="text-gray-400 mr-3" />
                 <span className="text-xs font-bold">Admin Dashboard</span>
               </button>
            </div>
          </div>

          {/* Language */}
          <div className="bg-[#141B27] rounded-xl border border-gray-800 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-6">Language / لغة</h2>
            <div className="flex gap-4">
              <button className="px-5 py-2.5 bg-[#60A5FA] text-[#0B0F16] text-xs font-bold rounded-lg transition-colors">
                FR Français
              </button>
              <button className="px-5 py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 text-xs font-bold rounded-lg transition-colors">
                العربية DZ
              </button>
              <button className="px-5 py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 text-xs font-bold rounded-lg transition-colors">
                GB English
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
