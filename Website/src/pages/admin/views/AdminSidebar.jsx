// src/pages/admin/views/AdminSidebar.jsx
import {
  LayoutDashboard, Users, Pill, Heart, Shield, Settings,
  UserCheck, Calendar, ShoppingBag, X,
  LogOut, Stethoscope, User, Activity, ListFilter,
  Building2, ClipboardList
} from "lucide-react";
import { getAdminTheme } from "../adminTheme.js";

// ─── Navigation structure (HMS groups) ───────────────────────────────────────
const NAV_SECTIONS = [
  {
    title: "MENU",
    items: [
      { id: "overview",     label: "Dashboard",       icon: LayoutDashboard },
    ],
  },
  {
    title: "PEOPLE",
    items: [
      { id: "utilisateurs", label: "Tous les users",  icon: Users },
      { id: "patients",     label: "Patients",         icon: User },
      { id: "doctors",      label: "Médecins",         icon: Stethoscope },
      { id: "caretakers",   label: "Garde-malades",    icon: Heart },
      { id: "pharmacists",  label: "Pharmaciens",      icon: ShoppingBag },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { id: "validation",   label: "Validation",       icon: UserCheck, badge: true },
      { id: "rendezvous",   label: "Rendez-vous",      icon: Calendar },
      { id: "planning",     label: "Planning",         icon: ListFilter },
      { id: "queue",        label: "File d'attente",   icon: Activity, pulse: true },
      { id: "pharmacies",   label: "Pharmacies",       icon: Building2 },
      { id: "gardemalades", label: "Garde-malades",    icon: ClipboardList },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { id: "medicaments",  label: "Médicaments",      icon: Pill },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { id: "audit",        label: "Journal d'audit",  icon: Shield },
      { id: "parametres",   label: "Paramètres",       icon: Settings },
    ],
  },
];

// ─── Sidebar component ────────────────────────────────────────────────────────
export default function AdminSidebar({
  dk: _dk,
  activePage,
  onNav,
  onLogout,
  userData,
  pendingCount = 0,
  mobileOpen,
  onCloseMobile,
}) {
  const c = getAdminTheme(_dk ?? true);
  const userInitials = (() => {
    if (!userData) return "AD";
    const f = userData.first_name?.[0] ?? "";
    const l = userData.last_name?.[0] ?? "";
    return (f + l).toUpperCase() || "AD";
  })();

  const NavItem = ({ item }) => {
    const isActive = activePage === item.id;
    const badgeCount = item.badge ? pendingCount : 0;

    return (
      <button
        onClick={() => { onNav(item.id); onCloseMobile?.(); }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group/item"
        style={{
          background: isActive ? c.blueFaint : "transparent",
          color: isActive ? c.blue : c.txt2,
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = c.row;
            e.currentTarget.style.color = c.txt;
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = c.txt2;
          }
        }}
      >
        {/* Active indicator bar */}
        <span
          className="absolute left-0 w-0.5 h-4 rounded-r"
          style={{
            background: isActive ? c.blue : "transparent",
            transition: "background 0.15s",
          }}
        />
        <item.icon
          size={15}
          className="shrink-0"
          style={{ color: isActive ? c.blue : "inherit" }}
        />
        <span className="flex-1 text-left truncate">{item.label}</span>

        {/* Pulse dot (queue) */}
        {item.pulse && (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: c.green }} />
            <span className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: c.green }} />
          </span>
        )}

        {/* Badge count */}
        {badgeCount > 0 && (
          <span
            className="min-w-[18px] h-[18px] rounded-full text-white text-[9px] font-black flex items-center justify-center px-1 shrink-0"
            style={{ background: c.red }}
          >
            {badgeCount}
          </span>
        )}
      </button>
    );
  };

  const SidebarContent = () => (
    <div
      className="flex flex-col h-full relative"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: c.surface }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0 border-b"
        style={{ borderColor: c.border }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: c.blue }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="20" rx="2" fill="white" opacity="0.95" />
              <rect x="2" y="9" width="20" height="6" rx="2" fill="white" opacity="0.95" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold leading-tight" style={{ color: c.txt }}>MedSmart</p>
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: c.txt3 }}>
              Admin Console
            </p>
          </div>
        </div>
        {mobileOpen !== undefined && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: c.txt3, background: "transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = c.row}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3" style={{ scrollbarWidth: "none" }}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={section.title} className={si > 0 ? "mt-5" : ""}>
            <p
              className="text-[9px] font-bold uppercase tracking-[0.15em] px-3 mb-1"
              style={{ color: c.txt3 }}
            >
              {section.title}
            </p>
            <div className="space-y-0.5 relative">
              {section.items.map(item => <NavItem key={item.id} item={item} />)}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: c.border }} />

      {/* User footer */}
      <div className="px-2 py-3 shrink-0">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
          style={{ background: c.header }}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: c.blue }}
          >
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: c.txt }}>
              {userData?.first_name && userData?.last_name
                ? `${userData.first_name} ${userData.last_name}`
                : userData?.email ?? "Administrateur"}
            </p>
            <p className="text-[10px] truncate" style={{ color: c.txt3 }}>
              {userData?.email ?? "admin@medsmart.dz"}
            </p>
          </div>
          <button
            onClick={onLogout}
            title="Se déconnecter"
            className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ color: c.txt3, background: "transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = c.row}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 border-r z-20"
        style={{ background: c.surface, borderColor: c.border }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside
            className="lg:hidden fixed left-0 top-0 h-screen w-64 z-40 border-r"
            style={{
              background: c.surface,
              borderColor: c.border,
              boxShadow: _dk ? "8px 0 40px rgba(0,0,0,0.5)" : "8px 0 40px rgba(0,0,0,0.1)",
              animation: "slideInLeft 0.2s ease",
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}

