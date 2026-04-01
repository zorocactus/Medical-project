import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [patients, setPatients]               = useState([]);
  const [appointments, setAppointments]       = useState([]);
  const [patientRequests, setPatientRequests] = useState([]);
  const [prescriptions, setPrescriptions]     = useState([]);

  useEffect(() => {
    api.getDoctorAppointments()
      .then(data => { if (Array.isArray(data)) setAppointments(data); })
      .catch(() => {});

    api.getPendingAppointments()
      .then(data => { if (Array.isArray(data)) setPatientRequests(data); })
      .catch(() => {});
  }, []);

  function addPrescription(rx) {
    setPrescriptions(prev => [rx, ...prev]);
  }

  return (
    <DataContext.Provider value={{ patients, appointments, patientRequests, prescriptions, addPrescription }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData doit être utilisé dans <DataProvider>");
  return ctx;
}
