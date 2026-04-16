import PersonalInfoForm from "./PersonalInfoForm";

export const MEDICAL_STEPS = [
  { label: "Profil" },
  { label: "Documents" },
  { label: "Rôle" },
  { label: "Activité" },
  { label: "Confirmer" },
];

const DEV_DATA = {
  birthDate: "1985-03-20", sex: "Masculin", phone: "0555000001",
  idCardNumber: "10344567891", address: "24 Rue Ben M'hidi",
  postalCode: "16000", city: "Alger-Centre", wilaya: "Alger",
};

export default function MedicalForm({ onComplete, onBack }) {
  return (
    <PersonalInfoForm
      onComplete={onComplete}
      onBack={onBack}
      steps={MEDICAL_STEPS}
      currentStep={1}
      devFillData={DEV_DATA}
    />
  );
}
