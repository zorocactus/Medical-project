import { useAuth } from "../context/AuthContext"
import AuthTransition from "../components/Auth/AuthTransition"
import PatientSidebar from "../components/SideBar/PatientSB"
import GardeMSidebar from "../components/SideBar/GardeMSB"
import PharmacienSidebar from "../components/SideBar/PharmacienSB"
import DoctorDashboard from "../pages/DoctorDashboard"
import { DataProvider } from "../context/DataContext"

const PATIENTS_STORAGE_KEY = "medsmart_patients";

function savePatientToStorage(userData) {
  try {
    const existing = JSON.parse(localStorage.getItem(PATIENTS_STORAGE_KEY) || "[]");
    const newPatient = {
      ...userData,
      id: Date.now(),
      firstName: userData.firstName || userData.prenom || "",
      lastName: userData.lastName || userData.nom || "",
    };
    existing.push(newPatient);
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error("Failed to save patient:", e);
  }
}

export default function AppRouter() {
  const { isAuthenticated, accountType, login } = useAuth()

  if (!isAuthenticated) {
    return <AuthTransition onLogin={(userData) => {
      if (typeof userData === "string") {
        login(userData, {});
        return;
      }
      const type = userData?.role || userData?.accountType || "Patient";
      // If a patient finishes registration, persist their data for the doctor to see
      if (
        userData?.accountType === "patient" ||
        type === "Patient"
      ) {
        savePatientToStorage(userData);
      }
      login(type, userData || {});
    }} />
  }

  if (accountType === "Médecin" || accountType === "Doctor") {
    return (
      <DataProvider>
        <DoctorDashboard />
      </DataProvider>
    )
  }

  return (
    <DataProvider>
      <div className="flex min-h-screen bg-[#D1DFEC] font-sans">
        {accountType === "Patient"       && <PatientSidebar />}
        {accountType === "Garde-malade"  && <GardeMSidebar />}
        {accountType === "Pharmacien"    && <PharmacienSidebar />}
        <main className="flex-1 p-8">
          {/* dashboard ici */}
        </main>
      </div>
    </DataProvider>
  )
}