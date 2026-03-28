import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

const STORAGE_KEY = "medsmart_patients";
const RX_STORAGE_KEY = "medsmart_prescriptions";

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
      addPatient,
      addAppointment,
      addPatientRequest,
      addPrescription
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
