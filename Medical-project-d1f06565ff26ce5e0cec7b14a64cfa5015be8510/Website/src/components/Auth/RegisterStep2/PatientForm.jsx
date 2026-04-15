import PersonalInfoForm from "./PersonalInfoForm";

const PATIENT_STEP_INDICATOR = (
  <div className="flex flex-col items-center mb-10">
    <div className="flex items-center w-full max-w-[480px] justify-between relative px-2">
      <div className="absolute left-[30px] right-[50%] h-px bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
      <div className="absolute left-[50%] right-[30px] h-px bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
      <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-sm z-10 shadow-sm relative">1</div>
      <div className="w-[32px] h-[32px] rounded-full bg-white border border-[#D1DFEC] text-[#89AEDB] flex items-center justify-center font-bold text-sm z-10 relative">2</div>
      <div className="w-[32px] h-[32px] rounded-full bg-white border border-[#D1DFEC] text-[#89AEDB] flex items-center justify-center font-bold text-sm z-10 relative">3</div>
    </div>
  </div>
);

const PATIENT_DEV_DATA = {
  birthDate: "1990-05-15",
  sex: "Masculin",
  phone: "0555000000",
  idCardNumber: "10344567890",
  address: "12 Rue Didouche Mourad",
  postalCode: "16000",
  city: "Alger-Centre",
  wilaya: "Alger",
};

export default function PatientForm({ onComplete, onBack }) {
  return (
    <PersonalInfoForm
      onComplete={onComplete}
      onBack={onBack}
      stepIndicator={PATIENT_STEP_INDICATOR}
      devFillData={PATIENT_DEV_DATA}
    />
  );
}
