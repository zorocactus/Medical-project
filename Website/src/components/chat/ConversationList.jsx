import { useState, useEffect, useRef } from "react";
import { X, Plus, Search, MessageSquare } from "lucide-react";
import * as api from "../../services/api";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const MOCK_CONVERSATIONS = [
  { id: 1, name: "Pharmacie Centrale",  role: "pharmacist",
    lastMessage: "Votre ordonnance est prête", unread: 2,
    timestamp: "10:30", isNew: true },
  { id: 2, name: "Karim Benali",        role: "caretaker",
    lastMessage: "Je serai là à 14h",   unread: 0,
    timestamp: "Hier", isNew: false },
];

const MOCK_INTERLOCUTORS = [
  { id: 10, name: "Pharmacie El Shifa",  role: "pharmacist" },
  { id: 11, name: "Pharmacie Centrale",  role: "pharmacist" },
  { id: 20, name: "Karim Benali",        role: "caretaker"  },
  { id: 21, name: "Nadia Messaoud",      role: "caretaker"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function avatarColor(role) {
  return role === "pharmacist" ? "#2D8C6F" : "#7B5EA7";
}
function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
function roleLabel(role) {
  return role === "pharmacist" ? "Pharmacien" : "Garde-malade";
}

// ─── Modal "Nouvelle conversation" ────────────────────────────────────────────
function NewConvModal({ onClose, onSelect, c }) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_INTERLOCUTORS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl border overflow-hidden"
        style={{ background: c.card, borderColor: c.border,
          animation: "modalIn 0.2s ease forwards" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: c.border }}>
          <h3 className="font-bold text-sm" style={{ color: c.txt }}>
            Nouvelle conversation
          </h3>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center border hover:opacity-70 transition-opacity"
            style={{ borderColor: c.border, color: c.txt3 }}>
            <X size={13} />
          </button>
        </div>

        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ borderColor: c.border, background: c.blueLight }}>
            <Search size={13} style={{ color: c.txt3 }} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un pharmacien ou garde-malade..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: c.txt }}
            />
          </div>
        </div>

        <div className="px-2 pb-3 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-xs py-4" style={{ color: c.txt3 }}>
              Aucun résultat
            </p>
          ) : (
            filtered.map((p) => (
              <button key={p.id} onClick={() => onSelect(p)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:opacity-80 text-left"
                onMouseEnter={(e) => (e.currentTarget.style.background = c.blueLight)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: avatarColor(p.role) }}>
                  {initials(p.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: c.txt }}>
                    {p.name}
                  </p>
                  <p className="text-xs" style={{ color: c.txt3 }}>
                    {roleLabel(p.role)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ContextMenu (clic droit) ─────────────────────────────────────────────────
function ContextMenu({ x, y, conv, onMarkUnread, onDelete, onClose, c }) {
  const ref = useRef(null);
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-[80] rounded-xl border shadow-xl overflow-hidden"
      style={{
        top: y, left: x, minWidth: 180,
        background: c.card, borderColor: c.border,
        animation: "dropdownIn 0.15s ease forwards",
      }}
    >
      {[
        { label: "Marquer comme non-lu", action: onMarkUnread },
        { label: "Supprimer",            action: onDelete,    danger: true },
      ].map(({ label, action, danger }) => (
        <button
          key={label}
          onClick={() => { action(); onClose(); }}
          className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-left transition-all"
          style={{ color: danger ? "#E05555" : c.txt2 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.blueLight)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── ConvItem ─────────────────────────────────────────────────────────────────
function ConvItem({ conv, onSelect, onMarkUnread, onDelete, c }) {
  const [ctx, setCtx] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <button
        onClick={() => onSelect(conv)}
        onContextMenu={handleContextMenu}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all mb-0.5 relative group"
        style={{ background: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = c.blueLight)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Avatar + indicateur isNew */}
        <div className="relative shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: avatarColor(conv.role),
              animation: conv.isNew ? "pulseRing 2s ease-in-out 3" : "none",
            }}>
            {initials(conv.name)}
          </div>
          {conv.isNew && (
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
              style={{ background: c.green, borderColor: c.card }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <p className="text-sm truncate"
              style={{ color: c.txt, fontWeight: conv.unread ? 700 : 500 }}>
              {conv.name}
            </p>
            <span className="text-[10px] shrink-0" style={{ color: c.txt3 }}>
              {conv.timestamp}
            </span>
          </div>
          <p className="text-xs truncate"
            style={{ color: conv.unread ? c.txt2 : c.txt3, fontWeight: conv.unread ? 600 : 400 }}>
            {conv.lastMessage || "Démarrez la conversation…"}
          </p>
        </div>

        {conv.unread > 0 && (
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shrink-0"
            style={{ background: c.blue, fontSize: 9 }}>
            {conv.unread}
          </span>
        )}
      </button>

      {ctx && (
        <ContextMenu
          x={ctx.x} y={ctx.y} conv={conv}
          onMarkUnread={() => onMarkUnread(conv.id)}
          onDelete={() => onDelete(conv.id)}
          onClose={() => setCtx(null)}
          c={c}
        />
      )}
    </>
  );
}

// ─── ConversationList ─────────────────────────────────────────────────────────
export default function ConversationList({
  open,
  onClose,
  onSelectConv,
  isPatient = false,
  onUnreadChange,
  c,
  dk,
  inline = false,
}) {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [showNewModal, setShowNewModal]   = useState(false);
  const [search, setSearch]               = useState("");
  const intervalRef = useRef(null);

  // ── Polling 10s ──
  const fetchConversations = async () => {
    try {
      const data = await api.getConversations();
      if (Array.isArray(data) && data.length > 0) setConversations(data);
    } catch { /* silencieux */ }
  };

  useEffect(() => {
    if (!inline && !open) return;
    fetchConversations();
    intervalRef.current = setInterval(fetchConversations, 10_000);
    return () => clearInterval(intervalRef.current);
  }, [open, inline]);

  // Remonte le total non-lus
  useEffect(() => {
    const total = conversations.reduce((acc, cv) => acc + (cv.unread || 0), 0);
    onUnreadChange?.(total);
  }, [conversations]);

  const filtered = conversations.filter((cv) =>
    cv.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Actions ──
  const handleSelect = async (conv) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0, isNew: false } : c))
    );
    onSelectConv(conv);
    try { await api.markConversationRead(conv.id); } catch { /* silencieux */ }
  };

  const handleMarkUnread = (id) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: (c.unread || 0) + 1 } : c))
    );
  };

  const handleDelete = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNewConv = async (interlocutor) => {
    setShowNewModal(false);
    const fallback = {
      id: Date.now(),
      name: interlocutor.name,
      role: interlocutor.role,
      lastMessage: "",
      unread: 0,
      timestamp: "maintenant",
      isNew: true,
    };
    try {
      const conv = await api.createConversation(interlocutor.id);
      const newConv = conv ?? fallback;
      setConversations((prev) => {
        if (prev.find((c) => c.id === newConv.id)) return prev;
        return [newConv, ...prev];
      });
      onSelectConv(newConv);
    } catch {
      setConversations((prev) => [fallback, ...prev]);
      onSelectConv(fallback);
    }
  };

  // ── Empty state ──
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 py-8 px-4">
      {/* Illustration simple */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: c.blueLight }}>
          <MessageSquare size={28} style={{ color: c.blue }} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: c.card, border: `2px solid ${c.border}` }}>
          <span style={{ fontSize: 12 }}>💬</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold mb-1" style={{ color: c.txt }}>
          Aucune conversation
        </p>
        <p className="text-xs" style={{ color: c.txt3 }}>
          {isPatient
            ? "Contactez votre pharmacien ou garde-malade"
            : "Vos patients vous contacteront ici"}
        </p>
      </div>
      {isPatient && (
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: c.blue }}>
          <Plus size={14} />
          Démarrer une conversation
        </button>
      )}
    </div>
  );

  // ── Corps partagé (search + liste) ──
  const Body = () => (
    <>
      <style>{`
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(74,111,165,0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(74,111,165,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,111,165,0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Search + Nouvelle conv */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border mb-2"
          style={{ borderColor: c.border, background: c.blueLight }}>
          <Search size={13} style={{ color: c.txt3 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: c.txt }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="hover:opacity-70 transition-opacity"
              style={{ color: c.txt3 }}>
              <X size={12} />
            </button>
          )}
        </div>
        {isPatient && (
          <button
            onClick={() => setShowNewModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: c.blue }}>
            <Plus size={14} />
            Nouvelle conversation
          </button>
        )}
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 flex flex-col"
        style={{ scrollbarWidth: "thin" }}>
        {filtered.length === 0 && !search
          ? <EmptyState />
          : filtered.length === 0 && search
          ? (
            <div className="flex flex-col items-center justify-center h-24 gap-1">
              <p className="text-sm" style={{ color: c.txt3 }}>Aucun résultat</p>
            </div>
          )
          : filtered.map((conv) => (
            <ConvItem
              key={conv.id}
              conv={conv}
              onSelect={handleSelect}
              onMarkUnread={handleMarkUnread}
              onDelete={handleDelete}
              c={c}
            />
          ))
        }
      </div>

      {showNewModal && (
        <NewConvModal
          onClose={() => setShowNewModal(false)}
          onSelect={handleNewConv}
          c={c}
        />
      )}
    </>
  );

  // ── Mode inline (pharmacien / GM / patient en page dédiée) ──
  if (inline) {
    return (
      <div className="flex flex-col h-full">
        <Body />
      </div>
    );
  }

  // ── Mode overlay (panel latéral) ──
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}
        style={{ background: "rgba(0,0,0,0.3)" }} />

      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl border-l"
        style={{
          width: "min(360px, 92vw)",
          background: c.card, borderColor: c.border,
          animation: "slideInFromRight 0.25s ease forwards",
        }}
      >
        <style>{`
          @keyframes slideInFromRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Header panel */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: c.border }}>
          <div className="flex items-center gap-2">
            <MessageSquare size={16} style={{ color: c.blue }} />
            <h2 className="font-bold text-sm" style={{ color: c.txt }}>Messages</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center border hover:opacity-70 transition-opacity"
            style={{ borderColor: c.border, color: c.txt3 }}>
            <X size={15} />
          </button>
        </div>

        <Body />
      </div>
    </>
  );
}
