import { useState, useRef } from "react";
import {
  Search, Bell, Settings, LogOut, Menu, ChevronDown, Sun, Moon,
  Package, Pill, ShoppingCart, FileText, AlertTriangle, Check,
  X, Plus, Minus, QrCode, TrendingUp, TrendingDown, AlertCircle,
  Clock, CheckCircle, Eye, Download, Filter, RefreshCw, Truck,
  BarChart2, Users, DollarSign, Archive, User, ChevronRight,
  Zap, Shield, Activity, Send, Phone
} from "lucide-react";

// ─── Theme tokens (identique au patient dashboard) ────────────────────────────
const T = {
  light: {
    bg: "#F0F4F8", card: "#ffffff", nav: "#ffffff",
    border: "#E4EAF5", txt: "#0D1B2E", txt2: "#5A6E8A", txt3: "#9AACBE",
    blue: "#4A6FA5", blueLight: "#EEF3FB", green: "#2D8C6F",
    amber: "#E8A838", red: "#E05555", purple: "#7B5EA7",
  },
  dark: {
    bg: "#0D1117", card: "#141B27", nav: "#141B27",
    border: "rgba(99,142,203,0.15)", txt: "#F0F3FA", txt2: "#8AAEE0", txt3: "#4A6080",
    blue: "#638ECB", blueLight: "#1A2333", green: "#4CAF82",
    amber: "#F0A500", red: "#E05555", purple: "#9B7FD4",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const STOCK = [
  { id: 1,  name: "Lisinopril 10mg",     molecule: "Lisinopril Dihydrate",   qty: 142, min: 50,  price: 320,  cnas: true,  category: "Cardiologie",   expiry: "2026-08-15" },
  { id: 2,  name: "Metformin 500mg",     molecule: "Metformin HCl",          qty: 89,  min: 40,  price: 180,  cnas: true,  category: "Diabétologie",  expiry: "2026-11-20" },
  { id: 3,  name: "Amoxicillin 500mg",   molecule: "Amoxicillin Trihydrate", qty: 12,  min: 30,  price: 240,  cnas: true,  category: "Antibiotiques", expiry: "2025-12-01" },
  { id: 4,  name: "Vitamin D3 2000IU",   molecule: "Cholecalciferol",        qty: 215, min: 60,  price: 450,  cnas: false, category: "Vitamines",     expiry: "2027-03-10" },
  { id: 5,  name: "Aspirin 100mg",       molecule: "Acetylsalicylic Acid",   qty: 330, min: 80,  price: 90,   cnas: false, category: "Cardiologie",   expiry: "2027-01-05" },
  { id: 6,  name: "Omeprazole 20mg",     molecule: "Omeprazole",             qty: 67,  min: 40,  price: 280,  cnas: true,  category: "Gastro",        expiry: "2026-06-30" },
  { id: 7,  name: "Atorvastatin 20mg",   molecule: "Atorvastatin Calcium",   qty: 8,   min: 25,  price: 520,  cnas: true,  category: "Cardiologie",   expiry: "2026-04-15" },
  { id: 8,  name: "Paracetamol 1g",      molecule: "Acetaminophen",          qty: 480, min: 100, price: 75,   cnas: false, category: "Antalgiques",   expiry: "2027-06-20" },
  { id: 9,  name: "Ibuprofen 400mg",     molecule: "Ibuprofen",              qty: 155, min: 50,  price: 120,  cnas: false, category: "Antalgiques",   expiry: "2027-02-28" },
  { id: 10, name: "Amlodipine 5mg",      molecule: "Amlodipine Besylate",    qty: 44,  min: 30,  price: 390,  cnas: true,  category: "Cardiologie",   expiry: "2026-09-12" },
];

const ORDERS = [
  { id: "ORD-2026-0481", patient: "Alex Johnson",   doctor: "Dr. Sarah Smith",  date: "Auj. 10:24",  status: "ready",      items: ["Lisinopril 10mg ×30", "Metformin 500mg ×60"], total: 19800, cnas: true  },
  { id: "ORD-2026-0480", patient: "Samira Meziane", doctor: "Dr. Benali Karim", date: "Auj. 09:51",  status: "processing", items: ["Amoxicillin 500mg ×21"],                      total: 5040,  cnas: true  },
  { id: "ORD-2026-0479", patient: "Karim Boudali",  doctor: "Dr. Amira Boudali",date: "Hier 16:30",  status: "delivered",  items: ["Aspirin 100mg ×90", "Atorvastatin 20mg ×30"], total: 23700, cnas: false },
  { id: "ORD-2026-0478", patient: "Fatima Benali",  doctor: "Dr. Sarah Smith",  date: "Hier 14:15",  status: "ready",      items: ["Vitamin D3 2000IU ×60"],                      total: 27000, cnas: false },
  { id: "ORD-2026-0477", patient: "Omar Meziani",   doctor: "Dr. Karim Benali", date: "Hier 11:00",  status: "delivered",  items: ["Omeprazole 20mg ×30", "Paracetamol 1g ×20"],  total: 9900,  cnas: true  },
];

const ALERTS = [
  { id: 1, type: "rupture",  icon: AlertTriangle, color: "#E05555", bg: "#FFF0F0", bgDk: "#2A1515", text: "Amoxicillin 500mg — Stock critique (12 unités)",     action: "Commander" },
  { id: 2, type: "rupture",  icon: AlertTriangle, color: "#E05555", bg: "#FFF0F0", bgDk: "#2A1515", text: "Atorvastatin 20mg — Stock critique (8 unités)",      action: "Commander" },
  { id: 3, type: "expiry",   icon: Clock,         color: "#E8A838", bg: "#FFFAEC", bgDk: "#2A1E08", text: "Amoxicillin 500mg — Expire le 01/12/2025",           action: "Retirer" },
  { id: 4, type: "cnas",     icon: Shield,        color: "#4A6FA5", bg: "#EEF3FB", bgDk: "#1A2333", text: "3 ordonnances CNAS en attente de validation",        action: "Valider" },
];

const NOTIFICATIONS = [
  { id: 1, icon: ShoppingCart, color: "#4A6FA5", bg: "#EEF3FB", bgDk: "#1A2333", title: "Nouvelle commande",        sub: "Alex Johnson — il y a 5 min",     unread: true  },
  { id: 2, icon: AlertCircle,  color: "#E05555", bg: "#FFF0F0", bgDk: "#2A1515", title: "Stock critique",            sub: "Atorvastatin 20mg — 8 unités",    unread: true  },
  { id: 3, icon: Check,        color: "#2D8C6F", bg: "#EEF8F4", bgDk: "#1A2D28", title: "Livraison confirmée",       sub: "Commande fournisseur #FL-881",    unread: false },
  { id: 4, icon: Shield,       color: "#4A6FA5", bg: "#EEF3FB", bgDk: "#1A2333", title: "Validation CNAS",           sub: "3 ordonnances à traiter",         unread: true  },
];

const STATUS_META = {
  ready:      { label: "Prêt",       color: "#2D8C6F", bg: "#2D8C6F18" },
  processing: { label: "En cours",   color: "#E8A838", bg: "#E8A83818" },
  delivered:  { label: "Livré",      color: "#9AACBE", bg: "#9AACBE18" },
  cancelled:  { label: "Annulé",     color: "#E05555", bg: "#E0555518" },
};

// ─── Reusable components ──────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <div className={`rounded-2xl p-5 shadow-sm border ${className}`}
      style={{ background: c.card, borderColor: c.border, ...style }}>
      {children}
    </div>
  );
}

function Badge({ color, bg, children }) {
  return (
    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
      style={{ color, background: bg, borderColor: color + "44" }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, trend, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <Card dk={dk} style={{ padding: 18 }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color + "18" }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs font-bold"
            style={{ color: trend >= 0 ? "#2D8C6F" : "#E05555" }}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold" style={{ color: c.txt }}>{value}</p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: c.txt2 }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>{sub}</p>}
    </Card>
  );
}

// ─── QR SCAN MODAL ────────────────────────────────────────────────────────────
function QrModal({ onClose, dk, onScan }) {
  const c = dk ? T.dark : T.light;
  const [scanned, setScanned] = useState(false);

  const simulateScan = () => {
    setScanned(true);
    setTimeout(() => { onScan(); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-2xl p-8 w-full max-w-sm shadow-2xl border"
        style={{ background: c.card, borderColor: c.border }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold" style={{ color: c.txt }}>Scanner une ordonnance</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors hover:opacity-70"
            style={{ borderColor: c.border, color: c.txt3 }}>
            <X size={15} />
          </button>
        </div>

        {/* Camera zone */}
        <div className="relative rounded-2xl overflow-hidden mb-5"
          style={{ background: "#000", height: 220 }}>
          {/* Scan lines animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 relative">
              {/* Corner brackets */}
              {[["top-0 left-0","border-t-2 border-l-2"],["top-0 right-0","border-t-2 border-r-2"],
                ["bottom-0 left-0","border-b-2 border-l-2"],["bottom-0 right-0","border-b-2 border-r-2"]
              ].map(([pos, border], i) => (
                <div key={i} className={`absolute w-5 h-5 ${pos} ${border} rounded-sm`}
                  style={{ borderColor: scanned ? "#2D8C6F" : "#6492C9" }} />
              ))}
              <QrCode size={64} className="absolute inset-0 m-auto"
                style={{ color: scanned ? "#2D8C6F" : "rgba(255,255,255,0.15)" }} />
            </div>
          </div>
          {/* Scan line */}
          {!scanned && (
            <div className="absolute left-4 right-4 h-0.5 bg-blue-400 opacity-80"
              style={{ top: "50%", boxShadow: "0 0 8px #6492C9", animation: "scanLine 2s ease-in-out infinite" }} />
          )}
          {scanned && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(45,140,111,0.3)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "#2D8C6F" }}>
                <Check size={32} className="text-white" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm mb-5" style={{ color: c.txt2 }}>
          {scanned ? "Ordonnance détectée !" : "Positionnez le QR code de l'ordonnance"}
        </p>

        <div className="flex gap-3">
          <button onClick={simulateScan}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: c.blue }}>
            {scanned ? "Traitement…" : "📷 Simuler scan"}
          </button>
          <button className="px-4 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: c.border, color: c.txt2 }}>
            📁 Fichier
          </button>
        </div>
      </div>
      <style>{`@keyframes scanLine { 0%,100%{top:20%} 50%{top:80%} }`}</style>
    </div>
  );
}

// ─── PAGE: ACCUEIL ────────────────────────────────────────────────────────────
function HomePage({ dk, onNav }) {
  const c = dk ? T.dark : T.light;
  const [showQr, setShowQr] = useState(false);
  const [newOrder, setNewOrder] = useState(false);

  const stats = [
    { label: "Commandes aujourd'hui",  value: "24",         icon: ShoppingCart,  color: c.blue,   trend: 12 },
    { label: "Revenus du jour",         value: "84 200 DZD", icon: DollarSign,    color: c.green,  trend: 8  },
    { label: "Médicaments en stock",    value: "1 548",      icon: Package,       color: "#7B5EA7", trend: -3 },
    { label: "Alertes stock",           value: "4",          icon: AlertTriangle, color: c.red,    trend: undefined },
  ];

  return (
    <>
      {showQr && <QrModal dk={dk} onClose={() => setShowQr(false)} onScan={() => setNewOrder(true)} />}

      {/* Alerte nouvelle commande */}
      {newOrder && (
        <div className="mb-5 flex items-center gap-4 p-4 rounded-2xl border-2"
          style={{ background: "#2D8C6F10", borderColor: "#2D8C6F44" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#2D8C6F" }}>
            <Check size={18} className="text-white" strokeWidth={3} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: c.txt }}>Ordonnance scannée avec succès</p>
            <p className="text-xs" style={{ color: c.txt2 }}>Commande ORD-2026-0482 créée — Alex Johnson · Lisinopril 10mg ×30</p>
          </div>
          <button onClick={() => setNewOrder(false)} style={{ color: c.txt3 }}><X size={16} /></button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => <StatCard key={s.label} {...s} dk={dk} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">

          {/* Alertes stock */}
          <Card dk={dk}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: c.txt }}>Alertes prioritaires</h3>
              <Badge color={c.red} bg={c.red + "18"}>{ALERTS.length} alertes</Badge>
            </div>
            <div className="space-y-3">
              {ALERTS.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: dk ? a.bgDk : a.bg }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: a.color + "22" }}>
                    <a.icon size={15} style={{ color: a.color }} />
                  </div>
                  <p className="flex-1 text-sm font-medium" style={{ color: c.txt }}>{a.text}</p>
                  <button className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{ background: a.color, color: "#fff" }}>
                    {a.action}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Dernières commandes */}
          <Card dk={dk}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: c.txt }}>Dernières commandes</h3>
              <button onClick={() => onNav("commandes")}
                className="text-sm font-semibold hover:underline" style={{ color: c.blue }}>
                Voir tout
              </button>
            </div>
            <div className="space-y-3">
              {ORDERS.slice(0, 3).map(o => {
                const st = STATUS_META[o.status];
                return (
                  <div key={o.id} className="flex items-center gap-4 p-3 rounded-xl border transition-all hover:opacity-80"
                    style={{ borderColor: c.border }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: c.blueLight }}>
                      <FileText size={16} style={{ color: c.blue }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm" style={{ color: c.txt }}>{o.patient}</p>
                        {o.cnas && <Badge color={c.blue} bg={c.blueLight}>CNAS</Badge>}
                      </div>
                      <p className="text-xs truncate" style={{ color: c.txt2 }}>{o.items[0]}{o.items.length > 1 ? ` +${o.items.length - 1}` : ""}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                      <p className="text-xs mt-1" style={{ color: c.txt3 }}>{o.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Mini stock critique */}
          <Card dk={dk}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>Stock critique</p>
              <button onClick={() => onNav("stock")} className="text-xs font-semibold hover:underline" style={{ color: c.blue }}>
                Gérer
              </button>
            </div>
            {STOCK.filter(s => s.qty < s.min).map(item => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b last:border-0"
                style={{ borderColor: c.border }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: c.txt }}>{item.name}</p>
                  <div className="w-full h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: c.blueLight }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, item.qty / item.min * 100)}%`, background: item.qty < item.min * 0.4 ? c.red : c.amber }} />
                  </div>
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: item.qty < item.min * 0.4 ? c.red : c.amber }}>
                  {item.qty}
                </span>
              </div>
            ))}
          </Card>

          {/* Notifications */}
          <Card dk={dk}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>Notifications</p>
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
            </div>
            <div className="space-y-3">
              {NOTIFICATIONS.slice(0, 3).map(n => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: dk ? n.bgDk : n.bg }}>
                  <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: n.color }} />
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: n.color + "22" }}>
                    <n.icon size={13} style={{ color: n.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold" style={{ color: c.txt }}>{n.title}</p>
                    <p className="text-xs" style={{ color: c.txt3 }}>{n.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chiffre du jour */}
          <Card dk={dk} style={{ background: "linear-gradient(135deg, #304B71, #6492C9)", border: "none" }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2 text-white opacity-70">CNAS — Aujourd'hui</p>
            <p className="text-2xl font-bold text-white">52 400 DZD</p>
            <p className="text-sm text-white opacity-80 mt-0.5">remboursé sur 84 200 DZD</p>
            <div className="w-full h-2 rounded-full mt-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div className="h-full rounded-full bg-white" style={{ width: "62%" }} />
            </div>
            <p className="text-xs text-white opacity-60 mt-1.5">62% couvert par la CNAS</p>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── PAGE: STOCK ──────────────────────────────────────────────────────────────
function StockPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | critical | ok
  const [editQty, setEditQty] = useState(null);

  const filtered = STOCK.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.molecule.toLowerCase().includes(search.toLowerCase());
    if (filter === "critical") return matchSearch && s.qty < s.min;
    if (filter === "ok")       return matchSearch && s.qty >= s.min;
    return matchSearch;
  });

  const getStockStatus = (item) => {
    const pct = item.qty / item.min;
    if (pct < 0.4) return { label: "Critique",   color: c.red,   bg: c.red + "18" };
    if (pct < 1.0) return { label: "Bas",        color: c.amber, bg: c.amber + "18" };
    return          { label: "Normal",    color: c.green, bg: c.green + "18" };
  };

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>Gestion du Stock</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>{STOCK.length} références · {STOCK.filter(s => s.qty < s.min).length} en rupture</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: c.blue }}>
          <Plus size={15} /> Ajouter un article
        </button>
      </div>

      {/* Filters */}
      <Card dk={dk} className="mb-5" style={{ padding: "12px 16px" }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-48 rounded-xl px-3 py-2"
            style={{ background: c.blueLight }}>
            <Search size={14} style={{ color: c.txt3 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher médicament…" className="outline-none text-sm bg-transparent flex-1"
              style={{ color: c.txt }} />
          </div>
          <div className="flex gap-2">
            {[["all", "Tout"], ["critical", "Critique"], ["ok", "Normal"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{ background: filter === val ? c.blue : "transparent", color: filter === val ? "#fff" : c.txt2, borderColor: filter === val ? c.blue : c.border }}>
                {label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: c.border, color: c.txt2 }}>
            <Download size={13} /> Exporter
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card dk={dk} style={{ padding: 0, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}`, background: dk ? "rgba(255,255,255,0.02)" : "#FAFBFD" }}>
                {["Médicament", "Molécule", "Catégorie", "Stock", "Min.", "Statut", "Expiration", "Prix", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-bold uppercase tracking-wide px-4 py-3"
                    style={{ color: c.txt3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const st = getStockStatus(item);
                return (
                  <tr key={item.id} className="transition-colors"
                    style={{ borderBottom: `1px solid ${c.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = dk ? "rgba(255,255,255,0.02)" : "#FAFBFD"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: c.blueLight }}>
                          <Pill size={13} style={{ color: c.blue }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: c.txt }}>{item.name}</p>
                          {item.cnas && <Badge color={c.blue} bg={c.blueLight}>CNAS</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: c.txt2 }}>{item.molecule}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: c.txt2 }}>{item.category}</td>
                    <td className="px-4 py-3">
                      {editQty === item.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditQty(null)}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs"
                            style={{ background: c.green, color: "#fff" }}>✓</button>
                          <input type="number" defaultValue={item.qty}
                            className="w-16 px-2 py-1 rounded-lg text-xs outline-none border"
                            style={{ background: c.blueLight, borderColor: c.border, color: c.txt }} />
                        </div>
                      ) : (
                        <span className="text-sm font-bold" style={{ color: st.color }}>{item.qty}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: c.txt3 }}>{item.min}</td>
                    <td className="px-4 py-3"><Badge color={st.color} bg={st.bg}>{st.label}</Badge></td>
                    <td className="px-4 py-3 text-xs" style={{ color: new Date(item.expiry) < new Date() ? c.red : c.txt3 }}>
                      {new Date(item.expiry).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: c.blue }}>{item.price} DZD</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditQty(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors hover:opacity-70"
                          style={{ borderColor: c.border, color: c.txt3 }}>
                          <RefreshCw size={12} />
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors hover:opacity-70"
                          style={{ borderColor: c.border, color: c.blue }}>
                          <Truck size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ─── PAGE: COMMANDES ──────────────────────────────────────────────────────────
function CommandesPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [tab, setTab] = useState("all");
  const [showQr, setShowQr] = useState(false);
  const [orders, setOrders] = useState(ORDERS);

  const tabs = [
    { id: "all",        label: "Toutes",    count: orders.length },
    { id: "ready",      label: "Prêtes",    count: orders.filter(o => o.status === "ready").length },
    { id: "processing", label: "En cours",  count: orders.filter(o => o.status === "processing").length },
    { id: "delivered",  label: "Livrées",   count: orders.filter(o => o.status === "delivered").length },
  ];

  const displayed = tab === "all" ? orders : orders.filter(o => o.status === tab);

  const markReady = (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "ready" } : o));
  const markDelivered = (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "delivered" } : o));

  return (
    <>
      {showQr && <QrModal dk={dk} onClose={() => setShowQr(false)} onScan={() => {}} />}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>Commandes</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Gérez les ordonnances et dispensations</p>
        </div>
        <button onClick={() => setShowQr(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: c.blue }}>
          <QrCode size={15} /> Scanner ordonnance
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-5" style={{ borderColor: c.border }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all"
            style={{ color: tab === t.id ? c.blue : c.txt2, borderBottom: tab === t.id ? `2px solid ${c.blue}` : "2px solid transparent", marginBottom: -1 }}>
            {t.label}
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: tab === t.id ? c.blue : c.blueLight, color: tab === t.id ? "#fff" : c.txt3 }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {displayed.map(o => {
          const st = STATUS_META[o.status];
          return (
            <Card key={o.id} dk={dk} style={{ padding: "16px 20px" }}>
              <div className="flex items-start gap-4 flex-wrap">
                {/* QR icon */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#000" }}>
                  <QrCode size={28} className="text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-48">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="font-bold" style={{ color: c.txt }}>{o.id}</p>
                    <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                    {o.cnas && <Badge color={c.blue} bg={c.blueLight}>CNAS</Badge>}
                  </div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: c.txt }}>
                    👤 {o.patient}
                    <span className="font-normal ml-2" style={{ color: c.txt2 }}>— {o.doctor}</span>
                  </p>
                  <div className="space-y-0.5 mt-2">
                    {o.items.map(item => (
                      <p key={item} className="text-sm" style={{ color: c.txt2 }}>• {item}</p>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold mb-0.5" style={{ color: c.blue }}>
                    {o.total.toLocaleString()} DZD
                  </p>
                  <p className="text-xs mb-3" style={{ color: c.txt3 }}>{o.date}</p>
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {o.status === "processing" && (
                      <button onClick={() => markReady(o.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                        style={{ background: c.green }}>
                        ✓ Marquer prêt
                      </button>
                    )}
                    {o.status === "ready" && (
                      <button onClick={() => markDelivered(o.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                        style={{ background: c.blue }}>
                        🚚 Livré
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                      style={{ borderColor: c.border, color: c.txt2 }}>
                      👁 Détails
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

// ─── PAGE: STATISTIQUES ───────────────────────────────────────────────────────
function StatistiquesPage({ dk }) {
  const c = dk ? T.dark : T.light;

  const monthlyData = [
    { month: "Oct", ventes: 62, cnas: 38 }, { month: "Nov", ventes: 75, cnas: 44 },
    { month: "Déc", ventes: 88, cnas: 52 }, { month: "Jan", ventes: 71, cnas: 43 },
    { month: "Fév", ventes: 83, cnas: 50 }, { month: "Mar", ventes: 91, cnas: 57 },
  ];
  const maxVal = 100;

  const topMeds = [
    { name: "Paracetamol 1g",   qty: 480, pct: 95, color: c.blue  },
    { name: "Aspirin 100mg",    qty: 330, pct: 68, color: c.green },
    { name: "Vitamin D3 2000IU",qty: 215, pct: 44, color: "#7B5EA7" },
    { name: "Lisinopril 10mg",  qty: 142, pct: 30, color: c.amber },
    { name: "Ibuprofen 400mg",  qty: 155, pct: 32, color: c.red   },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>Statistiques</h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Analyse des ventes et remboursements CNAS</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Ventes ce mois",    value: "1 248 400 DZD", icon: DollarSign,   color: c.blue,  trend: 9  },
          { label: "Remboursé CNAS",    value: "773 600 DZD",   icon: Shield,       color: c.green, trend: 5  },
          { label: "Ordonnances traitées",value: "342",          icon: FileText,     color: "#7B5EA7",trend: 14 },
          { label: "Clients uniques",   value: "128",           icon: Users,        color: c.amber, trend: 3  },
        ].map(s => <StatCard key={s.label} {...s} dk={dk} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Bar chart ventes vs CNAS */}
        <Card dk={dk}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ color: c.txt }}>Ventes vs Remboursements CNAS</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1" style={{ color: c.blue }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.blue }}></span> Ventes
              </span>
              <span className="flex items-center gap-1" style={{ color: c.green }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.green }}></span> CNAS
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-44">
            {monthlyData.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5" style={{ height: 160 }}>
                  <div className="flex-1 rounded-t transition-all"
                    style={{ height: `${m.ventes / maxVal * 100}%`, background: c.blue, opacity: 0.85 }} />
                  <div className="flex-1 rounded-t transition-all"
                    style={{ height: `${m.cnas / maxVal * 100}%`, background: c.green, opacity: 0.85 }} />
                </div>
                <span className="text-xs font-medium" style={{ color: c.txt3 }}>{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top médicaments */}
        <Card dk={dk}>
          <h3 className="font-bold mb-5" style={{ color: c.txt }}>Top médicaments vendus</h3>
          <div className="space-y-4">
            {topMeds.map(med => (
              <div key={med.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold" style={{ color: c.txt }}>{med.name}</p>
                  <span className="text-xs font-bold" style={{ color: med.color }}>{med.qty} unités</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${med.pct}%`, background: med.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Catégories */}
        <Card dk={dk}>
          <h3 className="font-bold mb-5" style={{ color: c.txt }}>Répartition par catégorie</h3>
          <div className="space-y-3">
            {[
              { label: "Cardiologie",  pct: 32, color: c.blue   },
              { label: "Antalgiques",  pct: 28, color: c.green  },
              { label: "Diabétologie", pct: 18, color: c.amber  },
              { label: "Vitamines",    pct: 12, color: "#7B5EA7" },
              { label: "Autres",       pct: 10, color: c.txt3   },
            ].map(cat => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="text-sm w-28 shrink-0" style={{ color: c.txt2 }}>{cat.label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
                  <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: cat.color }} />
                </div>
                <span className="text-xs font-bold w-8 text-right" style={{ color: cat.color }}>{cat.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* CNAS détail */}
        <Card dk={dk} style={{ background: "linear-gradient(135deg, #304B71, #6492C9)", border: "none" }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-4 text-white opacity-70">Bilan CNAS — Mars 2026</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Remboursé",  value: "773 600 DZD" },
              { label: "En attente", value: "124 800 DZD"  },
              { label: "Rejeté",     value: "18 200 DZD"   },
              { label: "Taux",       value: "62%"          },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.12)" }}>
                <p className="text-xs text-white opacity-70">{item.label}</p>
                <p className="text-base font-bold text-white mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

// ─── PAGE: PARAMÈTRES ─────────────────────────────────────────────────────────
function ParametresPage({ dk, onToggleDark }) {
  const c = dk ? T.dark : T.light;
  const [form, setForm] = useState({
    name: "Pharmacie El Shifa",
    address: "12 Rue Didouche Mourad, Alger Centre",
    phone: "+213 21 63 44 17",
    license: "PH-16-2018-0472",
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>Paramètres</h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Configuration de la pharmacie</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card dk={dk}>
          <p className="font-semibold mb-5" style={{ color: c.txt }}>Informations pharmacie</p>
          {[
            { label: "Nom de la pharmacie", key: "name" },
            { label: "Adresse", key: "address" },
            { label: "Téléphone", key: "phone" },
            { label: "N° Licence", key: "license" },
          ].map(f => (
            <div key={f.key} className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt2 }}>{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt }} />
            </div>
          ))}
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: c.blue }}>
            Enregistrer
          </button>
        </Card>

        <div className="space-y-5">
          <Card dk={dk}>
            <p className="font-semibold mb-5" style={{ color: c.txt }}>Préférences</p>
            <div className="space-y-4">
              {[
                { label: "Alertes stock critique",   on: true  },
                { label: "Notifications CNAS",        on: true  },
                { label: "Rappels expiration",        on: true  },
                { label: "Mode sombre",               on: dk, toggle: true },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: c.txt }}>{item.label}</span>
                  <button onClick={item.toggle ? onToggleDark : undefined}
                    className="relative w-10 h-5 rounded-full transition-colors"
                    style={{ background: item.on ? c.blue : c.border }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                      style={{ left: item.on ? "22px" : "2px" }} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
          <Card dk={dk}>
            <p className="font-semibold mb-3" style={{ color: c.txt }}>Connexion CNAS</p>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-3"
              style={{ background: "#2D8C6F12", border: "1px solid #2D8C6F30" }}>
              <CheckCircle size={18} style={{ color: c.green }} />
              <p className="text-sm font-semibold" style={{ color: c.green }}>Connecté — Conventionné</p>
            </div>
            <p className="text-xs" style={{ color: c.txt3 }}>Dernière sync : Aujourd'hui 08:32</p>
          </Card>
          <Card dk={dk}>
            <p className="font-semibold mb-2" style={{ color: c.txt }}>À propos</p>
            <p className="text-sm" style={{ color: c.txt2 }}>MedSmart Pharmacie v2.1.0</p>
            <p className="text-xs mt-1" style={{ color: c.txt3 }}>CNAS Certifié · Hébergé en Algérie</p>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── MAIN SHELL ───────────────────────────────────────────────────────────────
export default function PharmacistDashboard({ onLogout }) {
  const [page, setPage] = useState("accueil");
  const [dk, setDk] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notifCount] = useState(3);
  const c = dk ? T.dark : T.light;

  const NAV = [
    { id: "accueil",     label: "Accueil"       },
    { id: "commandes",   label: "Commandes",  badge: 2 },
    { id: "stock",       label: "Stock"         },
    { id: "statistiques",label: "Statistiques"  },
  ];

  const renderPage = () => {
    switch (page) {
      case "accueil":      return <HomePage dk={dk} onNav={setPage} />;
      case "commandes":    return <CommandesPage dk={dk} />;
      case "stock":        return <StockPage dk={dk} />;
      case "statistiques": return <StatistiquesPage dk={dk} />;
      case "parametres":   return <ParametresPage dk={dk} onToggleDark={() => setDk(!dk)} />;
      default:             return <HomePage dk={dk} onNav={setPage} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: c.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: c.txt, transition: "background 0.3s, color 0.2s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s; }
        button { cursor: pointer !important; }
        select { cursor: pointer !important; }
        label  { cursor: pointer !important; }
        .nav-link:not(.active-nav):hover { background: rgba(100,146,201,0.15) !important; color: #6492C9 !important; }
        @keyframes dropdownIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .pd-item { color:#64748B; background:transparent; transition:background 0.15s,color 0.15s; }
        .pd-item:hover { background:#F8FAFC; color:#1E293B; }
        .pd-item-danger { color:#EF4444; background:transparent; transition:background 0.15s; }
        .pd-item-danger:hover { background:rgba(239,68,68,0.08); }
      `}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-30 border-b shadow-sm" style={{ background: c.nav, borderColor: c.border }}>
        <div className="w-full px-6 h-[60px] flex items-center gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="20" rx="2" fill="white" opacity="0.95"/>
                <rect x="2" y="9" width="20" height="6" rx="2" fill="white" opacity="0.95"/>
                <path d="M4 14 L6 10 L8 13 L10 7 L12 15 L14 11 L16 13 L18 11"
                  stroke="#6492C9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm" style={{ color: c.txt }}>MedSmart</span>
              <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: "#2D8C6F18", color: "#2D8C6F" }}>
                Pharmacien
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center justify-center gap-2 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={`nav-link${page === item.id ? " active-nav" : ""} relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all`}
                style={{ color: page === item.id ? "#fff" : c.txt2, background: page === item.id ? c.blue : "transparent" }}>
                {item.label}
                {item.badge && (
                  <span className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: c.red }}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 ml-auto shrink-0">

            {/* Profile */}
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 z-10 flex items-center justify-center"
                style={{ borderColor: c.nav, fontSize: 7, color: "#fff", fontWeight: 800, pointerEvents: "none" }}>
                {notifCount}
              </div>
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
                style={{ border: `1px solid ${c.border}`, background: "transparent" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #2D8C6F, #3aaa88)" }}>
                  ES
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight" style={{ color: c.txt }}>El Shifa Pharmacy</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>Pharmacien · Alger</p>
                </div>
                <ChevronDown size={13} style={{ color: c.txt3 }} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-60 rounded-[20px] overflow-hidden z-50"
                  style={{ background: dk ? c.card : "#ffffff", border: `1px solid ${dk ? c.border : "#F1F5F9"}`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)", animation: "dropdownIn 0.2s ease forwards" }}>

                  <div className="px-4 py-3 border-b" style={{ borderColor: dk ? c.border : "#F1F5F9" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #2D8C6F, #3aaa88)" }}>ES</div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: c.txt }}>El Shifa Pharmacy</p>
                        <p className="text-xs" style={{ color: c.txt3 }}>Pharmacien · CNAS Conventionné</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <button onClick={() => { setPage("parametres"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Bell size={16} />
                      Notifications
                      <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#E05555", color: "#fff" }}>{notifCount}</span>
                    </button>
                    <button onClick={() => { setPage("parametres"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Settings size={16} /> Paramètres
                    </button>

                    {/* Dark mode */}
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Sun size={14} style={{ color: dk ? c.txt3 : "#E8A838" }} />
                      <button
                        onClick={() => setDk(!dk)}
                        className="relative rounded-full transition-all duration-300"
                        style={{
                          width: 42,
                          height: 24,
                          background: dk ? "linear-gradient(135deg, #304B71, #4A6FA5)" : "#D5DEEF",
                          border: `1.5px solid ${dk ? c.blue + "80" : "#BBC8DC"}`,
                          padding: 0,
                        }}
                      >
                        <div
                          className="absolute top-0.5 rounded-full bg-white shadow-md transition-all duration-300"
                          style={{ width: 18, height: 18, left: dk ? 20 : 2 }}
                        />
                      </button>
                      <Moon size={13} style={{ color: dk ? c.blue : c.txt3 }} />
                    </button>

                    <div className="h-px my-1 mx-2" style={{ background: dk ? c.border : "#F1F5F9" }} />
                    <button onClick={onLogout}
                      className="pd-item-danger w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl cursor-pointer">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ color: c.txt2 }} onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu size={17} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenu && (
          <div className="lg:hidden border-t px-4 py-3 flex flex-wrap gap-2"
            style={{ borderColor: c.border, background: c.nav }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => { setPage(item.id); setMobileMenu(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: page === item.id ? "#fff" : c.txt2, background: page === item.id ? c.blue : "transparent" }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Page */}
      <main className="w-full px-6 py-6">{renderPage()}</main>

      {profileOpen && <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />}
    </div>
  );
}