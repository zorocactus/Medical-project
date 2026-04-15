import PersonalInfoForm from "./PersonalInfoForm";

const MEDICAL_STEP_INDICATOR = (
  <div className="flex flex-col items-center mb-10">
    <div className="flex items-center w-full max-w-[600px] justify-between relative px-2">
      <div className="absolute left-[30px] right-[75%] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
      <div className="absolute left-[25%] right-[50%] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
      <div className="absolute left-[50%] right-[25%] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
      <div className="absolute left-[75%] right-[30px] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
      <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 shadow-sm relative">1</div>
      <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">2</div>
      <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">3</div>
      <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">4</div>
      <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">5</div>
    </div>
  </div>
);

const MEDICAL_DEV_DATA = {
  birthDate: "1985-03-20",
  sex: "Masculin",
  phone: "0555000001",
  idCardNumber: "10344567891",
  address: "24 Rue Ben M'hidi",
  postalCode: "16000",
  city: "Alger-Centre",
  wilaya: "Alger",
};

export default function MedicalForm({ onComplete, onBack }) {
  return (
    <PersonalInfoForm
      onComplete={onComplete}
      onBack={onBack}
      stepIndicator={MEDICAL_STEP_INDICATOR}
      devFillData={MEDICAL_DEV_DATA}
    />
  );
}
