import { useState } from "react";
import { ChevronDown, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const AVATAR_COLORS = [
  "#6492C9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#3B82F6", "#6366F1",
];

const PAGE_SIZE = 6;

function getInitials(firstName = "", lastName = "") {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}

function conditionBadge(condition, color) {
  const styles = {
    blue:   "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30",
    red:    "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/30",
    teal:   "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30",
    green:  "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${styles[color] || styles.blue}`}>
      {condition}
    </span>
  );
}

function statusBadge(status, color) {
  const styles = {
    green:  "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30",
    red:    "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/30",
    gray:   "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${styles[color] || styles.gray}`}>
      {status}
    </span>
  );
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { patients } = useData();

  const filtered = patients.filter((p) => {
    const name = `${p.firstName || ""} ${p.lastName || ""} ${p.condition || ""}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2644] dark:text-white">My Patients</h1>
          <p className="text-[#5C738A] dark:text-gray-400 text-sm mt-0.5">
            {patients.length > 0
              ? `${patients.length} patient${patients.length > 1 ? "s" : ""} in your care`
              : "847 patients in your care"}
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-[#6492C9] hover:bg-[#304B71] text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={15} /> + Add Patient
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0B5CD]" />
          <input
            type="text"
            placeholder="Search by name, ID or condition..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#172133] focus:border-[#6492C9] focus:ring-0 outline-none text-sm text-gray-700 dark:text-white placeholder:text-[#A0B5CD] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#172133] text-sm text-[#5C738A] dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
          All Conditions <ChevronDown size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3F7FA] dark:bg-[#1E2D4A] flex items-center justify-center mb-4">
              <Search size={24} className="text-[#A0B5CD]" />
            </div>
            <p className="text-[#0D2644] dark:text-white font-semibold mb-1">
              {search ? `No results for "${search}"` : "No patients yet"}
            </p>
            <p className="text-[#A0B5CD] text-sm">
              {search ? "Try a different search." : "Patients will appear here once they create an account."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[2.5fr_0.8fr_1.5fr_1fr_1.3fr_1.2fr_1fr] px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-[#FAFBFC] dark:bg-[#1E2D4A]/30">
              {["PATIENT", "AGE", "CONDITION", "LAST VISIT", "NEXT APPT", "STATUS", "ACTION"].map((col) => (
                <span key={col} className="text-[11px] font-bold text-[#A0B5CD] tracking-wider uppercase">{col}</span>
              ))}
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {paginated.map((patient, idx) => {
                const fullIdx = (page - 1) * PAGE_SIZE + idx;
                const avatarColor = AVATAR_COLORS[fullIdx % AVATAR_COLORS.length];
                const firstName = patient.firstName || "";
                const lastName = patient.lastName || "";
                const age = patient.age || (patient.birthDate
                  ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
                  : "—");

                return (
                  <div key={idx} className="grid grid-cols-[2.5fr_0.8fr_1.5fr_1fr_1.3fr_1.2fr_1fr] px-6 py-4 items-center hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D4A]/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: avatarColor }}>
                        {getInitials(firstName, lastName)}
                      </div>
                      <div>
                        <p className="font-semibold text-[14px] text-[#0D2644] dark:text-white leading-tight">
                          {`${firstName} ${lastName}`.trim() || "Patient"}
                        </p>
                        <p className="text-[12px] text-[#A0B5CD] font-medium">
                          {patient.id || `#${String(fullIdx + 1000)}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-[14px] text-[#5C738A] dark:text-gray-400 font-medium">{age}</span>
                    <div>{conditionBadge(patient.condition || "—", patient.conditionColor || "blue")}</div>
                    <span className="text-[14px] text-[#5C738A] dark:text-gray-400 font-medium">{patient.lastVisit || "—"}</span>
                    <span className={`text-[14px] font-semibold ${(patient.nextAppt || "").toLowerCase().startsWith("today") ? "text-[#6492C9]" : "text-[#5C738A] dark:text-gray-400"}`}>
                      {patient.nextAppt || "—"}
                    </span>
                    <div>{statusBadge(patient.status || "Active", patient.statusColor || "green")}</div>
                    <button className="px-4 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-[13px] font-semibold text-[#5C738A] dark:text-gray-400 hover:border-[#6492C9] hover:text-[#6492C9] transition-colors bg-white dark:bg-transparent w-fit">
                      Consult
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[13px] text-[#5C738A] dark:text-gray-400 font-medium">
                {filtered.length} of {patients.length > 0 ? patients.length : "847"} patients
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-[13px] font-semibold text-[#5C738A] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#6492C9] hover:bg-[#304B71] text-white text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
