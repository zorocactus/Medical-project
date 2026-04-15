import { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    if (userData?.role === "doctor") {
      api.getDoctorAppointments()
        .then(data => { if (Array.isArray(data)) setAppointments(data); })
        .catch(() => {});

      api.getPendingAppointments()
        .then(data => { if (Array.isArray(data)) setPatientRequests(data); })
        .catch(() => {});
    } else {
      setAppointments([]);
      setPatientRequests([]);
    }
  }, [userData?.role]);

  function addPrescription(rx) {
    setPrescriptions(prev => [rx, ...prev]);
  }

  function loadGMDemoData() {
    const demoPatients = [
      {
        id: 1, name: "Alex Johnson", initials: "AJ", condition: "Post-surgery recovery", status: "Stable",
        adherence: 95, color: "blue", nextMed: "45 mins", age: 42, gender: "Male", city: "Algiers",
        phone: "+213 555 10 20 30", address: "12 Rue Didouche Mourad, Alger-Centre",
        emergencyContact: "Sarah Johnson", emergencyPhone: "+213 555 10 20 31",
        conditions: ["Hypertension", "Post-op"],
        vitals: [
          { label: "Blood Pressure", value: "125/82", unit: "mmHg", highlight: false },
          { label: "Heart Rate", value: "72", unit: "bpm", highlight: false },
          { label: "Temperature", value: "36.8", unit: "°C", highlight: false }
        ]
      },
      {
        id: 2, name: "Youcef Belaid", initials: "YB", condition: "Cardiac monitoring", status: "Monitor",
        adherence: 78, color: "amber", nextMed: "2 hours", age: 72, gender: "Male", city: "El Biar",
        phone: "+213 555 40 50 60", address: "5 Cité des Oliviers, El Biar",
        emergencyContact: "Fatima Belaid", emergencyPhone: "+213 555 40 50 61",
        conditions: ["Diabetes T2", "Heart Valve"],
        vitals: [
          { label: "Blood Pressure", value: "142/91", unit: "mmHg", highlight: true },
          { label: "Heart Rate", value: "64", unit: "bpm", highlight: false },
          { label: "Glucose", value: "1.42", unit: "g/L", highlight: true }
        ]
      },
      {
        id: 3, name: "Nadia Khelifa", initials: "NK", condition: "Diabetes management", status: "Active",
        adherence: 92, color: "emerald", nextMed: "15 mins", age: 58, gender: "Female", city: "Center",
        phone: "+213 555 70 80 90", address: "8 Avenue Pasteur, Alger-Centre",
        emergencyContact: "Omar Khelifa", emergencyPhone: "+213 555 70 80 91",
        conditions: ["Diabetes Type 2", "Elderly Care"],
        vitals: [
          { label: "Glucose", value: "1.10", unit: "g/L", highlight: false },
          { label: "Weight", value: "68", unit: "kg", highlight: false }
        ]
      }
    ];

    const demoTreatments = [
      {
        id: 1, initials: "AJ", patientName: "Alex Johnson", condition: "Post-surgery recovery", status: "Active",
        morning: [
          { name: "Lisinopril", dosage: "10mg", done: true },
          { name: "Aspirin", dosage: "75mg", done: true }
        ],
        afternoon: [
          { name: "Metformin", dosage: "500mg", done: false }
        ],
        evening: [
          { name: "Metformin", dosage: "500mg", done: false }
        ]
      },
      {
        id: 2, initials: "YB", patientName: "Youcef Belaid", condition: "Cardiac monitoring", status: "Active",
        morning: [
          { name: "Warfarin", dosage: "5mg", done: true }
        ],
        afternoon: [
          { name: "Amiodarone", dosage: "200mg", done: false }
        ],
        evening: [
          { name: "Warfarin", dosage: "5mg", done: false }
        ],
        specialInstructions: "Monitor for any bruising or unusual bleeding due to blood thinners."
      }
    ];

    setGmPatients(demoPatients);
    setGmTreatments(demoTreatments);
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
      gmPatients, gmTreatments, loadGMDemoData,
      addMedicationToTreatment, removeMedicationFromTreatment,
      addPatientToTreatments, removePatientFromTreatments,
      globalNotifications, addNotification, markNotificationRead, markAllNotificationsRead,
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
