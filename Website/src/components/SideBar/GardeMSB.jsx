import { useState, useEffect, useRef } from "react";
import {
  BriefcaseMedical,
  LayoutGrid,
  Users,
  Calendar,
  ClipboardList,
  Pill,
  Briefcase,
  User,
  ShoppingBag,
  FileText,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react";

export default function GardeMSidebar() {
  const [active, setActive] = useState("Dashboard");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  // Popup closes when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "My Patients", icon: Users },
    { name: "Schedule", icon: Calendar },
    { name: "Tasks", icon: ClipboardList },
    { name: "Medications", icon: Pill },
    { name: "Job Requests", icon: Briefcase },
    { name: "PatientProfile", icon: User },
    { name: "Pharmacy", icon: ShoppingBag },
    { name: "Prescriptions", icon: FileText },
  ];

  return (
    <aside className="w-auto h-auto bg-white border-r border-[#F1F5F9] flex flex-col py-5 px-6 fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-6 px-2 cursor-pointer hover:scale-105 transition-all duration-300 group">
        <div className="text-[#FCD34D]">
          <BriefcaseMedical
            size={36}
            strokeWidth={2.5}
            className="transition-all duration-300 group-hover:-rotate-15"
          />
        </div>
        <span className="text-[26px] font-bold text-[#FCD34D] tracking-tight">
          MedSmart
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[22px] transition-all duration-300 group cursor-pointer hover:scale-105 ${
              active === item.name
                ? "bg-linear-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-[#F59E0B]/30"
                : "text-[#64748B] hover:bg-[#FFFBEB] hover:text-[#F59E0B]"
            }`}
          >
            <div
              className={`${active === item.name ? "text-white" : "text-[#64748B] group-hover:text-[#F59E0B]"}`}
            >
              <item.icon
                size={24}
                strokeWidth={active === item.name ? 2.5 : 2}
              />
            </div>
            <span
              className={`text-[17px] ${active === item.name ? "font-semibold" : "font-medium"}`}
            >
              {item.name}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions & Profile */}
      <div className="-mt-9 flex flex-col gap-4">
        {/* Profile Block */}
        <div ref={profileRef} className="relative mt-15">
          {/* Popup menu */}
          {profileMenuOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 bg-white
                            rounded-[16px] shadow-lg border border-gray-100
                            overflow-hidden animate-in slide-in-from-bottom
                            duration-500 z-50"
            >
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-[#F8FAFC] transition-all cursor-pointer group">
                <User size={16} className="group-hover:scale-110 transition-transform"/> Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-[#F8FAFC] transition-all cursor-pointer group">
                <Settings size={16} className="group-hover:rotate-45 transition-transform"/> Settings
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all cursor-pointer group">
                <LogOut size={16} className="group-hover:translate-x-1 transition-transform"/> Logout
              </button>
            </div>
          )}

          {/* Trigger */}
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-[16px]
                       bg-[#2D1F0A] hover:bg-[#3D2B0E] transition-all cursor-pointer hover:scale-105 "
          >
            {/* Avatar circle with initials */}
            <div
              className="w-9 h-9 rounded-full bg-[#D97706] flex items-center
                            justify-center text-white text-sm font-semibold shrink-0"
            >
              YS
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                Yassir Pahh
              </p>
              <p className="text-xs text-white/60">Garde Malade</p>
            </div>
            <ChevronUp
              size={16}
              className={`ml-auto text-white/60 transition-transform
              duration-200 ${profileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
