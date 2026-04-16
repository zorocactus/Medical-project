import PersonalInfoForm from "./PersonalInfoForm";

export const PATIENT_STEPS = [
  { label: "Profil" },
  { label: "Documents" },
  { label: "Confirmer" },
];

const DEV_DATA = {
  birthDate: "1990-05-15", sex: "Masculin", phone: "0555000000",
  idCardNumber: "10344567890", address: "12 Rue Didouche Mourad",
  postalCode: "16000", city: "Alger-Centre", wilaya: "Alger",
};

export default function PatientForm({ onComplete, onBack }) {
  return (
    <PersonalInfoForm
      onComplete={onComplete}
      onBack={onBack}
      steps={PATIENT_STEPS}
      currentStep={1}
      devFillData={DEV_DATA}
    />
  );
}
