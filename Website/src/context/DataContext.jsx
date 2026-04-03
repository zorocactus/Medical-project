import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

const STORAGE_KEY = "medsmart_patients";
const RX_STORAGE_KEY = "medsmart_prescriptions";
const GM_PATIENTS_KEY = "medsmart_gm_patients_v2";
const GM_TREATMENTS_KEY = "medsmart_gm_treatments_v2";

export function DataProvider({ children }) {
  const [patients, setPatients] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const stored = localStorage.getItem(RX_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [appointments, setAppointments] = useState([]);
  const [patientRequests, setPatientRequests] = useState([]);
  const [gmPatients, setGmPatients] = useState(() => {
    try {
      const stored = localStorage.getItem(GM_PATIENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [gmTreatments, setGmTreatments] = useState(() => {
    try {
      const stored = localStorage.getItem(GM_TREATMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(GM_PATIENTS_KEY, JSON.stringify(gmPatients));
  }, [gmPatients]);

  useEffect(() => {
    localStorage.setItem(GM_TREATMENTS_KEY, JSON.stringify(gmTreatments));
  }, [gmTreatments]);

  function loadGMDemoData() {
    setGmPatients([
      {
        id: 1,
        name: "Alex Johnson",
        age: 36,
        gender: "Male",
        city: "Alger",
        initials: "AJ",
        condition: "Hypertension · Diabetes T2",
        conditions: ["Hypertension", "Diabetes"],
        vitals: [
          { label: "Blood Pressure", value: "138/88", unit: "mmHg" },
          { label: "Blood Sugar", value: "142", unit: "mg/dL", highlight: true },
          { label: "Heart Rate", value: "78", unit: "bpm" },
        ],
        adherence: 84,
        status: "Stable",
        nextMed: "2h 30min",
        color: "blue"
      },
      {
        id: 2,
        name: "Youcef Belaid",
        age: 72,
        gender: "Male",
        city: "Alger",
        initials: "YB",
        condition: "Post-cardiac surgery · 72 yrs",
        conditions: ["Post-surgery", "Cardiology"],
        vitals: [
          { label: "Blood Pressure", value: "152/95", unit: "mmHg", highlight: true },
          { label: "Heart Rate", value: "65", unit: "bpm" },
          { label: "INR (Warfarin)", value: "2.4", unit: "" },
        ],
        adherence: 55,
        status: "Monitor",
        nextMed: "45 min",
        color: "amber"
      },
      {
        id: 3,
        name: "Nadia Khelifa",
        age: 58,
        gender: "Female",
        city: "Alger",
        initials: "NK",
        condition: "Diabetes T2 · 58 yrs",
        conditions: ["Diabetes T2"],
        vitals: [
          { label: "Blood Sugar", value: "118", unit: "mg/dL" },
          { label: "HbA1c", value: "6.8", unit: "%" },
          { label: "Weight", value: "72", unit: "kg" },
        ],
        adherence: 95,
        status: "Good",
        nextMed: "8:00 PM",
        color: "emerald"
      }
    ]);

    setGmTreatments([
      {
        id: 1,
        patientName: "Alex Johnson",
        initials: "AJ",
        condition: "Hypertension + Diabetes · Dr. Benali Karim",
        status: "Active",
        color: "blue",
        morning: [
          { name: "Lisinopril 10mg", dosage: "1 tablet", done: true },
          { name: "Metformin 500mg", dosage: "1 tablet with food", done: true },
        ],
        afternoon: [
          { name: "Vitamin D3 2000 IU", dosage: "1 capsule", done: false },
        ],
        evening: [
          { name: "Metformin 500mg", dosage: "1 tablet with food", done: false },
        ],
        specialInstructions: null
      },
      {
        id: 2,
        patientName: "Youcef Belaid",
        initials: "YB",
        condition: "Post-cardiac surgery · Dr. Benali Karim",
        status: "Monitor closely",
        color: "amber",
        morning: [
          { name: "Warfarin 5mg", dosage: "Check INR weekly", done: true },
          { name: "Bisoprolol 5mg", dosage: "1 tablet", done: true },
        ],
        afternoon: [
          { name: "Amiodarone 200mg", dosage: "With food", done: false },
        ],
        evening: [],
        specialInstructions: "Check BP twice daily. Report if systolic >160. No grapefruit juice. INR check every Monday."
      }
    ]);
  }

  // Persist patients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(RX_STORAGE_KEY, JSON.stringify(prescriptions));
  }, [prescriptions]);

  function addPatient(patient) {
    setPatients((prev) => {
      const next = [...prev, { ...patient, id: Date.now() }];
      return next;
    });
  }

  function addAppointment(appointment) {
    setAppointments((prev) => [...prev, appointment]);
  }

  function addPatientRequest(request) {
    setPatientRequests((prev) => [...prev, request]);
  }

  function addPrescription(prescription) {
    setPrescriptions((prev) => [prescription, ...prev]);
  }

  return (
    <DataContext.Provider value={{
      patients,
      appointments,
      patientRequests,
      prescriptions,
      gmPatients,
      gmTreatments,
      addPatient,
      addAppointment,
      addPatientRequest,
      addPrescription,
      loadGMDemoData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
