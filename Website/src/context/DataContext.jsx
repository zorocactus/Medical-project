import { createContext, useContext, useState, useEffect, useRef } from "react";
import * as api from "../services/api";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

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
  const chatPollRef = useRef(null);

  function addNotification(title, message, type = "info") {
    setGlobalNotifications(prev => [
      { id: Date.now(), title, message, type, read: false, createdAt: new Date() },
      ...prev,
    ]);
  }

  function markNotificationRead(id) {
    setGlobalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllNotificationsRead() {
    setGlobalNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  // Polling du total non-lus chat toutes les 10s (silencieux si API absente)
  useEffect(() => {
    if (!userData) return;
    const fetchUnread = async () => {
      try {
        const data = await api.getConversations();
        if (Array.isArray(data)) {
          const total = data.reduce((acc, c) => acc + (c.unread || 0), 0);
          setUnreadChatCount(total);
        }
      } catch {
        // silencieux
      }
    };
    fetchUnread();
    chatPollRef.current = setInterval(fetchUnread, 10_000);
    return () => clearInterval(chatPollRef.current);
  }, [userData?.role]);

  const refreshDoctorAppointments = async () => {
    try {
      const data = await api.getDoctorAppointments();
      if (Array.isArray(data)) setAppointments(data);
    } catch {}
  };

  const refreshPatientRequests = async () => {
    try {
      const data = await api.getPendingAppointments();
      if (Array.isArray(data)) setPatientRequests(data);
    } catch {}
  };

  const refreshDoctorPatients = async () => {
    try {
      const data = await api.getDoctorPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch {
      setPatients([]);
    }
  };

  const refreshGmPatients = async () => {
    try {
      const data = await api.getCaretakerDashboard();
      // dashboard returns { my_patients: [...], pending_requests: count }
      const list = Array.isArray(data?.my_patients) ? data.my_patients : [];
      setGmPatients(list);
    } catch {
      setGmPatients([]);
    }
  };

  const refreshGmTreatments = async () => {
    try {
      const data = await api.getCaretakerPatientsPrescriptions();
      setGmTreatments(Array.isArray(data) ? data : []);
    } catch {
      setGmTreatments([]);
    }
  };

  useEffect(() => {
    if (userData?.role === "doctor") {
      refreshDoctorAppointments();
      refreshPatientRequests();
      refreshDoctorPatients();
    } else if (userData?.role === "caretaker") {
      refreshGmPatients();
      refreshGmTreatments();
    } else {
      setAppointments([]);
      setPatientRequests([]);
      setPatients([]);
      setGmPatients([]);
      setGmTreatments([]);
    }
  }, [userData?.role]);

  function addPrescription(rx) {
    setPrescriptions(prev => [rx, ...prev]);
  }

  // Recharge depuis l'API. Conservé sous le même nom pour compat avec les composants existants.
  async function loadGMDemoData() {
    await Promise.all([refreshGmPatients(), refreshGmTreatments()]);
  }

  function addMedicationToTreatment(treatmentId, timeSlot, newMed) {
    setGmTreatments(prev => prev.map(t => {
      if (t.id === treatmentId) {
        return {
          ...t,
          [timeSlot]: [...(t[timeSlot] || []), { ...newMed, done: false }]
        };
      }
      return t;
    }));
  }

  function removeMedicationFromTreatment(treatmentId, timeSlot, medIndex) {
    setGmTreatments(prev => prev.map(t => {
      if (t.id === treatmentId) {
        return {
          ...t,
          [timeSlot]: (t[timeSlot] || []).filter((_, i) => i !== medIndex)
        };
      }
      return t;
    }));
  }

  function addPatientToTreatments(patient) {
    if (gmTreatments.find(t => t.id === patient.id)) return;
    setGmTreatments(prev => [...prev, {
      id: patient.id,
      initials: patient.initials,
      patientName: patient.name,
      condition: patient.condition,
      status: "Active",
      morning: [],
      afternoon: [],
      evening: [],
    }]);
  }

  function removePatientFromTreatments(treatmentId) {
    setGmTreatments(prev => prev.filter(t => t.id !== treatmentId));
  }

  return (
    <DataContext.Provider value={{
      patients, appointments, patientRequests, prescriptions, addPrescription,
      setAppointments, setPatientRequests,
      refreshDoctorAppointments, refreshPatientRequests,
      refreshDoctorPatients, refreshGmPatients, refreshGmTreatments,
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
