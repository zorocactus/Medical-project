// ─────────────────────────────────────────────────────────────────────────────
// src/services/api.js
// Fichier central de communication avec le backend MedSmart
// Tous les appels API passent par ici — NE PAS faire de fetch directement
// dans les composants React.
// ─────────────────────────────────────────────────────────────────────────────

// IMP-01 fix : BASE_URL via variable d'environnement Vite (définie dans .env)
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
// ─── Helpers internes ─────────────────────────────────────────────────────────

/** Récupère le token JWT sauvegardé au login */
const getToken = () => localStorage.getItem("access_token");

/** Récupère le refresh token */
const getRefreshToken = () => localStorage.getItem("refresh_token");

/** Sauvegarde les tokens après login */
const saveTokens = ({ access, refresh, role }) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  if (role) localStorage.setItem("mock_role", role); // Stockage temporaire pour le mock
};

/** Supprime les tokens (logout) */
const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("mock_role");
};

/**
 * Fonction fetch centrale avec gestion automatique des erreurs et du token.
 * Si le token expire (401), elle tente un refresh automatique.
 */
async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Ajoute le token JWT si disponible
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token expiré → on tente un refresh automatique
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry la requête originale avec le nouveau token
      headers["Authorization"] = `Bearer ${getToken()}`;
      const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      if (!retryResponse.ok) throw new Error(`Erreur ${retryResponse.status}`);
      return retryResponse.json();
    } else {
      // Refresh échoué → déconnecter l'utilisateur
      clearTokens();
      window.location.href = "/?expired=1"; // redirige vers login avec drapeau d'expiration
      return;
    }
  }

  if (!response.ok) {
    // Tente de lire le message d'erreur du backend
    let errorMsg = `Erreur ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // IMP-11 : ne pas avaler les erreurs qui ne sont pas liées au parsing JSON
      if (!(e instanceof SyntaxError)) throw e;
    }
    throw new Error(errorMsg);
  }

  // 204 No Content (DELETE, etc.) → pas de JSON à retourner
  if (response.status === 204) return null;

  return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. AUTHENTIFICATION  →  /api/auth/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Connexion — retourne { access, refresh, role, user_id }
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  const responseData = await apiFetch("/auth/token/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  
  if (responseData?.access) saveTokens(responseData);
  return responseData;
}

/**
 * Rafraîchit le token d'accès avec le refresh token.
 * Appelé automatiquement par apiFetch si le token expire.
 */
export async function refreshAccessToken() {
  try {
    const refresh = getRefreshToken();
    if (!refresh) return false;

    const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    return true;
  } catch {
    return false;
  }
}

/**
 * Déconnexion — supprime les tokens locaux
 */
export function logout() {
  clearTokens();
}

/**
 * Inscription patient
 * @param {object} userData — { email, email, password, first_name, last_name, ... }
 */
export async function registerPatient(userData) {
  return apiFetch("/auth/register/patient/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * Inscription médecin
 * @param {object} userData — { email, password, password_confirm, role, specialty, license_number, experience_years, ... }
 */
export async function registerDoctor(userData) {
  return apiFetch("/auth/register/doctor/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * Inscription pharmacien (BUG-18 fix)
 * @param {object} userData — { email, password, password_confirm, role, ... }
 */
export async function registerPharmacist(userData) {
  return apiFetch("/auth/register/pharmacist/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * Inscription garde-malade (BUG-18 fix)
 * @param {object} userData — { email, password, password_confirm, role, ... }
 */
export async function registerCaretaker(userData) {
  return apiFetch("/auth/register/caretaker/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * Récupère les infos de l'utilisateur connecté
 * Retourne { id, email, first_name, last_name, role, ... }
 */
export async function getMe() {
  return apiFetch("/auth/me/");
}

/**
 * Met à jour les informations de base de l'utilisateur connecté
 * @param {object} data — champs à modifier
 */
export async function updateMe(data) {
  return apiFetch("/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MÉDECINS  →  /api/doctors/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Liste des médecins avec filtres optionnels
 * @param {object} filters — { nom, specialite, ville, note_min, ... }
 * Exemple : getDoctors({ specialite: "Cardiologie", ville: "Alger" })
 */
export async function getDoctors(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return apiFetch(`/doctors/list/${params ? "?" + params : ""}`);
}

/**
 * Détails complets d'un médecin
 * @param {number} doctorId
 */
export async function getDoctorById(doctorId) {
  return apiFetch(`/doctors/${doctorId}/`);
}

/**
 * Créneaux disponibles d'un médecin
 * BUG-02 fix : URL corrigée de /doctors/{id}/slots/ → /doctors/{id}/availability/
 * @param {number} doctorId
 * @param {string} date — format "YYYY-MM-DD" (optionnel)
 * Retourne : { doctor_id, date, slots: [{ start_time, end_time }] }
 */
export async function getDoctorSlots(doctorId, date = null) {
  const query = date ? `?date=${date}` : "";
  return apiFetch(`/doctors/${doctorId}/availability/${query}`);
}

/**
 * Avis publics d'un médecin
 * @param {number} doctorId
 */
export async function getDoctorReviews(doctorId) {
  return apiFetch(`/doctors/${doctorId}/reviews/`);
}

// ─── Médecin : gestion de son propre profil ───────────────────────────────────

/**
 * (Médecin) Récupère son profil professionnel
 */
export async function getDoctorProfile() {
  return apiFetch("/doctors/profile/");
}

/**
 * (Médecin) Met à jour son profil professionnel
 * @param {object} data — { specialite, experience, tarif, ... }
 */
export async function updateDoctorProfile(data) {
  return apiFetch("/doctors/profile/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * (Médecin) Liste son planning hebdomadaire
 * BUG-03 fix : URL corrigée de /doctors/slots/ → /doctors/my-schedule/
 * Champs backend : { day_of_week, start_time, end_time, slot_duration, is_active }
 */
export async function getMySlots() {
  return apiFetch("/doctors/my-schedule/");
}

/**
 * (Médecin) Crée une plage horaire hebdomadaire
 * BUG-03 fix : URL corrigée de /doctors/slots/ → /doctors/my-schedule/
 * @param {object} slotData — { day_of_week, start_time, end_time, slot_duration, is_active }
 */
export async function createSlot(slotData) {
  return apiFetch("/doctors/my-schedule/", {
    method: "POST",
    body: JSON.stringify(slotData),
  });
}

/**
 * (Médecin) Supprime une plage horaire
 * BUG-03 fix : URL corrigée de /doctors/slots/{id}/ → /doctors/my-schedule/{id}/
 * @param {number} slotId
 */
export async function deleteSlot(slotId) {
  return apiFetch(`/doctors/my-schedule/${slotId}/`, {
    method: "DELETE",
  });
}

/**
 * (Médecin) Modifie une plage horaire
 * BUG-03 fix : URL corrigée de /doctors/slots/{id}/ → /doctors/my-schedule/{id}/
 * @param {number} slotId
 * @param {object} data
 */
export async function updateSlot(slotId, data) {
  return apiFetch(`/doctors/my-schedule/${slotId}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATIENTS & DOSSIER MÉDICAL  →  /api/patients/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Récupère le profil personnel du patient (adresse, contacts)
 */
export async function getPatientProfile() {
  return apiFetch("/patients/profile/");
}

/**
 * Met à jour le profil personnel du patient
 * @param {object} data
 */
export async function updatePatientProfile(data) {
  return apiFetch("/patients/profile/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Récupère le profil médical du patient (groupe sanguin, allergies, etc.)
 */
export async function getMedicalProfile() {
  return apiFetch("/patients/medical-profile/");
}

/**
 * Met à jour le profil médical du patient
 * @param {object} data — { blood_type, allergies, ... }
 */
export async function updateMedicalProfile(data) {
  return apiFetch("/patients/medical-profile/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Historique des antécédents médicaux
 */
export async function getAntecedents() {
  return apiFetch("/patients/antecedents/");
}

/**
 * Traitements en cours
 */
export async function getTreatments() {
  return apiFetch("/patients/treatments/");
}

/**
 * Résultats d'examens et analyses
 */
export async function getLabResults() {
  return apiFetch("/patients/lab-results/");
}

/**
 * Historique des analyses de symptômes IA
 */
export async function getSymptomHistory() {
  return apiFetch("/patients/symptom-analysis/");
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RENDEZ-VOUS  →  /api/appointments/  et  /api/doctor/
// ─────────────────────────────────────────────────────────────────────────────

// ─── Côté Patient ─────────────────────────────────────────────────────────────

/**
 * Liste les rendez-vous du patient connecté
 */
export async function getMyAppointments() {
  return apiFetch("/appointments/");
}

/**
 * Prendre un nouveau rendez-vous
 * BUG-14/21 fix : le backend attend { doctor_id, date, start_time, end_time, motif }
 * et non { doctor_id, slot_id, motif }.
 * @param {object} data — { doctor_id, date, start_time, end_time, motif }
 */
export async function bookAppointment(data) {
  return apiFetch("/appointments/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Détails d'un rendez-vous spécifique
 * @param {number} appointmentId
 */
export async function getAppointmentById(appointmentId) {
  return apiFetch(`/appointments/${appointmentId}/`);
}

/**
 * Annuler un rendez-vous
 * @param {number} appointmentId
 */
export async function cancelAppointment(appointmentId) {
  return apiFetch(`/appointments/${appointmentId}/cancel/`, {
    method: "POST",
  });
}

/**
 * Reprogrammer un rendez-vous
 * @param {number} appointmentId
 * @param {object} data — { new_slot_id, ... }
 */
export async function rescheduleAppointment(appointmentId, data) {
  return apiFetch(`/appointments/${appointmentId}/reschedule/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Laisser un avis sur une consultation terminée
 * BUG-15 fix : les champs backend sont { rating, comment } et non { note, commentaire }.
 * @param {number} appointmentId
 * @param {object} data — { rating (1-5), comment }
 */
export async function leaveReview(appointmentId, data) {
  return apiFetch(`/appointments/${appointmentId}/review/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Côté Médecin ──────────────────────────────────────────────────────────────

/**
 * (Médecin) Planning du jour
 * BUG-04 fix : URL corrigée — le backend expose /doctor/schedule/ (sans /today/).
 * Filtrer par date du jour est le comportement par défaut du backend.
 */
export async function getTodaySchedule() {
  return apiFetch("/doctor/schedule/");
}

/**
 * (Médecin) Demandes en attente de validation
 */
export async function getPendingAppointments() {
  return apiFetch("/doctor/appointments/pending/");
}

/**
 * (Médecin) Historique complet de ses rendez-vous
 */
export async function getDoctorAppointments() {
  return apiFetch("/doctor/appointments/");
}

/**
 * (Médecin) Confirmer une demande
 * @param {number} appointmentId
 */
export async function confirmAppointment(appointmentId) {
  return apiFetch(`/doctor/appointments/${appointmentId}/confirm/`, {
    method: "POST",
  });
}

/**
 * (Médecin) Refuser une demande
 * @param {number} appointmentId
 */
export async function refuseAppointment(appointmentId) {
  return apiFetch(`/doctor/appointments/${appointmentId}/refuse/`, {
    method: "POST",
  });
}

/**
 * (Médecin) Marquer comme terminé
 * @param {number} appointmentId
 */
export async function completeAppointment(appointmentId) {
  return apiFetch(`/doctor/appointments/${appointmentId}/complete/`, {
    method: "POST",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NOTIFICATIONS  →  /api/notifications/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Récupère toutes les notifications de l'utilisateur
 */
export async function getNotifications() {
  return apiFetch("/notifications/");
}

/**
 * Marque une notification comme lue
 * @param {number} notificationId
 */
export async function markNotificationRead(notificationId) {
  return apiFetch(`/notifications/${notificationId}/read/`, {
    method: "POST",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PHARMACIE  →  /api/pharmacy/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Liste des pharmacies partenaires
 */
export async function getPharmacies() {
  return apiFetch("/pharmacy/list/");
}

/**
 * Liste des succursales / points de vente
 */
export async function getPharmacyBranches() {
  return apiFetch("/pharmacy/branches/");
}

// IMP-02 : getCaretakerServices supprimée car non utilisée.

// ─────────────────────────────────────────────────────────────────────────────
// UTILITAIRES EXPORTÉS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vérifie si l'utilisateur est connecté (token présent)
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Change le mot de passe de l'utilisateur connecté
 * @param {object} data — { old_password, new_password }
 */
export async function changePassword(data) {
  return apiFetch("/auth/password/change/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * (Admin) Liste des médecins/pros en attente de validation
 * BUG-09 fix : /admin/doctors/pending/ n'existe pas.
 * On filtre /admin/users/ par role=doctor et verification_status=pending.
 */
export async function getPendingDoctors() {
  return apiFetch("/admin/users/?role=doctor&verification_status=pending");
}

/**
 * (Admin) Liste de tous les utilisateurs
 */
export async function getUsers() {
  return apiFetch("/admin/users/");
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. DOSSIER PATIENT (vue médecin)  →  /api/doctor/patients/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * (Médecin) Récupère le dossier médical complet d'un patient
 * @param {number} patientId
 * Returns: { profile, medical_profile, history, lab_results, prescriptions }
 */
export async function getPatientRecord(patientId) {
  return apiFetch(`/doctor/patients/${patientId}/record/`);
}

/**
 * (Médecin) Ajoute une ordonnance dans le dossier d'un patient
 * @param {object} data — { patient_id, medication, dosage, frequency, duration, ... }
 */
export async function addPrescription(data) {
  return apiFetch("/consultations/prescriptions/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CONSULTATION SESSION  →  /api/appointments/ + /api/consultations/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * (Médecin) Démarre une consultation — verrouille le créneau (status → in_progress)
 * @param {number} appointmentId
 * Returns: updated Appointment object
 */
export async function startConsultation(appointmentId) {
  return apiFetch(`/appointments/${appointmentId}/start/`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

/**
 * (Médecin) Complète une session de consultation en créant la consultation + l'ordonnance
 * @param {object} payload — voir shape dans la doc
 * Returns: Consultation object with prescription_token + prescription_qr_url
 */
export async function completeSession(payload) {
  return apiFetch("/consultations/complete-session/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Recherche de médicaments par nom
 * @param {string} query — terme de recherche (min 2 chars)
 * Returns: array of { id, name, dosage_form, strength }
 */
export async function searchMedications(query) {
  return apiFetch(`/medications/?search=${encodeURIComponent(query)}`);
}

/**
 * Exporte clearTokens pour que AuthContext puisse l'utiliser
 */
export { clearTokens };