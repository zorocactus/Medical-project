import { useState, useEffect } from "react";
import { 
  ShieldAlert, RefreshCw, CheckCircle, XCircle, 
  Calendar, User, Shield, MessageCircle, MoreHorizontal,
  Search, Filter, Clock, Eye, X
} from "lucide-react";
import { getAdminTheme } from "../adminTheme.js";
import { Card, Badge } from "../AdminPrimitives.jsx";
import DashSelect from "../../../components/ui/DashSelect.jsx";
import { useLanguage } from "../../../context/LanguageContext";
import * as api from "../../../services/api";

const MOCK_REPORTS = [];

export default function ReportsView({ dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, resolved, dismissed
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.getReports();
        if (data && data.length > 0) {
          setReports(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des signalements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.handleReportAction(id, action);
      setReports(prev => prev.map(r => 
        r.id === id ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' } : r
      ));
    } catch (err) {
      console.error("Erreur lors du traitement du signalement.");
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = 
      r.reporter_name.toLowerCase().includes(search.toLowerCase()) || 
      r.reported_name.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRoleBadge = (role) => {
    const roles = {
      patient: { color: "#4A6FA5", bg: dk ? "#4A6FA522" : "#EEF3FB", label: t('patient') },
      médecin: { color: "#2D8C6F", bg: dk ? "#2D8C6F22" : "#EEF8F4", label: t('doctor') },
      doctor: { color: "#2D8C6F", bg: dk ? "#2D8C6F22" : "#EEF8F4", label: t('doctor') },
      pharmacien: { color: "#E8A838", bg: dk ? "#E8A83822" : "#FFF8EC", label: t('pharmacist') },
      pharmacist: { color: "#E8A838", bg: dk ? "#E8A83822" : "#FFF8EC", label: t('pharmacist') },
      "garde-malade": { color: "#7B5EA7", bg: dk ? "#7B5EA722" : "#F3EEFF", label: t('caretaker') },
      caretaker: { color: "#7B5EA7", bg: dk ? "#7B5EA722" : "#F3EEFF", label: t('caretaker') },
    };
    const meta = roles[role?.toLowerCase()] || { color: c.txt3, bg: c.blueLight, label: role };
    return <Badge color={meta.color} bg={meta.bg}>{meta.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending": return <Badge color="#E8A838" bg={dk ? "#E8A83822" : "#FFF8EC"}>{t('pending_status')}</Badge>;
      case "resolved": return <Badge color="#2D8C6F" bg={dk ? "#2D8C6F22" : "#EEF8F4"}>{t('treated_status')}</Badge>;
      case "dismissed": return <Badge color={c.txt3} bg={c.blueLight}>{t('ignored_status')}</Badge>;
      default: return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-3" style={{ color: c.txt }}>
            <ShieldAlert size={28} className="text-red-500" />
            {t('reports_alerts')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            {t('moderation_desc')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge color={c.red} bg={dk ? c.red + "22" : c.redLight}>
            {reports.filter(r => r.status === "pending").length} {t('non_processed')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card dk={dk} className="lg:col-span-3 p-3 flex items-center gap-3">
          <Search size={16} style={{ color: c.txt3 }} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search_report_placeholder')}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: c.txt }}
          />
        </Card>
        <div className="lg:col-span-1">
          <DashSelect 
            value={filter}
            options={[
              { value: "all", label: t('all_tab') },
              { value: "pending", label: t('pending_tab') },
              { value: "resolved", label: t('processed_tab') },
              { value: "dismissed", label: t('ignored_tab') },
            ]}
            onSelect={v => setFilter(v)}
            dk={dk}
            c={c}
          />
        </div>
      </div>

      <Card dk={dk} style={{ overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: dk ? "rgba(255,255,255,0.02)" : "#FAFBFD", borderBottom: `1px solid ${c.border}` }}>
                {[t('date'), t('reporter_col'), t('reported_col'), t('reason_col'), t('status_label'), "Actions"].map(h => (
                  <th key={h} className="text-left py-4 px-5 text-[11px] font-black uppercase tracking-wider" style={{ color: c.txt3 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: c.border }}>
              {filteredReports.map(report => (
                <tr key={report.id} className="group transition-colors" onMouseEnter={e => e.currentTarget.style.background = dk ? "rgba(255,255,255,0.01)" : "#FAFAFA"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: c.txt }}>
                      <Calendar size={14} style={{ color: c.txt3 }} />
                      {new Date(report.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-[10px] flex items-center gap-1 mt-1" style={{ color: c.txt3 }}>
                      <Clock size={10} />
                      {new Date(report.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-bold" style={{ color: c.txt }}>{report.reporter_name}</span>
                      {getRoleBadge(report.reporter_role)}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-bold" style={{ color: c.txt }}>{report.reported_name}</span>
                      {getRoleBadge(report.reported_role)}
                    </div>
                  </td>
                  <td className="py-4 px-5 max-w-[300px]">
                    <p className="text-sm line-clamp-2 italic" style={{ color: c.txt2 }}>
                      "{report.reason}"
                    </p>
                  </td>
                  <td className="py-4 px-5">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        title="Voir les détails"
                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:bg-gray-50 active:scale-95"
                        style={{ borderColor: c.border, color: c.blue, background: c.surface }}
                      >
                        <Eye size={16} />
                      </button>
                      {report.status === "pending" ? (
                        <>
                          <button 
                            onClick={() => handleAction(report.id, "resolve")}
                            title="Marquer comme traité"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
                            style={{ background: "#2D8C6F" }}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleAction(report.id, "dismiss")}
                            title="Ignorer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-transform hover:scale-110 active:scale-95"
                            style={{ borderColor: c.border, color: c.txt3, background: c.surface }}
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center opacity-30" style={{ color: c.txt3 }}>
                          <MoreHorizontal size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40" style={{ color: c.txt3 }}>
                      <Shield size={48} strokeWidth={1} />
                      <p className="text-sm font-medium">{t('no_reports_found')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 🔮 MODAL DE DÉTAIL ────────────────────────────────────────────────── */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" 
            style={{ background: c.card, border: `1px solid ${c.border}` }}>
            
            {/* Header */}
            <div className="px-8 py-6 border-b flex items-center justify-between" style={{ borderColor: c.border }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black" style={{ color: c.txt }}>{t('report_details_title')}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: c.txt3 }}>ID: #{selectedReport.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                style={{ color: c.txt3 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: c.txt3 }}>{t('reporter_col')}</p>
                  <p className="text-sm font-bold" style={{ color: c.txt }}>{selectedReport.reporter_name}</p>
                  {getRoleBadge(selectedReport.reporter_role)}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: c.txt3 }}>{t('reported_col')}</p>
                  <p className="text-sm font-bold" style={{ color: c.txt }}>{selectedReport.reported_name}</p>
                  {getRoleBadge(selectedReport.reported_role)}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: c.txt3 }}>{t('reason_col')}</p>
                <div className="p-5 rounded-3xl text-sm leading-relaxed italic border" 
                  style={{ background: c.blueLight, borderColor: c.border, color: c.txt }}>
                  "{selectedReport.reason}"
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: c.border }}>
                <div className="flex items-center gap-2">
                  <Calendar size={14} style={{ color: c.txt3 }} />
                  <span className="text-xs font-semibold" style={{ color: c.txt2 }}>
                    {t('reported_on', { date: new Date(selectedReport.created_at).toLocaleString('fr-FR') })}
                  </span>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>
            </div>

            {/* Actions */}
            {selectedReport.status === "pending" && (
              <div className="p-6 bg-gray-50 flex gap-3" style={{ background: dk ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
                <button 
                  onClick={() => { handleAction(selectedReport.id, "resolve"); setSelectedReport(null); }}
                  className="flex-1 py-3.5 rounded-2xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
                >
                  {t('process_report_btn')}
                </button>
                <button 
                  onClick={() => { handleAction(selectedReport.id, "dismiss"); setSelectedReport(null); }}
                  className="px-6 py-3.5 rounded-2xl border text-sm font-bold hover:bg-white transition-all active:scale-95"
                  style={{ borderColor: c.border, color: c.txt2, background: c.card }}
                >
                  {t('ignore_report_btn')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
