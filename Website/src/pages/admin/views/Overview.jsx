import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, Stethoscope, Pill, Calendar, TrendingUp, TrendingDown,
  RefreshCw, Download, Activity, CheckCircle, AlertTriangle,
} from "lucide-react";
import { getAdminTheme } from "../adminTheme.js";
import { Card, Badge } from "../AdminPrimitives.jsx";
import * as api from "../../../services/api";

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, color, trend, dk }) {
  const c = getAdminTheme(dk);
  const up = trend >= 0;
  return (
    <Card dk={dk} style={{ padding: 20 }}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: color + "18" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
            style={{
              background: up ? "#2D8C6F18" : "#E0555518",
              color: up ? "#2D8C6F" : "#E05555",
            }}
          >
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-black tracking-tight" style={{ color: c.txt }}>
        {typeof value === "number" ? value.toLocaleString() : value ?? "—"}
      </p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: c.txt2 }}>
        {label}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: c.txt3 }}>
          {sub}
        </p>
      )}
    </Card>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, dk }) {
  const c = getAdminTheme(dk);
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-4 py-3 shadow-lg"
      style={{ background: c.card, borderColor: c.border }}
    >
      <p className="text-xs font-bold mb-1" style={{ color: c.txt3 }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// ─── Months for mock trend (fallback) ─────────────────────────────────────────
const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

function buildFallbackTrend() {
  const now = new Date();
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 7 + i, 1);
    return {
      month: MONTHS_FR[d.getMonth()],
      rdv: Math.floor(80 + Math.random() * 120),
      users: Math.floor(40 + Math.random() * 80),
    };
  });
}

// ─── ROLE COLORS for Pie ───────────────────────────────────────────────────────
const ROLE_PIE_COLORS = {
  patient:    "#4A6FA5",
  doctor:     "#2D8C6F",
  pharmacist: "#E8A838",
  caretaker:  "#7B5EA7",
  admin:      "#E05555",
};

const ROLE_LABELS_FR = {
  patient:    "Patients",
  doctor:     "Médecins",
  pharmacist: "Pharmaciens",
  caretaker:  "Garde-malades",
  admin:      "Admins",
};

// ─── OVERVIEW PAGE ─────────────────────────────────────────────────────────────
export default function OverviewPage({ dk, onNav }) {
  const c = getAdminTheme(dk);

  const [kpis, setKpis] = useState(null);
  const [roleDistrib, setRoleDistrib] = useState([]);
  const [recentRegs, setRecentRegs] = useState([]);
  const [trend, setTrend] = useState(buildFallbackTrend());
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const exportCSV = () => {
    const rows = [
      ["Indicateur", "Valeur"],
      ["Utilisateurs totaux", kpis?.total_users ?? "—"],
      ["Médecins vérifiés", kpis?.verified_doctors ?? "—"],
      ["Pharmacies actives", kpis?.active_pharmacies ?? "—"],
      ["Total rendez-vous", kpis?.total_appointments ?? "—"],
      [],
      ["Rôle", "Nombre"],
      ...roleDistrib.map(r => [r.name, r.value]),
      [],
      ["Mois", "Rendez-vous", "Inscriptions"],
      ...trend.map(t => [t.month, t.rdv, t.users]),
    ];
    const csv = rows.map(r => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medsmart_rapport_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const data = await api.getAdminDashboard();
      setUsingFallback(false);
      if (data?.kpis) setKpis(data.kpis);
      if (data?.role_distribution) {
        const dist = Object.entries(data.role_distribution).map(([role, count]) => ({
          name: ROLE_LABELS_FR[role] ?? role,
          value: count,
          color: ROLE_PIE_COLORS[role] ?? "#9AACBE",
        }));
        setRoleDistrib(dist);
      }
      if (Array.isArray(data?.recent_registrations)) {
        setRecentRegs(data.recent_registrations);
      }
    } catch {
      // Backend unreachable — keep fallbacks, signal banner
      setUsingFallback(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Build KPI array from real data or fallback
  const kpiCards = [
    {
      label: "Utilisateurs totaux",
      value: kpis?.total_users ?? "—",
      icon: Users,
      color: c.blue,
      sub: "Tous rôles confondus",
    },
    {
      label: "Médecins vérifiés",
      value: kpis?.verified_doctors ?? "—",
      icon: Stethoscope,
      color: c.green,
      sub: "Profils validés par l'admin",
    },
    {
      label: "Pharmacies actives",
      value: kpis?.active_pharmacies ?? "—",
      icon: Pill,
      color: c.amber,
      sub: "Officines partenaires",
    },
    {
      label: "Total rendez-vous",
      value: kpis?.total_appointments ?? "—",
      icon: Calendar,
      color: c.purple,
      sub: "Depuis le début",
    },
  ];

  const totalUsers = kpis?.total_users ?? 0;
  const timeStr = lastRefresh.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: c.green }}
            >
              Système opérationnel
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: c.txt }}>
            Centre de Contrôle{" "}
            <span style={{ color: c.blue }}>MedSmart</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: c.txt2 }}>
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · Actualisé à {timeStr}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={usingFallback}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderColor: c.border, color: c.txt2 }}
            title={usingFallback ? "Données simulées — export désactivé" : "Exporter en CSV"}
          >
            <Download size={14} /> Export rapport
          </button>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #304B71, #6492C9)",
              boxShadow: "0 4px 16px rgba(74,111,165,0.35)",
            }}
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>
      </div>

      {/* ── Fallback banner ── */}
      {usingFallback && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-5 text-sm font-semibold"
          style={{ background: c.amber + "18", borderColor: c.amber + "40", color: c.amber }}
        >
          <AlertTriangle size={16} />
          Données simulées — le serveur est inaccessible. Les chiffres affichés ne reflètent pas la réalité.
          <button
            onClick={fetchData}
            className="ml-auto text-xs underline hover:no-underline"
            style={{ color: c.amber }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((k, i) => (
          <KpiCard key={i} {...k} dk={dk} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        {/* Appointment & User trends */}
        <Card dk={dk} style={{ padding: 24, gridColumn: "span 2" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold" style={{ color: c.txt }}>
                Tendances — Rendez-vous & Inscriptions
              </h3>
              <p className="text-xs mt-0.5" style={{ color: c.txt2 }}>
                8 derniers mois
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: c.blue }}>
                <span className="w-3 h-3 rounded-full" style={{ background: c.blue }} />
                Rendez-vous
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: c.green }}>
                <span className="w-3 h-3 rounded-full" style={{ background: c.green }} />
                Inscriptions
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRdv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.blue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={c.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={c.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
              <XAxis
                dataKey="month"
                tick={{ fill: c.txt3, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: c.txt3, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip dk={dk} />} />
              <Area
                type="monotone"
                dataKey="rdv"
                name="Rendez-vous"
                stroke={c.blue}
                strokeWidth={2.5}
                fill="url(#gradRdv)"
                dot={false}
                activeDot={{ r: 5, fill: c.blue }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="Inscriptions"
                stroke={c.green}
                strokeWidth={2.5}
                fill="url(#gradUsers)"
                dot={false}
                activeDot={{ r: 5, fill: c.green }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Role distribution Pie */}
        <Card dk={dk} style={{ padding: 24 }}>
          <h3 className="font-bold mb-4" style={{ color: c.txt }}>
            Répartition des rôles
          </h3>
          {roleDistrib.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={roleDistrib}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roleDistrib.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [v.toLocaleString(), ""]}
                    contentStyle={{
                      background: c.card,
                      border: `1px solid ${c.border}`,
                      borderRadius: 12,
                      color: c.txt,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {roleDistrib.map((r, i) => {
                  const pct = totalUsers > 0 ? Math.round((r.value / totalUsers) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: r.color }}
                      />
                      <span className="text-xs flex-1" style={{ color: c.txt2 }}>
                        {r.name}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: r.color }}
                      >
                        {r.value.toLocaleString()}
                      </span>
                      <span className="text-xs" style={{ color: c.txt3 }}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Fallback bars when no API data */
            <div className="space-y-3">
              {[
                { role: "Patients", pct: 81, color: "#4A6FA5" },
                { role: "Médecins", pct: 5, color: "#2D8C6F" },
                { role: "Pharmaciens", pct: 2, color: "#E8A838" },
                { role: "Garde-malades", pct: 12, color: "#7B5EA7" },
              ].map((r) => (
                <div key={r.role}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: c.txt2 }}>
                      {r.role}
                    </span>
                    <span className="text-xs font-bold" style={{ color: r.color }}>
                      {r.pct}%
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: c.blueLight }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${r.pct}%`, background: r.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className="mt-4 p-3 rounded-xl text-center"
            style={{ background: c.blueLight }}
          >
            <p className="text-2xl font-black" style={{ color: c.txt }}>
              {totalUsers > 0 ? totalUsers.toLocaleString() : "—"}
            </p>
            <p className="text-xs" style={{ color: c.txt2 }}>
              utilisateurs totaux
            </p>
          </div>
        </Card>
      </div>

      {/* ── Bottom Row : Recent registrations + Audit mini ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent registrations */}
        <Card dk={dk} style={{ padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: c.txt }}>
              Inscriptions récentes
            </h3>
            <button
              onClick={() => onNav("utilisateurs")}
              className="text-xs font-semibold hover:underline"
              style={{ color: c.blue }}
            >
              Voir tout →
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div
                    className="w-9 h-9 rounded-xl shrink-0"
                    style={{ background: c.blueLight }}
                  />
                  <div className="flex-1 space-y-1.5">
                    <div
                      className="h-3 rounded-full w-2/3"
                      style={{ background: c.blueLight }}
                    />
                    <div
                      className="h-2 rounded-full w-1/2"
                      style={{ background: c.blueLight }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : recentRegs.length > 0 ? (
            <div className="space-y-3">
              {recentRegs.slice(0, 6).map((u, i) => {
                const name = u.name ?? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() ?? "—";
                const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                const roleColor =
                  u.role === "doctor" ? "#2D8C6F"
                  : u.role === "pharmacist" ? "#E8A838"
                  : u.role === "caretaker" ? "#7B5EA7"
                  : "#4A6FA5";
                const roleLabel =
                  u.role === "doctor" ? "Médecin"
                  : u.role === "pharmacist" ? "Pharmacien"
                  : u.role === "caretaker" ? "Garde-malade"
                  : "Patient";
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: roleColor }}
                    >
                      {initials || "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: c.txt }}
                      >
                        {name}
                      </p>
                      <p className="text-xs" style={{ color: c.txt3 }}>
                        {roleLabel} ·{" "}
                        {u.date
                          ? new Date(u.date).toLocaleDateString("fr-FR")
                          : "—"}
                      </p>
                    </div>
                    <Badge color={roleColor} bg={roleColor + "18"}>
                      {roleLabel}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-center py-6" style={{ color: c.txt3 }}>
              Aucune inscription récente
            </p>
          )}
        </Card>

        {/* Système status */}
        <Card dk={dk} style={{ padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: c.txt }}>
              État du système
            </h3>
            <button
              onClick={() => onNav("audit")}
              className="text-xs font-semibold hover:underline"
              style={{ color: c.blue }}
            >
              Journal complet →
            </button>
          </div>
          <div className="space-y-3">
            {[
              {
                label: "API Backend",
                status: kpis ? "ok" : "warn",
                msg: kpis ? "Opérationnel" : "Données backend indisponibles",
              },
              { label: "Base de données", status: "ok", msg: "PostgreSQL connecté" },
              { label: "Auth JWT", status: "ok", msg: "Tokens actifs" },
              { label: "Notifications", status: "ok", msg: "Service actif" },
              { label: "Stockage médias", status: "ok", msg: "Upload disponible" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: c.border }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background:
                        s.status === "ok"
                          ? "#2D8C6F"
                          : s.status === "warn"
                          ? "#E8A838"
                          : "#E05555",
                    }}
                  />
                  <span className="text-sm font-semibold" style={{ color: c.txt }}>
                    {s.label}
                  </span>
                </div>
                <span className="text-xs" style={{ color: c.txt3 }}>
                  {s.msg}
                </span>
              </div>
            ))}
          </div>

          {/* Validation pending alert */}
          <div
            className="mt-4 flex items-center gap-3 p-3 rounded-xl border"
            style={{
              background: c.amberLight,
              borderColor: c.amber + "40",
            }}
          >
            <AlertTriangle size={16} style={{ color: c.amber }} />
            <div>
              <p className="text-xs font-bold" style={{ color: c.amber }}>
                Inscriptions en attente
              </p>
              <p className="text-xs mt-0.5" style={{ color: c.txt2 }}>
                Accédez à la section Validation pour traiter les demandes.
              </p>
            </div>
            <button
              onClick={() => onNav("validation")}
              className="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg text-white shrink-0"
              style={{ background: c.amber }}
            >
              Voir
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
