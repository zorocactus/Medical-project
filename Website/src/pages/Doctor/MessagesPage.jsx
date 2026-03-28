import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Send, Phone, Video, MoreVertical, MessageSquare, Paperclip, Moon, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";

const AVATAR_COLORS = [
  "#6492C9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#3B82F6", "#6366F1",
];

function getInitials(firstName = "", lastName = "") {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { patients } = useData();
  const { theme } = useTheme();

  const [selectedIdx, setSelectedIdx] = useState(0); 
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  
  const [conversations, setConversations] = useState({
    0: [
      { from: "patient", text: "Doctor, should I take Lisinopril with or without food?", time: new Date(Date.now() - 3600000) },
      { from: "doctor", text: "You can take it either way — the key is to take it at the same time every day.", time: new Date(Date.now() - 1800000) },
      { from: "patient", text: "Thanks! Also experiencing some morning dizziness, is that normal?", time: new Date(Date.now() - 600000) }
    ]
  });
  
  const bottomRef = useRef(null);

  const filteredPatients = patients.length > 0 ? patients.filter((p) => {
    const name = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
    return name.includes(search.toLowerCase());
  }) : [
    { firstName: "Alex", lastName: "Johnson", lastMsg: "About my Lisinopril prescription...", time: "10:45", status: "online", unread: true },
    { firstName: "Nadia", lastName: "Khelifa", lastMsg: "Thank you doctor, feeling better..", time: "Yesterday", status: "offline", unread: true },
    { firstName: "Youcef", lastName: "Belaid", lastMsg: "My daughter will accompany me tomorrow", time: "Oct 22", status: "offline", unread: false }
  ];

  const selectedPatient = selectedIdx !== null ? filteredPatients[selectedIdx] : null;
  const currentChat = selectedIdx !== null ? (conversations[selectedIdx] || []) : [];

  const sendMessage = () => {
    if (!input.trim() || selectedIdx === null) return;
    const msg = { from: "doctor", text: input.trim(), time: new Date() };
    setConversations(prev => ({
      ...prev,
      [selectedIdx]: [...(prev[selectedIdx] || []), msg]
    }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-[#0D2644] dark:text-white mb-2">Messages</h1>
      <p className="text-[#5C738A] dark:text-gray-400 text-sm mb-8">2 unread</p>

      <div className="flex gap-6 h-[600px]">
        {/* Left - Conversations list */}
        <div className="w-[400px] shrink-0 bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#0D2644] dark:text-white">Conversations</h2>
            <span className="bg-[#F0F6FF] dark:bg-[#1E2D4A] text-[#6492C9] text-[11px] font-bold px-3 py-1 rounded-full">2 new</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredPatients.map((p, i) => {
              const isSelected = selectedIdx === i;
              const initials = getInitials(p.firstName, p.lastName);
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  className={`w-full flex items-center gap-4 px-6 py-4 transition-colors relative ${isSelected ? "bg-[#F0F6FF] dark:bg-[#1E2D4A] border-l-4 border-[#6492C9]" : "hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent"}`}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: color }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[14px] text-[#033E8C] dark:text-blue-300">{p.firstName} {p.lastName}</span>
                      <span className="text-[11px] text-[#A0B5CD]">{p.time || "10:45"}</span>
                    </div>
                    <p className="text-[12px] text-[#A0B5CD] truncate leading-tight">
                      {p.lastMsg || "Click to start conversation"}
                    </p>
                  </div>
                  {p.unread && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right - Chat panel */}
        <div className="flex-1 bg-white dark:bg-[#172133] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
          {selectedPatient ? (
            <>
              <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-[#172133]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: AVATAR_COLORS[selectedIdx % AVATAR_COLORS.length] }}>
                  {getInitials(selectedPatient.firstName, selectedPatient.lastName)}
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-[#0D2644] dark:text-white leading-tight">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[11px] font-medium text-emerald-500">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 bg-[#F8FAFC]/30 dark:bg-transparent">
                {currentChat.map((msg, idx) => {
                  const isDoctor = msg.from === "doctor";
                  return (
                    <div key={idx} className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed ${isDoctor 
                        ? 'bg-[#6492C9] text-white' 
                        : 'bg-[#F0F6FF] dark:bg-[#1E2D4A] text-[#0D2644] dark:text-white border border-blue-50 dark:border-blue-900/30'}`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-white dark:bg-[#172133]">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..." 
                    className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[14px] focus:outline-none focus:border-[#6492C9] dark:text-white"
                  />
                  <button 
                    onClick={sendMessage}
                    className="bg-[#6492C9] hover:bg-[#304B71] text-white px-8 py-3 rounded-xl font-bold text-[14px] transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#A0B5CD] italic">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
