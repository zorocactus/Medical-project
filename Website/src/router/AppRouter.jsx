import { useAuth } from "../context/AuthContext"
import AuthTransition from "../components/Auth/AuthTransition"
import PatientSidebar from "../components/SideBar/PatientSB"
import DoctorSidebar from "../components/SideBar/DoctorSB"
import GardeMSidebar from "../components/SideBar/GardeMSB"
import PharmacienSidebar from "../components/SideBar/PharmacienSB"

export default function AppRouter() {
  const { isAuthenticated, accountType, login } = useAuth()

  if (!isAuthenticated) {
    return <AuthTransition onLogin={(type) => login(type, {})} />
  }

  return (
    <div className="flex min-h-screen bg-[#D1DFEC] font-sans">
      {accountType === "Patient"       && <PatientSidebar />}
      {accountType === "Doctor"        && <DoctorSidebar />}
      {accountType === "Garde malade"  && <GardeMSidebar />}
      {accountType === "Pharmacien"    && <PharmacienSidebar />}
      <main className="flex-1 p-8">
        {/* dashboard ici */}
      </main>
    </div>
  )
}