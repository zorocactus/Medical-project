# MedSmart — Frontend

## Section 1 — STACK & OVERVIEW

**MedSmart** is a medical platform (Algerian context) built as a pure state-driven SPA.

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite, **no React Router** — navigation is pure `useState`) |
| Styling | Tailwind CSS (utility classes only; custom CSS only in background components) |
| HTTP | Native `fetch` via a central `apiFetch` helper in `services/api.js` |
| Auth | JWT stored in `localStorage` (`access_token` + `refresh_token`) |
| State | React Context (`AuthContext` + `DataContext` + `ThemeContext`) |
| Icons | `lucide-react` |
| Extras | `date-fns`, `gsap`, `three` / `@react-three/fiber`, `ogl` (backgrounds) |

The React app lives at `Website/` inside the git repo root.

---

## Section 2 — PROJECT STRUCTURE

```
Website/src/
├── App.jsx                          — root component, delegates to AppRouter
├── main.jsx                         — Vite entry point
│
├── router/
│   └── AppRouter.jsx                — role-based routing via useState; contains RoleRouter + PendingApprovalPage
│
├── services/
│   └── api.js                       — ALL API calls, base URL, auth headers, auto-refresh logic
│
├── context/
│   ├── AuthContext.jsx              — login/logout, getMe(), userData, isLoggedIn, isApproved
│   ├── DataContext.jsx              — appointments, patientRequests, prescriptions, gmPatients, gmTreatments, globalNotifications
│   └── ThemeContext.jsx             — theme (light/dark), toggleTheme(), persisted in localStorage
│
├── components/
│   ├── ErrorBoundary.jsx            — generic React error boundary used in all dashboard shells
│   ├── Auth/
│   │   ├── AuthTransition.jsx       — animated CSS panel switcher (login ↔ register), manages multi-step registration state machine
│   │   ├── Login.jsx                — login form (email + password), calls AuthContext.login()
│   │   ├── Register.jsx             — registration step 1 (account type selection + credentials)
│   │   └── RegisterStep2/
│   │       ├── PatientForm.jsx          — patient step 2: personal details
│   │       ├── PatientIdentityForm.jsx  — patient step 3: identity / address
│   │       ├── PatientSuccess.jsx       — patient step 4: success + auto-login
│   │       ├── MedicalForm.jsx          — medical staff step 2: personal details
│   │       ├── MedicalIdentityForm.jsx  — medical staff step 3: identity
│   │       ├── MedicalRoleForm.jsx      — medical staff step 4: role selection (Médecin / Pharmacien / Garde-malade)
│   │       ├── MedicalInfoForm.jsx      — medical staff step 5: professional info (specialty, experience)
│   │       ├── PersonalInfoForm.jsx     — shared personal info sub-form
│   │       └── MedicalSuccess.jsx       — medical staff step 6: success + auto-login (account flagged pending)
│   │
│   ├── backgrounds/
│   │   ├── MedParticles.jsx         — `ParticlesHero` component used in all dashboard shells
│   │   ├── Aurora.jsx / Aurora.css
│   │   ├── Particles.jsx / Particles.css
│   │   ├── Waves.jsx / Waves.css
│   │   ├── DotGrid.jsx / DotGrid.css
│   │   ├── Threads.jsx / Threads.css
│   │   └── Silk.jsx
│   │
│   ├── medical/
│   │   └── WeekCalendar.jsx         — weekly calendar component used in DoctorDashboard schedule view
│   │
│   └── Landing/
│       ├── Navbar.jsx
│       ├── Hero.jsx
│       ├── Features.jsx
│       ├── AIFeatures.jsx
│       ├── Doctors.jsx
│       ├── Booking.jsx
│       └── Ordonnances.jsx
│
└── pages/
    ├── LandingPage.jsx              — public landing page (composed of Landing/ components)
    ├── BackgroundTest.jsx           — dev-only background test page (accessible via #/test-bg hash)
    ├── patient/
    │   └── Dashboard.jsx            — patient dashboard (7 sub-views)
    ├── medical/
    │   └── DoctorDashboard.jsx      — doctor dashboard (6 sub-views + consultation session)
    ├── pharmacist/
    │   └── PharmacistDashboard.jsx  — pharmacist dashboard (4 NAV items + parametres)
    ├── caretaker/
    │   └── CaretakerDashboard.jsx   — caretaker dashboard (5 NAV items)
    └── admin/
        └── Admindashboard.jsx       — admin dashboard (4 NAV items + parametres)
```

---

## Section 3 — AUTH FLOW

```
LandingPage (onLogin / onRegister buttons)
  └──> AppRouter sets authMode = "login" | "register"
         └──> AuthTransition (animated CSS panel, NO router)
                │
                ├── Login panel
                │     └── Login.jsx
                │           └── AuthContext.login(email, password)
                │                 └── api.login() → api.getMe()
                │                       └── normalizeRole(me.role) → accountType
                │                             └── RoleRouter renders correct dashboard
                │
                └── Register panel (multi-step state machine in AuthTransition)
                      Step 1 — Register.jsx         (account type + credentials)
                      Step 2 — PatientForm          (patient) | MedicalForm (medical)
                      Step 3 — PatientIdentityForm  (patient) | MedicalIdentityForm (medical)
                      Step 4 — PatientSuccess →     api.registerPatient() → auto-login
                               MedicalRoleForm      (medical)
                      Step 5 — MedicalInfoForm      (medical)
                      Step 6 — MedicalSuccess →     api.registerDoctor() → auto-login → PendingApprovalPage
```

**RoleRouter** (in `router/AppRouter.jsx`) maps roles → dashboards:

| `accountType` (normalised) | `userData.role` | Dashboard |
|---|---|---|
| `"patient"` | `patient` | `PatientDashboard` |
| `"personnel médical"` + `isApproved` | `doctor` / `médecin` | `DoctorDashboard` |
| `"personnel médical"` + `isApproved` | `pharmacist` / `pharmacien` | `PharmacistDashboard` |
| `"personnel médical"` + `isApproved` | `caretaker` / `garde-malade` | `CaretakerDashboard` |
| `"personnel médical"` + `!isApproved` | any | `PendingApprovalPage` |
| `"admin"` | `admin` | `AdminDashboard` |

**Note:** `FORCE_TEST = true` is currently active in `AppRouter.jsx`, rendering a floating dev menu that bypasses auth and lets you switch dashboards directly. Disable before production by setting `FORCE_TEST = false`.

**Role normalisation** (`AuthContext.normalizeRole`):
- `patient` → `"patient"`
- `doctor`, `pharmacist`, `caretaker` → `"personnel médical"`
- `admin` → `"admin"`

---

## Section 4 — ALL API ENDPOINTS

**Base URL:** `http://127.0.0.1:8000/api` (hardcoded in `services/api.js`)

All calls go through `apiFetch()` which:
- Injects `Authorization: Bearer <access_token>`
- On 401 → automatically calls `refreshAccessToken()`, retries once
- On refresh failure → `clearTokens()` + `window.location.href = "/?expired=1"`

### AUTH — `/api/auth/`
| Method | Path | Function |
|---|---|---|
| POST | `/auth/token/` | `login(email, password)` |
| POST | `/auth/token/refresh/` | `refreshAccessToken()` |
| GET | `/auth/me/` | `getMe()` |
| PATCH | `/auth/me/` | `updateMe(data)` |
| POST | `/auth/register/patient/` | `registerPatient(userData)` |
| POST | `/auth/register/doctor/` | `registerDoctor(userData)` |
| POST | `/auth/password/change/` | `changePassword(data)` |

### DOCTORS — `/api/doctors/`
| Method | Path | Function |
|---|---|---|
| GET | `/doctors/list/` | `getDoctors(filters)` |
| GET | `/doctors/{id}/` | `getDoctorById(doctorId)` |
| GET | `/doctors/{id}/slots/` | `getDoctorSlots(doctorId, date)` |
| GET | `/doctors/{id}/reviews/` | `getDoctorReviews(doctorId)` |
| GET | `/doctors/profile/` | `getDoctorProfile()` |
| PUT | `/doctors/profile/` | `updateDoctorProfile(data)` |
| GET | `/doctors/slots/` | `getMySlots()` |
| POST | `/doctors/slots/` | `createSlot(slotData)` |
| PUT | `/doctors/slots/{id}/` | `updateSlot(slotId, data)` |
| DELETE | `/doctors/slots/{id}/` | `deleteSlot(slotId)` |

### PATIENTS — `/api/patients/`
| Method | Path | Function |
|---|---|---|
| GET/PUT | `/patients/profile/` | `getPatientProfile()` / `updatePatientProfile(data)` |
| GET/PUT | `/patients/medical-profile/` | `getMedicalProfile()` / `updateMedicalProfile(data)` |
| GET | `/patients/antecedents/` | `getAntecedents()` |
| GET | `/patients/treatments/` | `getTreatments()` |
| GET | `/patients/lab-results/` | `getLabResults()` |
| GET | `/patients/symptom-analysis/` | `getSymptomHistory()` |

### APPOINTMENTS — patient side — `/api/appointments/`
| Method | Path | Function |
|---|---|---|
| GET | `/appointments/` | `getMyAppointments()` |
| POST | `/appointments/` | `bookAppointment(data)` |
| GET | `/appointments/{id}/` | `getAppointmentById(appointmentId)` |
| POST | `/appointments/{id}/cancel/` | `cancelAppointment(appointmentId)` |
| POST | `/appointments/{id}/reschedule/` | `rescheduleAppointment(appointmentId, data)` |
| POST | `/appointments/{id}/review/` | `leaveReview(appointmentId, data)` |

### APPOINTMENTS — doctor side — `/api/doctor/`
| Method | Path | Function |
|---|---|---|
| GET | `/doctor/schedule/today/` | `getTodaySchedule()` |
| GET | `/doctor/appointments/pending/` | `getPendingAppointments()` |
| GET | `/doctor/appointments/` | `getDoctorAppointments()` |
| POST | `/doctor/appointments/{id}/confirm/` | `confirmAppointment(appointmentId)` |
| POST | `/doctor/appointments/{id}/refuse/` | `refuseAppointment(appointmentId)` |
| POST | `/doctor/appointments/{id}/complete/` | `completeAppointment(appointmentId)` |

### CONSULTATION SESSION
| Method | Path | Function |
|---|---|---|
| PATCH | `/appointments/{id}/start/` | `startConsultation(appointmentId)` |
| POST | `/consultations/complete-session/` | `completeSession(payload)` |
| POST | `/consultations/prescriptions/` | `addPrescription(data)` |
| GET | `/doctor/patients/{id}/record/` | `getPatientRecord(patientId)` |

### MEDICATIONS
| Method | Path | Function |
|---|---|---|
| GET | `/medications/?search={query}` | `searchMedications(query)` |

### NOTIFICATIONS — `/api/notifications/`
| Method | Path | Function |
|---|---|---|
| GET | `/notifications/` | `getNotifications()` |
| POST | `/notifications/{id}/read/` | `markNotificationRead(notificationId)` |

### PHARMACY — `/api/pharmacy/`
| Method | Path | Function |
|---|---|---|
| GET | `/pharmacy/list/` | `getPharmacies()` |
| GET | `/pharmacy/branches/` | `getPharmacyBranches()` |

### CARETAKER — `/api/caretaker/`
| Method | Path | Function |
|---|---|---|
| GET | `/caretaker/list/` | `getCaretakers()` |
| GET | `/caretaker/services/` | `getCaretakerServices()` |

### ADMIN
| Method | Path | Function |
|---|---|---|
| GET | `/admin/doctors/pending/` | `getPendingDoctors()` |
| GET | `/admin/users/` | `getUsers()` |

---

## Section 5 — ROLE → DASHBOARD MAPPING

| Backend role string | Dashboard component | NAV sub-views |
|---|---|---|
| `patient` | `PatientDashboard` | `dashboard`, `medical-profile`, `ai-diagnosis`, `appointments`, `prescriptions`, `pharmacy`, `care-taker` |
| `doctor` | `DoctorDashboard` | `dashboard`, `schedule`, `patients`, `prescriptions`, `statistics` + `consultation-session` (not in NAV, triggered from schedule) |
| `pharmacist` | `PharmacistDashboard` | `accueil`, `commandes`, `stock`, `statistiques` + `parametres` (accessible via settings button, not in NAV) |
| `caretaker` | `CaretakerDashboard` | `dashboard`, `jobRequests`, `myPatients`, `treatments`, `ai-diagnosis` |
| `admin` | `AdminDashboard` | `overview`, `validation`, `utilisateurs`, `audit` + `parametres` (accessible via settings button, not in NAV) |

---

## Section 6 — THEME SYSTEM

Every dashboard file declares the same `T` token object and derives a `c` from dark-mode state:

```js
const T = {
  light: {
    bg:        "#F0F4F8",
    card:      "#ffffff",
    nav:       "#ffffff",
    border:    "#E4EAF5",
    txt:       "#0D1B2E",
    txt2:      "#5A6E8A",
    txt3:      "#9AACBE",
    blue:      "#4A6FA5",
    blueLight: "#EEF3FB",
    green:     "#2D8C6F",
    amber:     "#E8A838",
    red:       "#E05555",
    purple:    "#7B5EA7",   // (not present in PatientDashboard)
  },
  dark: {
    bg:        "#0D1117",
    card:      "#141B27",
    nav:       "#141B27",
    border:    "rgba(99,142,203,0.15)",
    txt:       "#F0F3FA",
    txt2:      "#8AAEE0",
    txt3:      "#4A6080",
    blue:      "#638ECB",
    blueLight: "#1A2333",
    green:     "#4CAF82",
    amber:     "#F0A500",
    red:       "#E05555",
    purple:    "#9B7FD4",   // (not present in PatientDashboard)
  },
};

// Usage in every dashboard:
const [dk, setDk] = useState(false); // or reads useTheme()
const c = dk ? T.dark : T.light;

// Applied inline:
style={{ color: c.txt, background: c.card, borderColor: c.border }}
```

**AdminDashboard** has additional dark tokens: `sidebar: "#0A1220"`, `bg: "#080D14"`, `card: "#0F1824"` and extra semantic tokens (`greenLight`, `amberLight`, `redLight`, `purpleLight`).

**ThemeContext** (`context/ThemeContext.jsx`) persists the chosen theme in `localStorage` under the key `"theme"`. Individual dashboards currently manage their own `dk` boolean state — usage of `useTheme()` vs local state varies per file.

---

## Section 7 — CODE CONVENTIONS

- **NO React Router** — navigation is `const [currentPage, setCurrentPage] = useState("dashboard")` in each dashboard shell. Pass `setCurrentPage` (or `onNav`, `onChangePage`) as a prop to sub-views.
- **NO axios** — use `apiFetch()` in `services/api.js`. Never call `fetch()` directly in a component.
- **NO hardcoded hex colors** — always use `c.blue`, `c.txt`, `c.card`, etc. The `T` object is the single source of truth.
- **NO native `<select>` elements** — use button-group patterns (see DoctorDashboard frequency selector) or custom dropdowns.
- **NO inline component definitions inside render** — define sub-view components at module level (top of file).
- Numeric inputs must strip non-digits: `value.replace(/\D/g, "")`.
- All API calls go through `services/api.js`. No direct `fetch()` in components.
- Dark mode: every component receives `dk` (boolean) and `c` (theme object) as props, or reads `useTheme()` directly. Be consistent within a file.
- Loading states: spinner inside the button + `disabled`, never full-page block unless the operation takes multiple seconds (e.g., consultation AI generation).
- Registration role mapping (AuthTransition): `"Médecin"` → `"doctor"`, `"Pharmacien"` → `"pharmacist"`, `"Garde-malade"` → `"caretaker"`.

---

## Section 8 — CURRENT STATUS

### ✅ DONE

- JWT auth flow: login, register (patient + medical), `getMe()`, `refreshAccessToken()` auto-retry, role routing
- `AuthTransition` multi-step registration state machine (6 steps for medical, 4 for patient)
- `PendingApprovalPage` for unapproved medical staff
- `PatientDashboard`: 7 sub-views (`dashboard`, `medical-profile`, `ai-diagnosis`, `appointments`, `prescriptions`, `pharmacy`, `care-taker`)
- `DoctorDashboard`: 5 NAV views + `consultation-session` view (`PatientConsultationView` with `startConsultation` + `completeSession`)
- `PharmacistDashboard`: `accueil`, `commandes`, `stock`, `statistiques`, `parametres`
- `CaretakerDashboard`: `dashboard`, `jobRequests`, `myPatients`, `treatments`, `ai-diagnosis`
- `AdminDashboard`: `overview`, `validation`, `utilisateurs`, `audit`, `parametres`
- `ErrorBoundary` used in all dashboard shells
- `WeekCalendar` component in DoctorDashboard schedule view
- `DataContext`: doctor appointments and pending requests loaded from API on mount
- `ThemeContext`: dark/light, persisted in localStorage

### ⚠️ TODO / KNOWN ISSUES

- **`FORCE_TEST = true` is active in `AppRouter.jsx` (line 156)** — floating dev menu bypasses real auth. MUST be set to `false` before production deployment.
- `DataContext.loadGMDemoData()` uses hardcoded demo patients/treatments — no real caretaker API calls wired yet.
- Several dashboards use static/mock data arrays defined at module level (e.g., `PharmacistDashboard` `STOCK`, `ORDERS`, `ALERTS`; `AdminDashboard` `USERS_DATA`, `AUDIT_LOGS`) — not fetched from backend.
- `searchMedications`, `getPatientRecord`, `addPrescription`, `getPendingDoctors`, `getUsers`, `changePassword` are defined in `api.js` but have no corresponding backend endpoints yet (see Section 4 discrepancy note).
- `PatientDashboard` theme object does not include `purple` token (inconsistency with other dashboards).
- `ThemeContext` exists but dashboard files manage `dk` state independently — `useTheme()` is not consistently consumed.
- No `.env` / `.env.example` file found — `BASE_URL` is hardcoded as `http://127.0.0.1:8000/api`.

---

## Section 9 — EXAMPLE API CALL PATTERN

```js
// Every API function in services/api.js uses this pattern:
async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken(); // localStorage.getItem("access_token")
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Auto-refresh on 401
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getToken()}`;
      const retryResponse = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
      if (!retryResponse.ok) throw new Error(`Erreur ${retryResponse.status}`);
      return retryResponse.json();
    } else {
      clearTokens();
      window.location.href = "/?expired=1";
      return;
    }
  }

  if (!response.ok) {
    let errorMsg = `Erreur ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch (_) {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) return null; // DELETE / no-content
  return response.json();
}
```
