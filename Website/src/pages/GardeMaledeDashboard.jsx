import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  Bell, 
  Settings,
  Moon,
  Sun,
  ChevronDown,
  Heart
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Import GM sub-pages
import GMDashboard from "./GM/Dashboard";
import MyPatients from "./GM/MyPatients";
import GMTreatments from "./GM/Treatments";
import GMEmergencies from "./GM/Emergencies";
import GMNotifications from "./GM/Notifications";
import GMProfile from "./GM/Profile"; // Used as Settings

export default function GardeMaledeDashboard() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const caregiverName = user?.firstName || "Fatima";
  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : "Fatima Benali";
  
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase() || "FB";

  const navLinks = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "My Patients", icon: <Users size={18} /> },
    { name: "Treatments", icon: <ClipboardList size={18} /> },
    { name: "Emergencies", icon: <AlertTriangle size={18} /> },
    { name: "Notifications", icon: <Bell size={18} />, badge: 1 },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case "Dashboard": return <GMDashboard />;
      case "My Patients": return <MyPatients />;
      case "Treatments": return <GMTreatments />;
      case "Emergencies": return <GMEmergencies />;
      case "Notifications": return <GMNotifications />;
      case "Settings": return <GMProfile />;
      default: return <GMDashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-[#0B0F16]" : "bg-[#F5F7FB]"} font-sans transition-colors duration-300`}>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 flex items-center h-16 px-8 bg-[#141B27] border-b border-gray-800 text-white">
        <div className="flex items-center gap-2 mr-12">
          <div className="flex items-center justify-center w-8 h-8 text-white rounded-lg bg-[#395886]">
            <Heart size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight">MedSmart</span>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setCurrentPage(link.name)}
              className={`relative flex items-center gap-2 text-sm font-medium transition-all py-1 ${
                currentPage === link.name 
                  ? "text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.name}
              {link.badge && (
                <span className="flex items-center justify-center w-4 h-4 bg-red-500 text-[10px] font-bold rounded-full text-white ml-0.5 shadow-sm">
                  {link.badge}
                </span>
              )}
              {currentPage === link.name && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 bg-[#1F2937] text-gray-400 rounded-lg hover:text-white transition-all border border-gray-700"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
            <div className="flex items-center justify-center w-9 h-9 text-sm font-bold bg-[#3B82F6] rounded-full ring-2 ring-gray-800 ring-offset-2 ring-offset-[#141B27]">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-gray-100">{fullName}</p>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide flex items-center gap-1">
                Caregiver <ChevronDown size={10} />
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto p-8 animate-in fade-in duration-500">
        {renderContent()}
      </main>
    </div>
  );
}
