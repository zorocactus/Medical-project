import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, Send, ChevronLeft, Paperclip, Smile, MoreVertical,
  Trash2, BellOff, Check, CheckCheck, ChevronDown,
  Pencil, FileText, Ban, ShieldAlert, Flag,
} from "lucide-react";
import * as api from "../../services/api";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const MOCK_MESSAGES = [
  { id: 1, sender: "other", content: "Bonjour, comment puis-je vous aider ?",
    time: new Date(Date.now() - 7 * 60000).toISOString(), read: true },
  { id: 2, sender: "me",    content: "Mon ordonnance est-elle prête ?",
    time: new Date(Date.now() - 6 * 60000).toISOString(), read: true },
  { id: 3, sender: "other", content: "Votre ordonnance est prête, vous pouvez passer la récupérer.",
    time: new Date(Date.now() - 5 * 60000).toISOString(), read: true },
  { id: 4, sender: "me",    content: "Merci beaucoup ! Je serai là dans 30 minutes.",
    time: new Date(Date.now() - 2 * 60000).toISOString(), read: true },
  { id: 5, sender: "other", content: "Parfait, nous vous attendons. Bonne journée 🙏",
    time: new Date(Date.now() - 1 * 60000).toISOString(), read: false },
];

const EMOJIS = [
  // Populaire / Faces
  "😊", "😂", "🤣", "❤️", "😍", "🥰", "😎", "🤔", "🧐", "🤨", "🙄", "😅", "😭", "😤", "😡", "😴", "🥳", "😱", "🤯", "🤢", "🤮", "🤧", "😇", "🤡", "💀",
  // Gestes
  "👍", "👎", "👌", "✌️", "🤞", "🤙", "🤝", "🙏", "🙌", "👏", "👋", "💪", "✊", "👊", "👉", "👈", "👆", "👇",
  // Coeurs
  "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "✨", "🔥", "⭐", "🌟",
  // Médical / Santé
  "✅", "⚠️", "📋", "🏥", "🩺", "💊", "💉", "🩹", "🚑", "🧪", "🧤", "🌡️", "🧬", "🦷", "👁️", "🦴", "♿",
  // Divers
  "☀️", "🌙", "☁️", "🌈", "🍎", "☕", "🍕", "🎈", "🎁", "📱", "💻", "📅", "📍", "🔒"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Helpers ──────────────────────────────────────────────────────────────────
function avatarColor(role) { return role === "pharmacist" ? "#2D8C6F" : "#7B5EA7"; }
function initials(name = "") { return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }
function fmtTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function nowISO() { return new Date().toISOString(); }
function groupByDate(messages) {
  const groups = []; let lastLabel = null;
  for (const msg of messages) {
    const label = dateLabel(msg.time);
    if (label !== lastLabel) { groups.push({ type: "separator", label }); lastLabel = label; }
    groups.push({ type: "message", ...msg });
  }
  return groups;
}
function dateLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso); const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
function normalizeMsg(m) {
  return { id: m.id, sender: m.is_mine ? "me" : "other",
    content: m.content, time: m.timestamp ?? m.time ?? nowISO(), read: !!m.is_read };
}

// ─── TypingDots ───────────────────────────────────────────────────────────────
function TypingDots({ c }) {
  return (
    <div className="flex items-end gap-2 px-3">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
        style={{ background: "#9AACBE", fontSize: 9, fontWeight: 700 }}>···</div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1"
        style={{ background: c.card }}>
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full"
            style={{ background: c.txt3,
              animation: `typingBounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ─── BubbleMenu (dropdown trois points style Instagram) ──────────────────────
function BubbleMenu({ onEdit, onDelete, onClose, c, isMe }) {
  const ref = useRef(null);
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    // léger délai pour ne pas fermer immédiatement au clic d'ouverture
    const t = setTimeout(() => document.addEventListener("mousedown", h), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-1 rounded-2xl border shadow-lg overflow-hidden z-50"
      style={{
        [isMe ? "right" : "left"]: 0,
        minWidth: 148,
        background: c.card,
        borderColor: c.border,
        animation: "dropdownIn 0.15s ease forwards",
      }}
    >
      <button
        onClick={() => { onEdit(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left"
        style={{ color: c.txt2 }}
        onMouseEnter={e => (e.currentTarget.style.background = c.blueLight)}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <Pencil size={13} />
        Modifier
      </button>
      <button
        onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left"
        style={{ color: "#E05555" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#E0555510")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <Trash2 size={13} />
        Supprimer
      </button>
    </div>
  );
}

// ─── MessageBubble ─────────────────────────────────────────────────────────────
function MessageBubble({ msg, conv, c, showAvatar, onEdit, onDelete }) {
  const [hovered, setHovered]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMe = msg.sender === "me";
  const isDeleted = msg.deleted;
  const color = avatarColor(conv.role);

  return (
    <div
      className={`flex items-end gap-2 px-3 ${isMe ? "flex-row-reverse" : "flex-row"} group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!menuOpen) setHovered(false); }}
      style={{ marginBottom: 2 }}
    >
      {/* Avatar interlocuteur */}
      {!isMe && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 mb-0.5"
          style={{ background: showAvatar ? color : "transparent", fontSize: 10, fontWeight: 700 }}>
          {showAvatar ? initials(conv.name) : ""}
        </div>
      )}
      {isMe && <div className="w-7 shrink-0" />}

      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%]`}>
        {/* Badge "modifié" au-dessus à droite - Équilibré */}
        {msg.edited && !isDeleted && (
          <span className="text-[10px] mb-0.5 font-semibold self-end flex items-center gap-1 opacity-80" 
            style={{ color: c.txt3 }}>
            <Pencil size={9} />
            <span>modifié</span>
          </span>
        )}

        {/* Bulle */}
        <div
          className="px-3.5 py-2.5 text-sm leading-relaxed relative group"
          style={{
            background: isDeleted ? "transparent" : (isMe ? c.blue : c.card),
            color: isDeleted ? c.txt3 : (isMe ? "#fff" : c.txt),
            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            boxShadow: isDeleted ? "none" : "0 2px 5px rgba(0,0,0,0.06)",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            border: isDeleted ? `1px dashed ${c.border}` : "none",
            fontStyle: isDeleted ? "italic" : "normal",
            transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}>
          {isDeleted ? "Message supprimé" : msg.content}
        </div>

        {/* Timestamp + coches (hover) */}
        <div className="flex items-center gap-1 mt-0.5 px-1 transition-opacity duration-150"
          style={{ opacity: (hovered || menuOpen) ? 1 : 0 }}>
          <span className="text-[10px]" style={{ color: c.txt3 }}>{fmtTime(msg.time)}</span>
          {isMe && !isDeleted && (
            msg.read
              ? <CheckCheck size={12} style={{ color: c.blue }} />
              : <Check size={12} style={{ color: c.txt3 }} />
          )}
        </div>
      </div>

      {/* ⋮ Three-dot — côté gauche de la bulle (côté centre du chat) */}
      {isMe && !isDeleted && (
        <div className="relative self-center shrink-0"
          style={{ opacity: hovered || menuOpen ? 1 : 0, transition: "opacity 0.15s" }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-gray-100 active:scale-90"
            style={{ color: c.txt3 }}
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <BubbleMenu
              isMe={isMe}
              c={c}
              onEdit={() => { onEdit(msg); setMenuOpen(false); }}
              onDelete={() => { onDelete(msg.id); setMenuOpen(false); setHovered(false); }}
              onClose={() => { setMenuOpen(false); setHovered(false); }}
            />
          )}
        </div>
      )}
    </div>
  );
}


// ─── DropdownMenu ─────────────────────────────────────────────────────────────
function DropdownMenu({ onClose, onBlock, onReport, isBlocked, c }) {
  const ref = useRef(null);
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const sections = [
    {
      items: [
        { icon: BellOff, label: "Mettre en sourdine", color: c.txt2, onClick: onClose },
        { icon: Ban, label: isBlocked ? "Débloquer" : "Bloquer", color: isBlocked ? c.blue : c.txt, onClick: onBlock },
      ]
    },
    {
      items: [
        { icon: ShieldAlert, label: "Signaler", color: "#E05555", onClick: onReport },
        { icon: Trash2, label: "Supprimer", color: "#E05555", onClick: onClose },
      ]
    }
  ];

  return (
    <div ref={ref}
      className="absolute right-0 top-12 w-56 rounded-[24px] border border-white/20 shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
      style={{ 
        background: c.dk ? "rgba(23, 23, 23, 0.85)" : "rgba(255, 255, 255, 0.85)", 
        borderColor: c.border,
        animation: "dropdownIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards" 
      }}>
      {sections.map((section, idx) => (
        <div key={idx} className={idx > 0 ? "border-t" : ""} style={{ borderColor: c.border }}>
          {section.items.map(({ icon: Icon, label, color, onClick }) => (
            <button key={label} 
              onClick={() => { onClick(); onClose(); }}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-[13px] font-semibold transition-all hover:pl-6"
              style={{ color }}
              onMouseEnter={e => (e.currentTarget.style.background = c.blueLight)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Icon size={16} strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── EmojiPicker ──────────────────────────────────────────────────────────────
// Rendu en dehors du footer pour éviter le clipping overflow
function EmojiPicker({ onSelect, onClose, c, anchorRef }) {
  const ref = useRef(null);

  // Positionnement : juste au-dessus du bouton emoji
  const [pos, setPos] = useState({ bottom: 0, left: 0 });
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      // bottom = distance depuis le bas de la fenêtre au-dessus du bouton + marge
      setPos({
        bottom: window.innerHeight - rect.top + 6,
        left: rect.left,
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref}
      className="fixed rounded-2xl border shadow-2xl p-3 z-[100]"
      style={{ 
        bottom: pos.bottom, 
        left: pos.left,
        width: 320,
        background: c.card, 
        borderColor: c.border,
        animation: "dropdownIn 0.15s ease forwards" 
      }}>
      <div className="text-[10px] font-bold uppercase mb-2 ml-1 tracking-wider opacity-40" style={{ color: c.txt }}>
        Emojis
      </div>
      <div className="grid grid-cols-7 gap-2 overflow-y-auto pr-1" style={{ maxHeight: 240, scrollbarWidth: "thin" }}>
        {EMOJIS.map(e => (
          <button key={e} onClick={() => { onSelect(e); onClose(); }}
            className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all hover:bg-gray-100 active:scale-90"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── AttachmentPreview ────────────────────────────────────────────────────────
function AttachmentPreview({ file, previewUrl, onRemove, c }) {
  const isImage = file.type.startsWith("image/");
  return (
    <div className="flex items-center gap-2 px-1 pb-2">
      <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl border"
        style={{ background: c.blueLight, borderColor: c.border, maxWidth: 220 }}>
        {isImage ? (
          <img src={previewUrl} alt="preview"
            className="w-10 h-10 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: c.card }}>
            <FileText size={20} style={{ color: c.blue }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: c.txt }}>{file.name}</p>
          <p className="text-[10px]" style={{ color: c.txt3 }}>
            {(file.size / 1024).toFixed(0)} KB
          </p>
        </div>
        <button onClick={onRemove}
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 hover:opacity-70"
          style={{ background: c.border, color: c.txt3 }}>
          <X size={10} />
        </button>
      </div>
    </div>
  );
}

// ─── ChatWindow ───────────────────────────────────────────────────────────────
export default function ChatWindow({ conv, onClose, onBack, c, dk, embedded = false }) {
  const [messages, setMessages]       = useState(MOCK_MESSAGES);
  const [input, setInput]             = useState("");
  const [sending, setSending]         = useState(false);
  const [showEmoji, setShowEmoji]     = useState(false);
  const [showMenu, setShowMenu]       = useState(false);
  const [isTyping, setIsTyping]       = useState(false);
  const [newMsgCount, setNewMsgCount] = useState(0);
  const [isAtBottom, setIsAtBottom]   = useState(true);
  const [allRead, setAllRead]         = useState(false);
  const [attachment, setAttachment]   = useState(null);   // { file, previewUrl }
  const [editingMsg, setEditingMsg]   = useState(null);   // message object
  const [isBlocked, setIsBlocked]     = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting]     = useState(false);

  const bottomRef   = useRef(null);
  const bodyRef     = useRef(null);
  const textareaRef = useRef(null);
  const intervalRef = useRef(null);
  const typingTimer = useRef(null);
  const prevLenRef  = useRef(MOCK_MESSAGES.length);
  const fileInputRef = useRef(null);
  const emojiBtnRef  = useRef(null);  // ancre pour positionner le picker

  // ── Statut en ligne ──
  const lastMsgTime = messages.at(-1)?.time;
  const isOnline = lastMsgTime
    ? (Date.now() - new Date(lastMsgTime).getTime()) < 5 * 60 * 1000
    : false;

  const roleLabel = conv?.role === "pharmacist" ? "Pharmacien" : "Garde-malade";
  const color     = avatarColor(conv?.role);

  // ── Scroll ──
  const scrollToBottom = useCallback((behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
    setNewMsgCount(0);
  }, []);

  const handleScroll = useCallback(() => {
    const el = bodyRef.current; if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom);
    if (atBottom) setNewMsgCount(0);
  }, []);

  useEffect(() => { scrollToBottom("instant"); }, [conv?.id]);
  useEffect(() => {
    if (isAtBottom) { scrollToBottom(); }
    else {
      const prev = prevLenRef.current;
      const newOther = messages.slice(prev).filter(m => m.sender === "other").length;
      if (newOther > 0) setNewMsgCount(n => n + newOther);
    }
    prevLenRef.current = messages.length;
  }, [messages]);

  // ── Auto-resize textarea ──
  useEffect(() => {
    const ta = textareaRef.current; if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  // ── Polling ──
  const fetchMessages = useCallback(async () => {
    if (!conv?.id) return;
    try {
      const data = await api.getMessages(conv.id);
      if (Array.isArray(data) && data.length > 0) setMessages(data.map(normalizeMsg));
    } catch { /* silencieux */ }
  }, [conv?.id]);

  useEffect(() => {
    if (!conv?.id) return;
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalRef.current);
  }, [conv?.id, fetchMessages]);

  // ── Simulation typing ──
  const simulateTyping = useCallback(() => {
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2200);
    }, 2800);
  }, []);

  // ── Envoi ──
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if ((!text && !attachment) || sending) return;

    if (editingMsg) {
      // Cas : Modification
      if (text !== editingMsg.content) {
        setMessages(prev => prev.map(m =>
          m.id === editingMsg.id ? { ...m, content: text, edited: true } : m
        ));
        // Optionnel : appel API
        api.updateMessage?.(editingMsg.id, text).catch(() => {});
      }
      setEditingMsg(null);
      setInput("");
      return;
    }

    const content = text || (attachment ? `[Fichier : ${attachment.file.name}]` : "");
    const tempMsg = { id: `tmp-${Date.now()}`, sender: "me", content, time: nowISO(), read: false };
    setMessages(prev => [...prev, tempMsg]);
    setInput(""); setAttachment(null); setSending(true);
    simulateTyping();
    try {
      const saved = await api.sendMessage(conv.id, content);
      if (saved?.id) {
        setMessages(prev => prev.map(m =>
          m.id === tempMsg.id ? normalizeMsg({ ...saved, is_mine: true }) : m
        ));
      }
    } catch { /* silencieux */ }
    finally { setSending(false); }
  }, [input, sending, conv?.id, simulateTyping, attachment, editingMsg]);

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Marquer lu ──
  useEffect(() => {
    if (!conv?.id || allRead) return;
    api.markConversationRead(conv.id).catch(() => {});
    setAllRead(true);
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  }, [conv?.id]);

  // ── Actions messages ──
  const handleEdit = (msg) => {
    setEditingMsg(msg);
    setInput(msg.content);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const len = msg.content.length;
        textareaRef.current.setSelectionRange(len, len);
      }
    }, 50);
  };

  const cancelEdit = () => {
    setEditingMsg(null);
    setInput("");
  };

  const handleDeleteMsg = (id) => {
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, deleted: true } : m
    ));
  };

  const handleBlock = async () => {
    const newState = !isBlocked;
    setIsBlocked(newState);
    if (newState) {
      // Optionnel : appel API
      api.blockUser?.(conv.id).catch(() => {});
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      await api.reportUser?.(conv.id, reportReason);
      setShowReportModal(false);
      setReportReason("");
      alert("Merci. Votre signalement a été transmis aux administrateurs.");
    } catch {
      alert("Erreur lors de l'envoi du signalement.");
    } finally {
      setReporting(false);
    }
  };

  // ── Pièce jointe ──
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert("Fichier trop volumineux (max 10 Mo)");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setAttachment({ file, previewUrl });
    e.target.value = ""; // reset pour permettre re-sélection
  };

  if (!conv) return null;

  const grouped  = groupByDate(messages);
  const charCount = input.length;
  const canSend  = (input.trim().length > 0 || !!attachment) && !sending;

  const containerStyle = embedded
    ? { display: "flex", flexDirection: "column", height: "100%", position: "relative",
        borderRadius: 16, overflow: "hidden", border: `1px solid ${c.border}`, background: c.card }
    : { position: "fixed", bottom: 24, right: 24,
        width: "min(400px, 92vw)", height: "min(560px, 82vh)",
        display: "flex", flexDirection: "column",
        borderRadius: 20, overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
        border: `1px solid ${c.border}`, background: c.card,
        zIndex: 60, animation: "chatWindowIn 0.2s ease forwards" };

  return (
    <>
      <style>{`
        @keyframes chatWindowIn {
          from { transform: scale(0.93) translateY(14px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%           { transform: translateY(-5px); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
      `}</style>

      <div style={containerStyle}>

        {/* ══ HEADER ═════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
          style={{ borderColor: c.border, background: c.nav }}>

          {onBack && (
            <button onClick={onBack}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity shrink-0"
              style={{ color: c.txt3 }}>
              <ChevronLeft size={17} />
            </button>
          )}

          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: color }}>
            {initials(conv.name)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: c.txt }}>{conv.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full shrink-0"
                style={{ background: isOnline ? c.green : c.txt3,
                  animation: isOnline ? "pulseDot 2s ease-in-out infinite" : "none" }} />
              <p className="text-[11px]" style={{ color: c.txt3 }}>
                {roleLabel} · {isOnline ? "En ligne" : "Hors ligne"}
              </p>
            </div>
          </div>

          {/* ⋮ Menu */}
          <div className="relative shrink-0">
            <button onClick={() => setShowMenu(v => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:opacity-80"
              style={{ borderColor: c.border, color: c.txt2 }}>
              <MoreVertical size={15} />
            </button>
            {showMenu && (
              <DropdownMenu 
                onClose={() => setShowMenu(false)} 
                onBlock={handleBlock}
                onReport={() => setShowReportModal(true)}
                isBlocked={isBlocked}
                c={c} 
              />
            )}
          </div>

          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:opacity-70 shrink-0"
            style={{ borderColor: c.border, color: c.txt3 }}>
            <X size={14} />
          </button>
        </div>

        {/* ══ BODY ═══════════════════════════════════════════════════════════ */}
        <div ref={bodyRef} onScroll={handleScroll}
          className="flex-1 overflow-y-auto py-4 flex flex-col gap-1"
          style={{ background: dk ? "rgba(8,13,22,0.6)" : "rgba(240,244,248,0.7)",
            scrollbarWidth: "thin" }}>

          {grouped.map((item, idx) => {
            if (item.type === "separator") {
              return (
                <div key={`sep-${idx}`} className="flex items-center gap-3 px-6 my-2">
                  <div className="flex-1 h-px" style={{ background: c.border }} />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: c.txt3, background: c.blueLight }}>
                    {item.label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: c.border }} />
                </div>
              );
            }
            const next = grouped[idx + 1];
            const showAvatar = !next || next.type === "separator" || next.sender !== item.sender;
            return (
              <MessageBubble key={item.id} msg={item} conv={conv} c={c}
                showAvatar={showAvatar}
                onEdit={handleEdit}
                onDelete={handleDeleteMsg} />
            );
          })}

          {isTyping && <TypingDots c={c} />}
          <div ref={bottomRef} />
        </div>

        {/* Bouton scroll bas */}
        {newMsgCount > 0 && (
          <button onClick={scrollToBottom}
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg z-10 transition-all hover:opacity-90 active:scale-95"
            style={{ bottom: 80, background: c.blue, animation: "chatWindowIn 0.2s ease forwards" }}>
            <ChevronDown size={13} />
            {newMsgCount} nouveau{newMsgCount > 1 ? "x" : ""} message{newMsgCount > 1 ? "s" : ""}
          </button>
        )}

        {/* Emoji picker — fixed, positionné par rapport au bouton */}
        {showEmoji && (
          <EmojiPicker
            onSelect={e => setInput(v => v + e)}
            onClose={() => setShowEmoji(false)}
            c={c}
            anchorRef={emojiBtnRef}
          />
        )}

        {/* ══ FOOTER ═════════════════════════════════════════════════════════ */}
        <div className="px-3 py-2.5 border-t shrink-0 relative"
          style={{ borderColor: c.border, background: c.nav }}>

          {/* Bloqué state footer */}
          {isBlocked ? (
            <div className="flex flex-col items-center gap-2 py-2 px-4 text-center">
              <p className="text-sm font-medium" style={{ color: c.txt2 }}>
                Vous avez bloqué cet utilisateur.
              </p>
              <button 
                onClick={handleBlock}
                className="text-xs font-bold px-4 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
                style={{ color: "#E05555" }}
              >
                Débloquer
              </button>
            </div>
          ) : (
            <>
              {/* Instagram-style Editing Bar */}
              {editingMsg && (
                <div className="absolute bottom-full left-0 right-0 px-4 py-2 border-t flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200"
                  style={{ background: c.card, borderColor: c.border, zIndex: 5 }}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-1 h-8 rounded-full bg-blue-500 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-blue-500">Modification du message</span>
                      <p className="text-xs truncate opacity-60" style={{ color: c.txt }}>{editingMsg.content}</p>
                    </div>
                  </div>
                  <button 
                    onClick={cancelEdit}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    style={{ color: c.txt3 }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Prévisualisation pièce jointe */}
              {attachment && (
                <AttachmentPreview
                  file={attachment.file}
                  previewUrl={attachment.previewUrl}
                  onRemove={() => setAttachment(null)}
                  c={c}
                />
              )}

              {/* Input row — tous les éléments alignés verticalement au centre */}
              <div className="flex items-center gap-2">

                {/* 📎 Pièce jointe */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Pièce jointe"
                  className="flex items-center justify-center rounded-xl border shrink-0 transition-all hover:opacity-80"
                  style={{ width: 36, height: 36, borderColor: c.border, color: c.txt3 }}>
                  <Paperclip size={15} />
                </button>

                {/* 😊 Emoji */}
                <button
                  ref={emojiBtnRef}
                  onClick={() => setShowEmoji(v => !v)}
                  title="Emoji"
                  className="flex items-center justify-center rounded-xl border shrink-0 transition-all hover:opacity-80"
                  style={{ width: 36, height: 36, borderColor: c.border,
                    color: showEmoji ? c.blue : c.txt3,
                    background: showEmoji ? c.blueLight : "transparent" }}>
                  <Smile size={15} />
                </button>

                {/* Textarea auto-resize */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrire un message… (Maj+Entrée = saut de ligne)"
                    rows={1}
                    className="w-full text-sm outline-none resize-none"
                    style={{
                      borderRadius: 20,
                      border: `1.5px solid ${c.border}`,
                      background: c.blueLight,
                      color: c.txt,
                      padding: "9px 14px",
                      minHeight: 36,
                      maxHeight: 120,
                      lineHeight: "1.45",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                      display: "block",
                    }}
                  />
                  {charCount > 200 && (
                    <span className="absolute bottom-1.5 right-3 text-[9px] font-bold pointer-events-none"
                      style={{ color: charCount > 500 ? "#E05555" : c.txt3 }}>
                      {charCount}
                    </span>
                  )}
                </div>

                {/* Envoyer */}
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="flex items-center justify-center rounded-xl text-white shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-35"
                  style={{ width: 36, height: 36, background: c.blue }}>
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* ══ MODAL SIGNALEMENT ══════════════════════════════════════════════ */}
        {showReportModal && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div className="w-full max-w-[280px] bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200" style={{ background: c.card }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                  <ShieldAlert size={28} />
                </div>
                <h3 className="text-base font-bold text-center" style={{ color: c.txt }}>Signaler l'utilisateur</h3>
                <p className="text-xs text-center opacity-60 px-2" style={{ color: c.txt }}>
                  Décrivez brièvement le problème pour les administrateurs.
                </p>
                <textarea
                  autoFocus
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder="Raison du signalement..."
                  className="w-full text-sm p-3 rounded-2xl border outline-none resize-none h-24 mt-1"
                  style={{ background: c.blueLight, borderColor: c.border, color: c.txt }}
                />
                <div className="grid grid-cols-2 gap-2 w-full mt-2">
                  <button 
                    onClick={() => setShowReportModal(false)}
                    className="py-2.5 rounded-xl text-xs font-bold border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: c.border, color: c.txt2 }}
                  >
                    Annuler
                  </button>
                  <button 
                    disabled={!reportReason.trim() || reporting}
                    onClick={handleReport}
                    className="py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {reporting ? "Envoi..." : "Signaler"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
