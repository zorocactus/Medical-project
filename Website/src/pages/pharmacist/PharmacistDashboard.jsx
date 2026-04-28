import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import ErrorBoundary from "../../components/ErrorBoundary";
import DashSelect from "../../components/ui/DashSelect";
import { ParticlesHero } from '../../components/backgrounds/MedParticles';
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import {
  Search, Bell, Settings, LogOut, Menu, ChevronDown, Sun, Moon,
  Package, Pill, ShoppingCart, FileText, AlertTriangle, Check,
  X, Plus, Minus, QrCode, TrendingUp, TrendingDown, AlertCircle,
  Clock, CheckCircle, Eye, Download, Filter, RefreshCw, Truck,
  BarChart2, Users, DollarSign, Archive, User, ChevronRight,
  Zap, Shield, Activity, Send, Phone, MapPin, Link2, MessageSquare
} from "lucide-react";
import ChatButton from "../../components/chat/ChatButton";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import { useLanguage } from "../../context/LanguageContext";
import { T } from "../_shared/theme";

// ─── Données de démonstration ─────────────────────────────────────────────────
// Activées uniquement en développement — jamais visibles en production.
const STOCK = [];

const ORDERS = [];

const ALERTS = [];
const NOTIFICATIONS = [];

const STATUS_META = {
  new:        { label: "new_status",   color: "#4A6FA5", bg: "#4A6FA518" },
  processing: { label: "processing_status",  color: "#E8A838", bg: "#E8A83818" },
  ready:      { label: "ready_status",       color: "#2D8C6F", bg: "#2D8C6F18" },
  delivered:  { label: "delivered_status",   color: "#9AACBE", bg: "#9AACBE18" },
  cancelled:  { label: "cancelled_status",     color: "#E05555", bg: "#E0555518" },
};

const WILAYAS_LIST = [
  "Alger","Oran","Constantine","Annaba","Blida","Batna","Sétif","Tlemcen",
  "Tizi Ouzou","Béjaïa","Jijel","Médéa","Mostaganem","Bouira","Bordj Bou Arréridj",
  "Boumerdès","Tipaza","Aïn Defla","Tissemsilt","Relizane","Chlef","Skikda",
  "Guelma","Souk Ahras","El Tarf","Mila","Khenchela","Oum El Bouaghi","Tébessa",
  "Biskra","Djelfa","Laghouat","El Bayadh","Naâma","Saïda","Mascara","Tiaret",
  "Adrar","Béchar","Tamanrasset","Illizi","Tindouf","El Oued","Ouargla",
  "Ghardaïa","Aïn Témouchent","Sidi Bel Abbès","Autres",
];

const STOCK_CATEGORIES = [
  "cardiology_label", "diabetology_label", "antibiotics_label", "analgesics_label",
  "gastro_label", "vitamins_label", "neurology_label", "dermatology_label", "pediatrics_label", "others_label",
];

// ─── Reusable components ──────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk, empty = false }) {
  const c = dk ? T.dark : T.light;
  const hoverClasses = empty ? "" : "card-hover";
  return (
    <div className={`rounded-2xl p-5 shadow-sm border ${hoverClasses} ${className}`}
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
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const [scanned, setScanned] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitToken = async () => {
    setError("");
    if (!token.trim()) {
      setError(t('qr_token_required') || "Saisissez le contenu du QR code.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.scanPrescriptionQr(token.trim());
      setScanned(true);
      setTimeout(() => {
        onScan?.(result);
        onClose();
      }, 800);
    } catch (err) {
      setError(err?.message || (t('qr_invalid_token') || "QR invalide ou expiré."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-2xl p-8 w-full max-w-sm shadow-2xl border"
        style={{ background: c.card, borderColor: c.border }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold" style={{ color: c.txt }}>{t('scan_order_btn') || "Scanner une ordonnance"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors hover:opacity-70"
            style={{ borderColor: c.border, color: c.txt3 }}>
            <X size={15} />
          </button>
        </div>

        {/* Camera zone */}
        <div className="relative rounded-2xl overflow-hidden mb-5"
          style={{ background: "#000", height: 180 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 relative">
              {[["top-0 left-0","border-t-2 border-l-2"],["top-0 right-0","border-t-2 border-r-2"],
                ["bottom-0 left-0","border-b-2 border-l-2"],["bottom-0 right-0","border-b-2 border-r-2"]
              ].map(([pos, border], i) => (
                <div key={i} className={`absolute w-5 h-5 ${pos} ${border} rounded-sm`}
                  style={{ borderColor: scanned ? "#2D8C6F" : "#6492C9" }} />
              ))}
              <QrCode size={56} className="absolute inset-0 m-auto"
                style={{ color: scanned ? "#2D8C6F" : "rgba(255,255,255,0.15)" }} />
            </div>
          </div>
          {scanned && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(45,140,111,0.3)" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "#2D8C6F" }}>
                <Check size={28} className="text-white" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        {/* Saisie manuelle (fallback caméra) */}
        <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt2 }}>
          {t('qr_token_label') || "Contenu du QR code"}
        </label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t('qr_token_placeholder') || "Collez le token QR ici…"}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border mb-3"
          style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt }}
        />

        {error && (
          <p className="text-xs font-semibold mb-3 px-3 py-2 rounded-lg border"
             style={{ color: "#E05555", background: "#E0555518", borderColor: "#E0555544" }}>
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={submitToken}
            disabled={loading || scanned}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: c.blue }}
          >
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {scanned ? (t('in_progress') || "Traitement…") : (t('validate_btn') || "Valider")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: c.border, color: c.txt2 }}
          >
            {t('cancel_btn') || "Annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: DÉTAILS COMMANDE ──────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, dk }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const st = STATUS_META[order.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl border"
        style={{ background: c.card, borderColor: c.border }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold" style={{ color: c.txt }}>{t('order_details_title') || "Détails de la commande"}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors hover:opacity-70"
            style={{ borderColor: c.border, color: c.txt3 }}>
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4">
          {/* ID + Statut */}
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: dk ? "#1A2333" : "#F8FAFC" }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: c.txt3 }}>{t('reference_label') || "Référence"}</p>
              <p className="font-bold text-sm" style={{ color: c.txt }}>{order.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {order.cnas && <Badge color={c.blue} bg={c.blueLight}>CNAS</Badge>}
              <Badge color={st.color} bg={st.bg}>{t(st.label) || st.label}</Badge>
            </div>
          </div>

          {/* Patient & Médecin */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl" style={{ background: dk ? "#1A2333" : "#F8FAFC" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: c.txt3 }}>{t('patient_label') || "Patient"}</p>
              <p className="text-sm font-semibold" style={{ color: c.txt }}>{order.patient}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: dk ? "#1A2333" : "#F8FAFC" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: c.txt3 }}>{t('doctor_label') || "Médecin"}</p>
              <p className="text-sm font-semibold" style={{ color: c.txt }}>{order.doctor}</p>
            </div>
          </div>

          {/* Médicaments */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>{t('prescribed_meds_label') || "Médicaments prescrits"}</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: dk ? "#1A2333" : "#F8FAFC" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: c.blueLight }}>
                    <Pill size={13} style={{ color: c.blue }} />
                  </div>
                  <p className="text-sm" style={{ color: c.txt }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 rounded-xl border-2"
            style={{ background: c.blueLight, borderColor: c.blue + "33" }}>
            <p className="font-bold" style={{ color: c.txt }}>{t('total_to_pay_label') || "Total à payer"}</p>
            <p className="text-xl font-bold" style={{ color: c.blue }}>
              {order.total.toLocaleString()} DZD
            </p>
          </div>
        </div>

        <button onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
          style={{ borderColor: c.border, color: c.txt2 }}>
          {t('close_btn') || "Fermer"}
        </button>
      </div>
    </div>
  );
}

// ─── MODAL: AJOUTER UN ARTICLE (STOCK) ───────────────────────────────────────
function AddItemModal({ onClose, onAdd, dk }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const [form, setForm] = useState({
    name: "", molecule: "", category: "", expiry: "",
    qty: "", min: "", price: "",
  });

  const inputStyle = { background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt };
  const labelCls = "block text-xs font-bold uppercase tracking-wide mb-1.5";

  const handleAdd = () => {
    if (!form.name.trim() || !form.category) return;
    onAdd({
      id: Date.now(),
      name:     form.name,
      molecule: form.molecule,
      category: form.category,
      expiry:   form.expiry || "2027-01-01",
      qty:      parseInt(form.qty)   || 0,
      min:      parseInt(form.min)   || 0,
      price:    parseInt(form.price) || 0,
      cnas:     false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl border"
        style={{ background: c.card, borderColor: c.border }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold" style={{ color: c.txt }}>{t('add_item_title') || "Ajouter un article"}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors hover:opacity-70"
            style={{ borderColor: c.border, color: c.txt3 }}>
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Nom du médicament */}
          <div>
            <label className={labelCls} style={{ color: c.txt2 }}>{t('med_name_label') || "Nom du médicament"}</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Paracetamol 500mg"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={inputStyle} />
          </div>

          {/* Molécule */}
          <div>
            <label className={labelCls} style={{ color: c.txt2 }}>{t('med_molecule_label') || "Molécule"}</label>
            <input value={form.molecule} onChange={e => setForm(f => ({ ...f, molecule: e.target.value }))}
              placeholder="Ex: Acetaminophen"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={inputStyle} />
          </div>

          {/* Catégorie — DashSelect */}
          <DashSelect
            label={t('category_label') || "Catégorie"} value={form.category} options={STOCK_CATEGORIES.map(c => t(c) || c)}
            onSelect={v => setForm(f => ({ ...f, category: v }))}
            dk={dk} c={c} placeholder={t('choose_category_placeholder') || "Choisir une catégorie..."} />

          {/* Date d'expiration */}
          <div>
            <label className={labelCls} style={{ color: c.txt2 }}>{t('expiry_date_label') || "Date d'expiration"}</label>
            <input type="date" value={form.expiry}
              onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={inputStyle} />
          </div>

          {/* Champs numériques */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('qty_in_stock_label') || "Qté en stock", key: "qty",   placeholder: "0" },
              { label: t('qty_min_alert_label') || "Qté min. alerte", key: "min",   placeholder: "0" },
              { label: t('price_label') || "Prix (DZD)",   key: "price", placeholder: "0" },
            ].map(f => (
              <div key={f.key}>
                <label className={labelCls} style={{ color: c.txt2 }}>{f.label}</label>
                <input
                  value={form[f.key]}
                  onChange={e => { const val = e.target.value.replace(/\D/g, ""); setForm(p => ({ ...p, [f.key]: val })); }}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                  style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: c.border, color: c.txt2 }}>
            {t('cancel_btn') || "Annuler"}
          </button>
          <button onClick={handleAdd}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: c.blue, opacity: !form.name || !form.category ? 0.5 : 1 }}>
            {t('save_btn') || "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: ACCUEIL ────────────────────────────────────────────────────────────
function HomePage({ dk, onNav }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const [showQr, setShowQr] = useState(false);
  const [newOrder, setNewOrder] = useState(false);

  const stats = [
    { label: t('orders_today_label') || "Commandes aujourd'hui",  value: "24",         icon: ShoppingCart,  color: c.blue,   trend: 12 },
    { label: t('daily_revenue_label') || "Revenus du jour",         value: "84 200 DZD", icon: DollarSign,    color: c.green,  trend: 8  },
    { label: t('stock_meds_label') || "Médicaments en stock",    value: "1 548",      icon: Package,       color: "#7B5EA7", trend: -3 },
    { label: t('stock_alerts_count_label') || "Alertes stock",           value: "4",          icon: AlertTriangle, color: c.red,    trend: undefined },
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
            <p className="font-bold text-sm" style={{ color: c.txt }}>{t('scanned_success') || "Ordonnance scannée avec succès"}</p>
            <p className="text-xs" style={{ color: c.txt2 }}>{t('order_created_desc', {id: 'ORD-2026-0482', patient: 'Alex Johnson', med: 'Lisinopril 10mg ×30'}) || "Commande ORD-2026-0482 créée — Alex Johnson · Lisinopril 10mg ×30"}</p>
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
          <Card dk={dk} empty={true}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: c.txt }}>{t('priority_alerts_title') || "Alertes prioritaires"}</h3>
              <Badge color={c.red} bg={c.red + "18"}>{t('alerts_count', {count: ALERTS.length}) || `${ALERTS.length} alertes`}</Badge>
            </div>
            <div className="space-y-3">
              {ALERTS.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer card-hover"
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
          <Card dk={dk} empty={true}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: c.txt }}>{t('latest_orders_title') || "Dernières commandes"}</h3>
              <button onClick={() => onNav("commandes")}
                className="text-sm font-semibold hover:underline" style={{ color: c.blue }}>
                {t('view_all_btn') || "Voir tout"}
              </button>
            </div>
            <div className="space-y-3">
              {ORDERS.slice(0, 3).map(o => {
                const st = STATUS_META[o.status];
                return (
                  <div key={o.id} className="flex items-center gap-4 p-3 rounded-xl border cursor-pointer card-hover"
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
                      <Badge color={st.color} bg={st.bg}>{t(st.label) || st.label}</Badge>
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
          <Card dk={dk} empty={true}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>{t('stock_alerts_count_label') || "Stock critique"}</p>
              <button onClick={() => onNav("stock")} className="text-xs font-semibold hover:underline" style={{ color: c.blue }}>
                {t('manage_btn') || "Gérer"}
              </button>
            </div>
            {STOCK.filter(s => s.qty < s.min).map(item => (
              <div key={item.id} className="flex items-center gap-3 py-3 px-2 border-b last:border-0 cursor-pointer card-hover"
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
          <Card dk={dk} empty={true}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>{t('notifications_label') || "Notifications"}</p>
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
            </div>
            <div className="space-y-3">
              {NOTIFICATIONS.slice(0, 3).map(n => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl cursor-pointer card-hover"
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
            <p className="text-xs font-bold uppercase tracking-wide mb-2 text-white opacity-70">{t('cnas_today_title') || "CNAS — Aujourd'hui"}</p>
            <p className="text-2xl font-bold text-white">52 400 DZD</p>
            <p className="text-sm text-white opacity-80 mt-0.5">{t('reimbursed_on_desc', {total: '84 200'}) || "remboursé sur 84 200 DZD"}</p>
            <div className="w-full h-2 rounded-full mt-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div className="h-full rounded-full bg-white" style={{ width: "62%" }} />
            </div>
            <p className="text-xs text-white opacity-60 mt-1.5">{t('covered_by_cnas_desc', {percent: 62}) || "62% couvert par la CNAS"}</p>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── PAGE: STOCK ──────────────────────────────────────────────────────────────
function StockPage({ dk }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | critical | ok
  const [editQty, setEditQty] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const mapStockRow = (row) => {
    const m = row.medication_details || {};
    return {
      id:       row.id,
      name:     m.name || `Médicament #${row.medication}`,
      molecule: m.molecule || "",
      qty:      Number(row.quantity) || 0,
      min:      Number(m.min_threshold) || 10,
      price:    Number(row.selling_price) || Number(m.price_dzd) || 0,
      cnas:     !!m.cnas_covered,
      category: m.category || "—",
      expiry:   row.expiry_date || "—",
    };
  };

  const reload = async () => {
    setLoading(true);
    try {
      const data = await api.getPharmacyStock();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setStockItems(list.map(mapStockRow));
    } catch (err) {
      console.error("Erreur chargement stock:", err);
      setStockItems([]);
      setBanner({ type: "error", msg: err?.message || "Erreur lors du chargement du stock." });
      setTimeout(() => setBanner(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const handleSaveQty = async (item) => {
    const newQty = parseInt(editValue, 10);
    if (Number.isNaN(newQty) || newQty < 0) {
      setBanner({ type: "error", msg: "Quantité invalide." });
      setTimeout(() => setBanner(null), 3000);
      return;
    }
    const previous = stockItems;
    setStockItems(prev => prev.map(s => s.id === item.id ? { ...s, qty: newQty } : s));
    setUpdatingId(item.id);
    try {
      await api.updatePharmacyStock(item.id, { quantity: newQty });
      setEditQty(null);
      setBanner({ type: "success", msg: "Stock mis à jour." });
    } catch (err) {
      setStockItems(previous);
      setBanner({ type: "error", msg: err?.message || "Échec de la mise à jour." });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setBanner(null), 3000);
    }
  };

  const allStock = stockItems;

  const filtered = allStock.filter(s => {
    const matchSearch = (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
                        (s.molecule || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "critical") return matchSearch && s.qty < s.min;
    if (filter === "ok")       return matchSearch && s.qty >= s.min;
    return matchSearch;
  });

  const getStockStatus = (item) => {
    const pct = item.qty / item.min;
    if (pct < 0.4) return { label: t('critical_status') || "Critique",   color: c.red,   bg: c.red + "18" };
    if (pct < 1.0) return { label: t('low_status') || "Bas",        color: c.amber, bg: c.amber + "18" };
    return          { label: t('normal_status') || "Normal",    color: c.green, bg: c.green + "18" };
  };

  return (
    <>
      {showAddModal && (
        <AddItemModal
          dk={dk}
          onClose={() => setShowAddModal(false)}
          onAdd={async (item) => {
            // Persiste côté backend (medication_id requis si dispo, sinon le payload sera rejeté)
            try {
              await api.createPharmacyStock({
                medication: item.medication_id,
                quantity:   item.qty,
                selling_price: item.price,
                expiry_date: item.expiry,
              });
              await reload();
              setBanner({ type: "success", msg: "Article ajouté." });
            } catch (err) {
              setBanner({ type: "error", msg: err?.message || "Échec de l'ajout." });
            } finally {
              setTimeout(() => setBanner(null), 4000);
            }
          }}
        />
      )}

      {banner && (
        <div
          className="mb-4 px-4 py-2.5 rounded-xl border text-sm font-semibold"
          style={{
            background: (banner.type === "success" ? c.green : c.red) + "18",
            borderColor: (banner.type === "success" ? c.green : c.red) + "44",
            color: banner.type === "success" ? c.green : c.red,
          }}
        >
          {banner.msg}
        </div>
      )}

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>{t('stock_management_title') || "Gestion du Stock"}</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>{t('references_count', {count: allStock.length}) || `${allStock.length} références`} · {t('out_of_stock_count', {count: allStock.filter(s => s.qty < s.min).length}) || `${allStock.filter(s => s.qty < s.min).length} en rupture`}</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: c.blue }}>
          <Plus size={15} /> {t('add_item_btn') || "Ajouter un article"}
        </button>
      </div>

      {/* Filters */}
      <Card dk={dk} className="mb-5" style={{ padding: "12px 16px" }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-48 rounded-xl px-3 py-2"
            style={{ background: c.blueLight }}>
            <Search size={14} style={{ color: c.txt3 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('search_med_placeholder') || "Rechercher médicament…"} className="outline-none text-sm bg-transparent flex-1"
              style={{ color: c.txt }} />
          </div>
          <div className="flex gap-2">
            {[[ "all", t('all_orders_tab') || "Tout" ], [ "critical", t('critical_status') || "Critique" ], [ "ok", t('normal_status') || "Normal" ]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{ background: filter === val ? c.blue : "transparent", color: filter === val ? "#fff" : c.txt2, borderColor: filter === val ? c.blue : c.border }}>
                {label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: c.border, color: c.txt2 }}>
            <Download size={13} /> {t('export_btn') || "Exporter"}
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card dk={dk} empty={true} style={{ padding: 0, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}`, background: dk ? "rgba(255,255,255,0.02)" : "#FAFBFD" }}>
                {[
                  t('medication_table_header') || "Médicament",
                  t('molecule_table_header') || "Molécule",
                  t('category_table_header') || "Catégorie",
                  t('stock_table_header') || "Stock",
                  t('min_table_header') || "Min.",
                  t('status_table_header') || "Statut",
                  t('expiration_table_header') || "Expiration",
                  t('price_table_header') || "Prix",
                  t('actions_table_header') || "Actions"
                ].map(h => (
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
                          <button onClick={() => handleSaveQty(item)}
                            disabled={updatingId === item.id}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs disabled:opacity-50"
                            style={{ background: c.green, color: "#fff" }}>
                            {updatingId === item.id ? "…" : "✓"}
                          </button>
                          <button onClick={() => { setEditQty(null); setEditValue(""); }}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs"
                            style={{ background: c.red, color: "#fff" }}>✕</button>
                          <input
                            type="number"
                            min={0}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-16 px-2 py-1 rounded-lg text-xs outline-none border"
                            style={{ background: c.blueLight, borderColor: c.border, color: c.txt }}
                          />
                        </div>
                      ) : (
                        <span className="text-sm font-bold" style={{ color: st.color }}>{item.qty}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: c.txt3 }}>{item.min}</td>
                    <td className="px-4 py-3"><Badge color={st.color} bg={st.bg}>{t(st.label) || st.label}</Badge></td>
                    <td className="px-4 py-3 text-xs" style={{ color: new Date(item.expiry) < new Date() ? c.red : c.txt3 }}>
                      {new Date(item.expiry).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: c.blue }}>{item.price} DZD</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { setEditQty(item.id); setEditValue(String(item.qty)); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors hover:opacity-70"
                          style={{ borderColor: c.border, color: c.txt3 }}
                          title="Modifier la quantité"
                        >
                          <RefreshCw size={12} />
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
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const [tab, setTab]                   = useState("all");
  const [showQr, setShowQr]             = useState(false);
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [loadError, setLoadError]       = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);

  const mapOrder = (o) => {
    const status = (o.status || "new").toLowerCase();
    // Backend statuses (typiques) : pending|preparing|ready|delivered|cancelled
    const statusMap = { pending: "new", preparing: "processing", ready: "ready", delivered: "delivered", cancelled: "cancelled" };
    const displayStatus = statusMap[status] || status;
    const itemsArr = Array.isArray(o.items)
      ? o.items.map(it => {
          const name = it.drug_name || it.medication_name || it.name || "";
          const qty  = it.quantity || it.duration || "";
          return qty ? `${name} ×${qty}` : name;
        })
      : [];
    const dateStr = o.created_at ? new Date(o.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
    return {
      id: o.prescription_ref || `ORD-${o.id}`,
      _rawId: o.id,
      patient: o.patient_name || "Patient",
      doctor: o.doctor_name || "",
      date: dateStr,
      status: displayStatus,
      items: itemsArr,
      total: o.total || 0,
      cnas: !!o.cnas_covered,
      source: o.order_type === "direct" ? "scan" : "click_collect",
    };
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getPharmacyOrders();
      const results = Array.isArray(data) ? data : (data?.results || []);
      setOrders(results.map(mapOrder));
      setLoadError("");
    } catch (err) {
      console.error("Erreur chargement commandes:", err);
      setLoadError(err?.message || "Erreur lors du chargement des commandes.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const newCount = orders.filter(o => o.status === "new").length;

  const tabs = [
    { id: "all",        label: t('all_orders_tab') || "Toutes",       count: orders.length },
    { id: "new",        label: t('new_orders_tab') || "Nouvelles",     count: newCount, accent: true },
    { id: "processing", label: t('processing_orders_tab') || "En prépa.",     count: orders.filter(o => o.status === "processing").length },
    { id: "ready",      label: t('ready_orders_tab') || "Prêtes",        count: orders.filter(o => o.status === "ready").length },
    { id: "delivered",  label: t('delivered_orders_tab') || "Récupérées",    count: orders.filter(o => o.status === "delivered").length },
  ];

  const displayed = tab === "all" ? orders : orders.filter(o => o.status === tab);

  // Mapping display status → backend status pour PATCH
  const BACK_STATUS = { processing: "preparing", ready: "ready", delivered: "delivered" };

  const updateOrderStatus = async (o, nextDisplayStatus) => {
    const backendStatus = BACK_STATUS[nextDisplayStatus] || nextDisplayStatus;
    const rawId = o._rawId;
    // Optimistic update
    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: nextDisplayStatus } : x));
    // Si c'est un mock (pas de _rawId), ne fait que local
    if (!rawId) return;
    setUpdatingId(o.id);
    try {
      await api.apiFetch(`/pharmacy/orders/${rawId}/status/`, {
        method: "PATCH",
        body: JSON.stringify({ status: backendStatus }),
      });
    } catch (err) {
      console.error("Erreur update statut commande:", err);
      // Revert optimistic update
      setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: o.status } : x));
      setLoadError(err?.message || "Impossible de mettre à jour le statut.");
      setTimeout(() => setLoadError(""), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  const acceptOrder   = (order) => updateOrderStatus(order, "processing");
  const markReady     = (order) => updateOrderStatus(order, "ready");
  const markDelivered = (order) => updateOrderStatus(order, "delivered");

  return (
    <>
      {showQr && (
        <QrModal
          dk={dk}
          onClose={() => setShowQr(false)}
          onScan={() => loadOrders()}
        />
      )}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} dk={dk} onClose={() => setSelectedOrder(null)} />
      )}

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>{t('orders_today_label') || "Commandes"}</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            {t('processing_orders_desc') || "Gérez les ordonnances et dispensations"}
            {newCount > 0 && (
              <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: c.blue }}>{newCount} {t('new_orders_count', {count: newCount}) || `nouvelle${newCount > 1 ? "s" : ""}`}</span>
            )}
          </p>
        </div>
        <button onClick={() => setShowQr(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: c.blue }}>
          <QrCode size={15} /> {t('scan_order_btn') || "Scanner ordonnance"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-5 overflow-x-auto" style={{ borderColor: c.border, scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap shrink-0"
            style={{
              color: tab === t.id ? c.blue : c.txt2,
              borderBottom: tab === t.id ? `2px solid ${c.blue}` : "2px solid transparent",
              marginBottom: -1,
            }}>
            {t.label}
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: tab === t.id ? c.blue : t.accent && t.count > 0 ? c.blue + "22" : c.blueLight,
                color:      tab === t.id ? "#fff"   : t.accent && t.count > 0 ? c.blue       : c.txt3,
              }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loadError && (
        <div
          className="mb-4 px-3 py-2 rounded-lg text-xs font-semibold border"
          style={{ background: c.red + "18", borderColor: c.red + "44", color: c.red }}
        >
          {loadError}
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-12" style={{ color: c.txt3 }}>
            <span className="inline-block w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: c.blue, borderTopColor: "transparent" }} />
            <p className="text-sm font-semibold mt-2">Chargement…</p>
          </div>
        )}
        {!loading && displayed.length === 0 && (
          <div className="text-center py-12" style={{ color: c.txt3 }}>
            <ShoppingCart size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">{t('no_orders_found') || "Aucune commande dans cet onglet"}</p>
          </div>
        )}
        {displayed.map(o => {
          const st = STATUS_META[o.status];
          const isNew        = o.status === "new";
          const isProcessing = o.status === "processing";
          const isReady      = o.status === "ready";
          const isDelivered  = o.status === "delivered";

          return (
            <Card key={o.id} dk={dk} style={{
              padding: "16px 20px",
              borderColor: isNew ? c.blue + "44" : undefined,
              boxShadow:   isNew ? `0 0 0 1px ${c.blue}22, 0 2px 12px ${c.blue}12` : undefined,
            }}>
              <div className="flex items-start gap-4 flex-wrap">

                {/* Icône source */}
                <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 gap-1"
                  style={{ background: isNew ? c.blue + "15" : "#000", border: isNew ? `1.5px solid ${c.blue}44` : "none" }}>
                  {o.source === "click_collect"
                    ? <Send size={22} style={{ color: isNew ? c.blue : "#fff" }} />
                    : <QrCode size={28} className="text-white" />
                  }
                  {o.source === "click_collect" && (
                    <span className="text-[8px] font-bold" style={{ color: isNew ? c.blue : "#fff9" }}>C&amp;C</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-48">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold" style={{ color: c.txt }}>{o.id}</p>
                    <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                    {o.cnas && <Badge color={c.blue} bg={c.blueLight}>CNAS</Badge>}
                    {o.source === "click_collect" && (
                      <Badge color="#7B5EA7" bg="#7B5EA718">Click &amp; Collect</Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: c.txt }}>
                    👤 {o.patient}
                    <span className="font-normal ml-2" style={{ color: c.txt2 }}>— {t('doctor_role_prefix') || "Dr."} {o.doctor}</span>
                  </p>
                  <div className="space-y-0.5 mt-2">
                    {o.items.map(item => (
                      <p key={item} className="text-sm" style={{ color: c.txt2 }}>• {item}</p>
                    ))}
                  </div>
                </div>

                {/* Right — total + actions */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold mb-0.5" style={{ color: c.blue }}>
                    {o.total.toLocaleString()} DZD
                  </p>
                  <p className="text-xs mb-3" style={{ color: c.txt3 }}>{o.date}</p>

                  <div className="flex flex-col gap-2">
                    {/* Nouvelle → Accepter & Préparer (Bleu) */}
                    {isNew && (
                      <button onClick={() => acceptOrder(o)} disabled={updatingId === o.id}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}>
                        {updatingId === o.id
                          ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><Check size={13} strokeWidth={3} /> {t('accept_prepare_btn') || "Accepter & Préparer"}</>}
                      </button>
                    )}

                    {/* En préparation → Marquer Prêt (Vert) */}
                    {isProcessing && (
                      <button onClick={() => markReady(o)} disabled={updatingId === o.id}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                        style={{ background: c.green }}>
                        {updatingId === o.id
                          ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><CheckCircle size={13} /> {t('mark_ready_btn') || "Marquer Prêt"}</>}
                      </button>
                    )}

                    {/* Prêt → Livré / Récupéré (Gris neutre) */}
                    {isReady && (
                      <button onClick={() => markDelivered(o)} disabled={updatingId === o.id}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80 active:scale-95 disabled:opacity-60"
                        style={{ background: c.blueLight, color: c.txt2, border: `1px solid ${c.border}` }}>
                        {updatingId === o.id
                          ? <span className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: c.txt2, borderTopColor: "transparent" }} />
                          : <><Truck size={13} /> {t('delivered_btn') || "Récupéré"}</>}
                      </button>
                    )}

                    {/* Bouton Détails — toujours visible */}
                    <button onClick={() => setSelectedOrder(o)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80 flex items-center justify-center gap-1.5"
                      style={{ borderColor: c.border, color: c.txt2 }}>
                      <Eye size={13} /> {t('view_details_btn') || "Détails"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Barre de progression si "new" — attire l'attention */}
              {isNew && (
                <div className="mt-3 flex items-center gap-2 pt-3 border-t" style={{ borderColor: c.blue + "22" }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.blue }} />
                  <p className="text-xs font-semibold" style={{ color: c.blue }}>
                    Ordonnance reçue — en attente d'acceptation
                  </p>
                </div>
              )}
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
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await api.getPharmacyStats();
        if (!cancel) setStats(data || null);
      } catch (err) {
        if (!cancel) setLoadError(err?.message || "Erreur lors du chargement des statistiques.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  const fmtDzd = (n) => `${Number(n || 0).toLocaleString("fr-FR")} DZD`;

  const kpisFromBackend = stats?.kpis ? [
    { label: t('orders_today_label') || "Commandes aujourd'hui", value: String(stats.kpis.today_orders ?? 0),  icon: ShoppingCart, color: c.blue   },
    { label: t('daily_revenue_label') || "Revenu du jour",        value: fmtDzd(stats.kpis.today_revenue),       icon: DollarSign,   color: c.green  },
    { label: t('stock_meds_label') || "Articles en stock",     value: String(stats.kpis.stock_items ?? 0),    icon: Package,      color: "#7B5EA7" },
    { label: t('stock_alerts_count_label') || "Alertes stock",         value: String(stats.kpis.stock_alerts_count ?? 0), icon: AlertTriangle, color: c.amber },
  ] : null;

  // Données graphiques : non encore exposées par le backend → masquées en prod.
  const monthlyData = import.meta.env.DEV ? [
    { month: "Oct", ventes: 62, cnas: 38 }, { month: "Nov", ventes: 75, cnas: 44 },
    { month: "Déc", ventes: 88, cnas: 52 }, { month: "Jan", ventes: 71, cnas: 43 },
    { month: "Fév", ventes: 83, cnas: 50 }, { month: "Mar", ventes: 91, cnas: 57 },
  ] : [];
  const maxVal = 100;

  const topMeds = import.meta.env.DEV ? [
    { name: "Paracetamol 1g",   qty: 480, pct: 95, color: c.blue  },
    { name: "Aspirin 100mg",    qty: 330, pct: 68, color: c.green },
    { name: "Vitamin D3 2000IU",qty: 215, pct: 44, color: "#7B5EA7" },
    { name: "Lisinopril 10mg",  qty: 142, pct: 30, color: c.amber },
    { name: "Ibuprofen 400mg",  qty: 155, pct: 32, color: c.red   },
  ] : [];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>{t('stats_title') || "Statistiques"}</h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>{t('stats_desc_pharmacist') || "Analyse des ventes et remboursements CNAS"}</p>
      </div>

      {loadError && (
        <div className="mb-4 px-4 py-2.5 rounded-xl border text-sm font-semibold"
             style={{ background: c.red + "18", borderColor: c.red + "44", color: c.red }}>
          {loadError}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(kpisFromBackend || [
          { label: t('monthly_sales_label') || "Ventes ce mois",    value: loading ? "…" : "—", icon: DollarSign,    color: c.blue   },
          { label: t('reimbursed_cnas_label') || "Remboursé CNAS",  value: loading ? "…" : "—", icon: Shield,        color: c.green  },
          { label: t('prescriptions_processed_label') || "Ordonnances traitées", value: loading ? "…" : "—", icon: FileText, color: "#7B5EA7" },
          { label: t('unique_customers_label') || "Clients uniques",value: loading ? "…" : "—", icon: Users,         color: c.amber  },
        ]).map(s => <StatCard key={s.label} {...s} dk={dk} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Bar chart ventes vs CNAS */}
        <Card dk={dk}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ color: c.txt }}>{t('sales_vs_cnas_title') || "Ventes vs Remboursements CNAS"}</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1" style={{ color: c.blue }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.blue }}></span> {t('sales_label') || "Ventes"}
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
          <h3 className="font-bold mb-5" style={{ color: c.txt }}>{t('top_meds_sold_title') || "Top médicaments vendus"}</h3>
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
          <h3 className="font-bold mb-5" style={{ color: c.txt }}>{t('category_distribution_title') || "Répartition par catégorie"}</h3>
          <div className="space-y-3">
            {[
              { label: t('cardiology_label') || "Cardiologie",  pct: 32, color: c.blue   },
              { label: t('analgesics_label') || "Antalgiques",  pct: 28, color: c.green  },
              { label: t('diabetology_label') || "Diabétologie", pct: 18, color: c.amber  },
              { label: t('vitamins_label') || "Vitamines",    pct: 12, color: "#7B5EA7" },
              { label: t('others_label') || "Autres",       pct: 10, color: c.txt3   },
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
          <p className="text-xs font-bold uppercase tracking-wide mb-4 text-white opacity-70">{t('cnas_report_title') || "Bilan CNAS — Mars 2026"}</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: t('reimbursed_label') || "Remboursé",  value: "773 600 DZD" },
              { label: t('pending_label') || "En attente", value: "124 800 DZD"  },
              { label: t('rejected_label') || "Rejeté",     value: "18 200 DZD"   },
              { label: t('rate_label') || "Taux",       value: "62%"          },
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
  const { lang, setLang, t } = useLanguage();

  const [locForm, setLocForm] = useState({
    address: "12 Rue Didouche Mourad",
    commune: "Alger-Centre",
    wilaya:  "Alger",
    mapsUrl: "",
  });
  const [locSaved, setLocSaved] = useState(false);

  const inputCls   = "w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all focus:ring-2";
  const inputStyle = { background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt };
  const labelCls   = "block text-xs font-bold uppercase tracking-wide mb-1.5";

  const handleSaveLocation = () => {
    setLocSaved(true);
    setTimeout(() => setLocSaved(false), 3000);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>{t('pharmacist_settings_title')}</h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>{t('pharmacist_settings_desc')}</p>
      </div>

      {/* ── Language & Theme ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card dk={dk}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.blue + "18" }}>
              <Languages size={18} style={{ color: c.blue }} />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: c.txt }}>{t('language')}</p>
              <p className="text-xs" style={{ color: c.txt3 }}>{t('choose_pref_lang') || "Choisissez votre langue de préférence"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {[
              { id: 'fr', label: 'Français' },
              { id: 'en', label: 'English' }
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className="flex-1 py-3 rounded-xl border font-semibold text-sm transition-all"
                style={{
                  background: lang === l.id ? c.blue : 'transparent',
                  color: lang === l.id ? '#fff' : c.txt,
                  borderColor: lang === l.id ? c.blue : c.border
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Card>

        <Card dk={dk}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.amber + "18" }}>
              {dk ? <Moon size={18} style={{ color: c.amber }} /> : <Sun size={18} style={{ color: c.amber }} />}
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: c.txt }}>{t('dark_mode')}</p>
              <p className="text-xs" style={{ color: c.txt3 }}>{t('dark_mode_desc') || "Basculer entre le thème clair et sombre"}</p>
            </div>
          </div>
          <button
            onClick={onToggleDark}
            className="w-full py-3 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background: dk ? c.blue : 'transparent',
              color: dk ? '#fff' : c.txt,
              borderColor: dk ? c.blue : c.border
            }}
          >
            {dk ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border border-current" />}
            {dk ? (t('deactivate_dark_mode') || "Désactiver le mode sombre") : (t('activate_dark_mode') || "Activer le mode sombre")}
          </button>
        </Card>
      </div>

      {/* ── Clinic Location & Maps ── */}
      <Card dk={dk} className="mb-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.blue + "18" }}>
            <MapPin size={18} style={{ color: c.blue }} />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: c.txt }}>{t('clinic_location_title')}</p>
            <p className="text-xs" style={{ color: c.txt3 }}>{t('clinic_location_desc')}</p>
          </div>
        </div>

        {locSaved && (
          <div className="mb-5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2"
            style={{ background: "#2D8C6F12", color: "#2D8C6F", border: "1px solid #2D8C6F44" }}>
            <Check size={14} /> {t('location_updated_success') || "Localisation mise à jour avec succès"}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left : formulaire */}
          <div className="space-y-5">
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>{t('address_label')}</label>
              <input type="text" placeholder="Ex: 12 Rue Didouche Mourad"
                value={locForm.address}
                onChange={e => setLocForm(f => ({ ...f, address: e.target.value }))}
                className={inputCls} style={inputStyle} />
            </div>

            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>{t('commune_label')}</label>
              <input type="text" placeholder="Ex: Alger-Centre"
                value={locForm.commune}
                onChange={e => setLocForm(f => ({ ...f, commune: e.target.value }))}
                className={inputCls} style={inputStyle} />
            </div>

            {/* Wilaya — DashSelect */}
            <DashSelect
              label={t('wilaya_label')} value={locForm.wilaya} options={WILAYAS_LIST}
              onSelect={v => setLocForm(f => ({ ...f, wilaya: v }))}
              dk={dk} c={c} />

            {/* Lien Google Maps */}
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>{t('maps_link_label')}</label>
              <div className="relative">
                <input type="text" placeholder={t('maps_link_placeholder')}
                  value={locForm.mapsUrl}
                  onChange={e => setLocForm(f => ({ ...f, mapsUrl: e.target.value }))}
                  className={`${inputCls} pl-10`} style={inputStyle} />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.txt3 }}>
                  <Link2 size={15} />
                </div>
              </div>
            </div>

            <button onClick={handleSaveLocation}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, #304B71, ${c.blue})` }}>
              <MapPin size={15} /> {t('update_map_btn')}
            </button>
          </div>

          {/* Right : Map Preview avec Smart Parser */}
          <div className="flex flex-col gap-3">
            <label className={labelCls} style={{ color: c.txt2 }}>{t('map_preview_label') || "Map Preview"}</label>
            {(() => {
              const addressQuery = [locForm.address, locForm.commune, locForm.wilaya]
                .filter(Boolean).join(", ");
              let embedSrc = null;
              let openUrl  = locForm.mapsUrl || null;

              if (locForm.mapsUrl) {
                if (locForm.mapsUrl.includes("output=embed") || locForm.mapsUrl.includes("/embed")) {
                  embedSrc = locForm.mapsUrl;
                } else {
                  const rawCoord  = locForm.mapsUrl.match(/^(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)$/);
                  const coordMatch = locForm.mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                  const placeMatch = locForm.mapsUrl.match(/\/place\/([^\/]+)/);
                  if (rawCoord)
                    embedSrc = `https://maps.google.com/maps?q=${rawCoord[1]},${rawCoord[2]}&hl=fr&z=15&output=embed`;
                  else if (coordMatch)
                    embedSrc = `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=fr&z=15&output=embed`;
                  else if (placeMatch)
                    embedSrc = `https://maps.google.com/maps?q=${placeMatch[1]}&hl=fr&z=15&output=embed`;
                  else
                    embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locForm.mapsUrl)}&hl=fr&z=15&output=embed`;
                }
              } else if (addressQuery) {
                embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&hl=fr&z=15&output=embed`;
                openUrl  = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}`;
              }

              return embedSrc ? (
                <div className="relative flex-1 min-h-[280px] rounded-2xl overflow-hidden border-2 transition-all"
                  style={{ borderColor: c.blue + "55", background: c.card }}>
                  <iframe
                    key={embedSrc} title="Map Preview" src={embedSrc}
                    width="100%" height="100%"
                    style={{ border: 0, minHeight: 280, display: "block" }}
                    allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" />
                  {openUrl && (
                    <a href={openUrl} target="_blank" rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:opacity-90"
                      style={{ background: c.blue }}>
                      <MapPin size={12} /> {t('open_in_maps_btn') || "Ouvrir dans Maps"}
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex-1 min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3"
                  style={{ background: dk ? "#0D1117" : "#F4F8FB", borderColor: c.border }}>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: c.blue + "18" }}>
                      <MapPin size={28} style={{ color: c.blue }} />
                    </div>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ background: c.blue }} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-bold" style={{ color: c.txt }}>{t('map_preview_label') || "Map Preview"}</p>
                    <p className="text-xs mt-1" style={{ color: c.txt3 }}>
                      {t('map_preview_desc') || "Collez une URL Maps ou entrez votre adresse"}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </Card>

      {/* ── Préférences + CNAS + À propos ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card dk={dk}>
          <p className="font-semibold mb-5" style={{ color: c.txt }}>{t('preferences_label') || "Préférences"}</p>
          <div className="space-y-4">
            {[
              { label: t('stock_alerts_label') || "Alertes stock critique", on: true  },
              { label: t('cnas_notif_label') || "Notifications CNAS",      on: true  },
              { label: t('expiry_reminders_label') || "Rappels expiration",       on: true  },
              { label: t('dark_mode') || "Mode sombre",              on: dk, toggle: true },
            ].map(item => (
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
          <p className="font-semibold mb-3" style={{ color: c.txt }}>{t('cnas_conn_label') || "Connexion CNAS"}</p>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-3"
            style={{ background: "#2D8C6F12", border: "1px solid #2D8C6F30" }}>
            <CheckCircle size={18} style={{ color: c.green }} />
            <p className="text-sm font-semibold" style={{ color: c.green }}>{t('connected_status') || "Connecté"} — {t('cnas_connected_desc') || "Conventionné"}</p>
          </div>
          <p className="text-xs" style={{ color: c.txt3 }}>{t('last_sync_prefix') || "Dernière sync :"} Aujourd'hui 08:32</p>
        </Card>

        <Card dk={dk}>
          <p className="font-semibold mb-2" style={{ color: c.txt }}>{t('about_label') || "À propos"}</p>
          <p className="text-sm" style={{ color: c.txt2 }}>MedSmart {t('pharmacy_view_label', {context: 'dash'}) || "Pharmacie"} v2.1.0</p>
          <p className="text-xs mt-1" style={{ color: c.txt3 }}>{t('hosted_in_algeria') || "CNAS Certifié · Hébergé en Algérie"}</p>
        </Card>
      </div>
    </>
  );
}

// ─── MESSAGES PAGE (layout 30/70) ────────────────────────────────────────────
function MessagesPage({ dk, c, chatConvOpen, setChatConvOpen, activeChatConv, setActiveChatConv, setUnreadChatCount }) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-5 h-[calc(100vh-120px)] min-h-[500px]">
      {/* ConversationList — 30% */}
      <div
        className="rounded-2xl border overflow-hidden shrink-0 flex flex-col"
        style={{ width: "30%", minWidth: 260, background: c.card, borderColor: c.border }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0" style={{ borderColor: c.border }}>
          <MessageSquare size={15} style={{ color: c.blue }} />
          <h2 className="font-bold text-sm" style={{ color: c.txt }}>{t('nav_messages') || "Messages"}</h2>
        </div>
        {/* Liste inline (toujours visible, pas de toggle) */}
        <div className="flex-1 overflow-hidden">
          <ConversationList
            open={true}
            onClose={() => {}}
            onSelectConv={(conv) => setActiveChatConv(conv)}
            isPatient={false}
            onUnreadChange={(n) => setUnreadChatCount(n)}
            c={c}
            dk={dk}
            inline={true}
          />
        </div>
      </div>

      {/* ChatWindow — 70% */}
      <div className="flex-1 min-w-0">
        {activeChatConv ? (
          <ChatWindow
            conv={activeChatConv}
            onClose={() => setActiveChatConv(null)}
            onBack={null}
            c={c}
            dk={dk}
            embedded={true}
          />
        ) : (
          <div
            className="h-full rounded-2xl border flex flex-col items-center justify-center gap-4"
            style={{ background: c.card, borderColor: c.border }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: c.blueLight }}>
              <MessageSquare size={28} style={{ color: c.blue }} />
            </div>
            <p className="text-sm font-medium" style={{ color: c.txt3 }}>
              {t('select_conversation_desc') || "Sélectionnez une conversation"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN SHELL ───────────────────────────────────────────────────────────────
export default function PharmacistDashboard({ onLogout }) {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { userData } = useAuth();
  const dk = theme === "dark";
  const [page, setPage] = useState("accueil");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { globalNotifications, markAllNotificationsRead } = useData();
  const notifCount = globalNotifications.filter(n => !n.read).length;
  const c = dk ? T.dark : T.light;

  const pharmacyName =
    userData?.pharmacy_name ||
    userData?.pharmacy?.name ||
    (userData?.first_name || userData?.last_name
      ? `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim()
      : "El Shifa Pharmacy");
  const pharmacyCity = userData?.wilaya || userData?.city || "Alger";
  const pharmacyInitials =
    (pharmacyName.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "ES").slice(0, 2);

  // ── Chat state ──
  const [chatConvOpen, setChatConvOpen] = useState(false);
  const [activeChatConv, setActiveChatConv] = useState(null);
  const { unreadChatCount, setUnreadChatCount } = useData();

  const NAV = [
    { id: "accueil",     label: t('nav_home') || "Accueil"       },
    { id: "commandes",   label: t('nav_orders') || "Commandes",  badge: 2 },
    { id: "stock",       label: t('nav_stock') || "Stock"         },
    { id: "statistiques",label: t('nav_stats') || "Statistiques"  },
  ];

  const renderPage = () => {
    switch (page) {
      case "accueil":      return <HomePage dk={dk} onNav={setPage} />;
      case "commandes":    return <CommandesPage dk={dk} />;
      case "stock":        return <StockPage dk={dk} />;
      case "statistiques": return <StatistiquesPage dk={dk} />;
      case "parametres":   return <ParametresPage dk={dk} onToggleDark={toggleTheme} />;
      case "messages":     return <MessagesPage dk={dk} c={c}
                                    chatConvOpen={chatConvOpen}
                                    setChatConvOpen={setChatConvOpen}
                                    activeChatConv={activeChatConv}
                                    setActiveChatConv={setActiveChatConv}
                                    setUnreadChatCount={setUnreadChatCount} />;
      default:             return <HomePage dk={dk} onNav={setPage} />;
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: c.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: c.txt, transition: "background 0.3s, color 0.2s" }}>
      <ParticlesHero darkMode={dk} />
      <div className="relative z-10">

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
            {/* Messages Icon Button */}
            <button
              onClick={() => setPage("messages")}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-blue-50 dark:hover:bg-white/5 border"
              style={{ 
                borderColor: page === "messages" ? c.blue + "44" : c.border, 
                background: page === "messages" ? c.blue + "11" : "transparent" 
              }}
              title={t('nav_messages') || "Messages"}
            >
              <MessageSquare size={18} style={{ color: page === "messages" ? c.blue : c.txt2 }} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: c.red, fontSize: 9 }}>
                  {unreadChatCount > 9 ? "9+" : unreadChatCount}
                </span>
              )}
            </button>
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
                  {pharmacyInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight" style={{ color: c.txt }}>{pharmacyName}</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>{t('pharmacist_role_label') || "Pharmacien"} · {pharmacyCity}</p>
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
                        style={{ background: "linear-gradient(135deg, #2D8C6F, #3aaa88)" }}>{pharmacyInitials}</div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: c.txt }}>{pharmacyName}</p>
                        <p className="text-xs" style={{ color: c.txt3 }}>{t('pharmacist_role_label') || "Pharmacien"} · {t('cnas_connected_desc') || "CNAS Conventionné"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <button onClick={() => { markAllNotificationsRead(); setPage("parametres"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Bell size={16} />
                      Notifications
                      {notifCount > 0 && (
                        <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: "#E05555", color: "#fff" }}>{notifCount}</span>
                      )}
                    </button>
                    <button onClick={() => { setPage("parametres"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Settings size={16} /> {t('nav_settings') || "Paramètres"}
                    </button>

                    {/* Dark mode */}
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Sun size={14} style={{ color: dk ? c.txt3 : "#E8A838" }} />
                      <button
                        onClick={toggleTheme}
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
                      <LogOut size={16} /> {t('logout_btn')}
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
      <main className="w-full px-6 py-6"><ErrorBoundary>{renderPage()}</ErrorBoundary></main>

      {profileOpen && <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />}
    </div>
    </div>
  );
}