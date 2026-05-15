import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import * as api from "../services/api";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convertit un plan médicamenteux backend → format utilisé dans le frontend */
function normalizeSchedule(s) {
  const meds = s.medications || {};
  return {
    id:          s.id,
    patient_id:  s.patient_id,
    patientName: s.patient_name || "",
    initials:    (s.patient_name || "?")
                   .split(" ")
                   .map(w => w[0])
                   .join("")
                   .toUpperCase()
                   .slice(0, 2),
    condition:   s.condition || "",
    status:      "Active",
    morning:     meds.morning   || [],
    afternoon:   meds.afternoon || [],
    evening:     meds.evening   || [],
    care_request: s.care_request,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DataProvider({ children }) {
  const { userData } = useAuth();
  const [patients, setPatients]               = useState([]);
  const [appointments, setAppointments]       = useState([]);
  const [patientRequests, setPatientRequests] = useState([]);
  const [prescriptions, setPrescriptions]     = useState([]);
  const [gmPatients, setGmPatients]           = useState([]);
  const [gmTreatments, setGmTreatments]       = useState([]);
  const [globalNotifications, setGlobalNotifications] = useState([]);
  const [unreadChatCount, setUnreadChatCount]         = useState(0);
  const [globalSearch, setGlobalSearch]               = useState("");
  const [dashboardData, setDashboardData]             = useState(null);
  const chatPollRef = useRef(null);

  // ── Notifications ──────────────────────────────────────────────────────────

  function addNotification(title, message, type = "info") {
    setGlobalNotifications(prev => [
      { id: Date.now(), title, message, type, read: false, createdAt: new Date() },
      ...prev,
    ]);
  }

  function addErrorNotification(message) {
    addNotification("Erreur", message, "error");
  }

  function markNotificationRead(id) {
    setGlobalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllNotificationsRead() {
    setGlobalNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  // ── Chat polling ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!userData) return;
    const fetchUnread = async () => {
      try {
        const data = await api.getConversations();
        if (Array.isArray(data)) {
          const total = data.reduce((acc, c) => acc + (c.unread || 0), 0);
          setUnreadChatCount(total);
        }
      } catch { /* silencieux */ }
    };
    fetchUnread();
    chatPollRef.current = setInterval(fetchUnread, 10_000);
    return () => clearInterval(chatPollRef.current);
  }, [userData?.role]);

  // ── Refresh functions ───────────────────────────────────────────────────────

  const refreshDoctorAppointments = useCallback(async () => {
    try {
      const data = await api.getDoctorAppointments();
      setAppointments(Array.isArray(data) ? data : (data?.results || []));
    } catch (e) {
      addErrorNotification("Impossible de charger les rendez-vous : " + e.message);
    }
  }, []);

  const refreshDashboardData = useCallback(async () => {
    try {
      const data = await api.getDoctorDashboard();
      if (data) setDashboardData(data);
    } catch { /* silencieux pour le dashboard */ }
  }, []);

  const refreshPatientRequests = useCallback(async () => {
    try {
      const data = await api.getPendingAppointments();
      setPatientRequests(Array.isArray(data) ? data : (data?.results || []));
    } catch (e) {
      addErrorNotification("Impossible de charger les demandes de patients : " + e.message);
    }
  }, []);

  const refreshDoctorPatients = useCallback(async () => {
    try {
      const data = await api.getDoctorPatients();
      setPatients(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (e) {
      setPatients([]);
      addErrorNotification("Impossible de charger la liste des patients : " + e.message);
    }
  }, []);

  const refreshDoctorPrescriptions = useCallback(async () => {
    try {
      const data = await api.getMyPrescriptions();
      setPrescriptions(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (e) {
      addErrorNotification("Impossible de charger les ordonnances : " + e.message);
    }
  }, []);

  const refreshGmPatients = useCallback(async () => {
    try {
      const data = await api.getCaretakerDashboard();
      setGmPatients(Array.isArray(data?.my_patients) ? data.my_patients : []);
    } catch (e) {
      setGmPatients([]);
      addErrorNotification("Impossible de charger vos patients : " + e.message);
    }
  }, []);

  const refreshGmTreatments = useCallback(async () => {
    try {
      const data = await api.getMedicationSchedules();
      setGmTreatments(Array.isArray(data) ? data.map(normalizeSchedule) : []);
    } catch (e) {
      setGmTreatments([]);
      addErrorNotification("Impossible de charger les plans médicamenteux : " + e.message);
    }
  }, []);

  // ── Mount effect ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (userData?.role === "doctor") {
      refreshDoctorAppointments();
      refreshPatientRequests();
      refreshDoctorPatients();
      refreshDashboardData();
      refreshDoctorPrescriptions();
      const poll = setInterval(() => {
        refreshPatientRequests();
        refreshDoctorAppointments();
        refreshDashboardData();
      }, 30_000);
      return () => clearInterval(poll);
    } else if (userData?.role === "caretaker") {
      refreshGmPatients();
      refreshGmTreatments();
    } else {
      setAppointments([]);
      setPatientRequests([]);
      setPatients([]);
      setDashboardData(null);
      setGmPatients([]);
      setGmTreatments([]);
    }
  }, [userData?.role]);

  // ── Prescriptions helpers ───────────────────────────────────────────────────

  function addPrescription(rx) {
    setPrescriptions(prev => [rx, ...prev]);
  }

  async function loadGMDemoData() {
    await Promise.all([refreshGmPatients(), refreshGmTreatments()]);
  }

  // ── Medication schedule mutations (avec appel API + mise à jour optimiste) ──

  async function addMedicationToTreatment(scheduleId, timeSlot, newMed) {
    const current = gmTreatments.find(t => t.id === scheduleId);
    if (!current) return;

    const updatedMeds = {
      morning:   current.morning,
      afternoon: current.afternoon,
      evening:   current.evening,
      [timeSlot]: [...(current[timeSlot] || []), { ...newMed, done: false }],
    };

    // Mise à jour optimiste immédiate
    setGmTreatments(prev => prev.map(t =>
      t.id === scheduleId ? { ...t, ...updatedMeds } : t
    ));

    try {
      await api.updateMedicationSchedule(scheduleId, { medications: updatedMeds });
    } catch (e) {
      // Rollback si l'API échoue
      setGmTreatments(prev => prev.map(t =>
        t.id === scheduleId ? current : t
      ));
      addErrorNotification("Impossible d'ajouter le médicament : " + e.message);
    }
  }

  async function removeMedicationFromTreatment(scheduleId, timeSlot, medIndex) {
    const current = gmTreatments.find(t => t.id === scheduleId);
    if (!current) return;

    const updatedMeds = {
      morning:   current.morning,
      afternoon: current.afternoon,
      evening:   current.evening,
      [timeSlot]: (current[timeSlot] || []).filter((_, i) => i !== medIndex),
    };

    setGmTreatments(prev => prev.map(t =>
      t.id === scheduleId ? { ...t, ...updatedMeds } : t
    ));

    try {
      await api.updateMedicationSchedule(scheduleId, { medications: updatedMeds });
    } catch (e) {
      setGmTreatments(prev => prev.map(t =>
        t.id === scheduleId ? current : t
      ));
      addErrorNotification("Impossible de supprimer le médicament : " + e.message);
    }
  }

  async function addPatientToTreatments(patient) {
    // patient doit avoir care_request_id (depuis gmPatients)
    if (gmTreatments.find(t => t.patient_id === patient.id)) return;

    try {
      const created = await api.createMedicationSchedule({
        care_request: patient.care_request_id,
        condition:    patient.condition || "",
        medications:  { morning: [], afternoon: [], evening: [] },
      });
      setGmTreatments(prev => [...prev, normalizeSchedule(created)]);
    } catch (e) {
      addErrorNotification("Impossible d'ajouter le patient au plan : " + e.message);
    }
  }

  async function removePatientFromTreatments(scheduleId) {
    const snapshot = gmTreatments;
    setGmTreatments(prev => prev.filter(t => t.id !== scheduleId));

    try {
      await api.deleteMedicationSchedule(scheduleId);
    } catch (e) {
      setGmTreatments(snapshot);
      addErrorNotification("Impossible de retirer le patient : " + e.message);
    }
  }

  // ── Provider value ──────────────────────────────────────────────────────────

  return (
    <DataContext.Provider value={{
      patients, appointments, patientRequests, prescriptions, addPrescription,
      setAppointments, setPatientRequests,
      refreshDoctorAppointments, refreshPatientRequests,
      refreshDoctorPatients, refreshDoctorPrescriptions, refreshGmPatients, refreshGmTreatments,
      dashboardData, refreshDashboardData,
      gmPatients, gmTreatments, loadGMDemoData,
      addMedicationToTreatment, removeMedicationFromTreatment,
      addPatientToTreatments, removePatientFromTreatments,
      globalNotifications, addNotification, markNotificationRead, markAllNotificationsRead,
      unreadChatCount, setUnreadChatCount,
      globalSearch, setGlobalSearch,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData doit être utilisé dans <DataProvider>");
  return ctx;
}
