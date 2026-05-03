// src/pages/admin/views/ProfileUpdateRequests.jsx
import { useState, useEffect } from "react";
import * as api from "../../../services/api";
import { getAdminTheme } from "../adminTheme.js";
import { useLanguage } from "../../../context/LanguageContext";
import { Card, Badge } from "../AdminPrimitives.jsx";
import { 
  User, Check, X, Clock, AlertTriangle, 
  RefreshCw, UserCheck, MessageSquare 
} from "lucide-react";

export default function ProfileUpdateRequests({ dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminProfileUpdates();
      // Ensure we only show pending requests by default if backend doesn't filter
      setRequests(Array.isArray(data) ? data : data.results || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile updates:", err);
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    let notes = "";
    if (action === "reject") {
      notes = window.prompt(t('rejection_reason_prompt'), "");
      if (notes === null) return; // User cancelled
    }

    try {
      setProcessingId(id);
      await api.actionProfileUpdate(id, action, notes);
      // Remove from list on success
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(`Error ${action}ing profile update:`, err);
      alert(err.message || `Failed to ${action} update`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <RefreshCw size={40} className="animate-spin text-blue-500" />
        <p className="text-sm font-medium" style={{ color: c.txt3 }}>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: c.txt }}>
          {t('profile_updates_title')}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
          {t('profile_updates_desc')}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" 
          style={{ background: c.red + "12", borderColor: c.red + "40", color: c.red }}>
          <AlertTriangle size={18} />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchRequests} className="ml-auto text-xs underline font-bold">
            {t('common.refresh')}
          </button>
        </div>
      )}

      {!loading && requests.length === 0 ? (
        <Card dk={dk} empty={true} style={{ padding: 64, textAlign: "center" }}>
          <UserCheck size={48} style={{ color: c.green, margin: "0 auto 16px", opacity: 0.5 }} />
          <p className="text-lg font-bold" style={{ color: c.txt }}>
            {t('no_pending_updates')}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <Card key={req.id} dk={dk} style={{ padding: 24 }}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* User Info */}
                <div className="flex items-center gap-4 shrink-0 min-w-[240px]">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: c.blue }}>
                    {(req.user_full_name?.[0] || "U").toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: c.txt }}>
                      {req.user_full_name}
                    </h3>
                    <p className="text-xs font-medium" style={{ color: c.txt3 }}>
                      {req.user_email}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: c.txt3 }}>
                      <Clock size={12} />
                      {new Date(req.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Changes Comparison */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border" style={{ background: c.header, borderColor: c.border }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50" style={{ color: c.txt }}>
                      {t('current_value')}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-bold" style={{ color: c.txt }}>
                        {req.old_first_name} {req.old_last_name}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border" 
                    style={{ background: c.blue + "08", borderColor: c.blue + "40" }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: c.blue }}>
                      {t('requested_value')}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-bold" style={{ color: c.blue }}>
                        {req.new_first_name} {req.new_last_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="flex-1 max-w-md">
                  <div className="flex items-center gap-2 mb-1.5 text-[10px] font-black uppercase tracking-widest opacity-60" 
                    style={{ color: c.txt }}>
                    <MessageSquare size={12} />
                    {t('change_reason')}
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: c.txt2 }}>
                    "{req.reason}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAction(req.id, "approve")}
                    disabled={processingId === req.id}
                    className="h-10 px-4 rounded-xl flex items-center gap-2 font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                    style={{ background: c.green }}
                  >
                    {processingId === req.id ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
                    {t('approve_change')}
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "reject")}
                    disabled={processingId === req.id}
                    className="h-10 px-4 rounded-xl flex items-center gap-2 font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                    style={{ background: c.red }}
                  >
                    <X size={16} />
                    {t('reject_change')}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
