import { useState } from "react";
import { Phone, User, Upload, Home, Calendar, ChevronDown } from "lucide-react";

export default function PatientForm({ onComplete }) {
  const [formData, setFormData] = useState({
    birthDate: "",
    sex: "Male",
    phone: "",
    idCardNumber: "",
    idCardPhoto: null,
    address: "",
    postalCode: "",
    city: "",
    wilaya: "Algiers",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, idCardPhoto: e.target.files[0] }));
  };

  return (
    <div className="min-h-screen bg-[#D1DFEC] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl px-12 py-10 relative">
        <h2 className="text-[32px] font-bold text-[#333333] text-center mb-10">
          Complete your profile
        </h2>

        {/* Personal Information */}
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-px bg-[#365885]/40"></div>
            <div className="mx-4 text-[#365885] text-[22px] font-medium tracking-wide">
              Personal Information
            </div>
            <div className="flex-1 h-px bg-[#365885]/40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 pl-6 pr-2">
           
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                Birth Date
              </span>
              <div className="relative">
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full pl-5 pr-12 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] focus:border-[#365885] focus:ring-0 outline-none text-gray-700 text-base transition-colors"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#365885] pointer-events-none">
                  <Calendar size={20} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                Sex
              </span>
              <div className="relative">
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full pl-5 pr-12 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] focus:border-[#365885] focus:ring-0 outline-none text-gray-700 text-base appearance-none transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#365885] pointer-events-none">
                  <ChevronDown size={20} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                Phone Number
              </span>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-5 pr-12 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] focus:border-[#365885] focus:ring-0 outline-none text-gray-700 text-base transition-colors"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#365885] pointer-events-none">
                  <Phone size={20} strokeWidth={1.5} />
                </div>
              </div>
            </div>

           
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                ID Card Number
              </span>
              <div className="relative">
                <input
                  type="text"
                  name="idCardNumber"
                  value={formData.idCardNumber}
                  onChange={handleChange}
                  className="w-full pl-5 pr-12 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] focus:border-[#365885] focus:ring-0 outline-none text-gray-700 text-base transition-colors"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#365885] pointer-events-none">
                  <User size={20} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="relative group md:col-start-2">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                ID Card Photo
              </span>
              <div className="relative h-full">
                <input
                  type="file"
                  id="idCardPhoto"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="idCardPhoto"
                  className="flex items-center justify-between w-full pl-5 pr-4 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] cursor-pointer text-[#849AB4] text-sm transition-colors"
                >
                  <span className="truncate mr-4">
                    {formData.idCardPhoto ? formData.idCardPhoto.name : "Upload your ID Card photo"}
                  </span>
                  <div className="text-[#365885]">
                    <Upload size={20} strokeWidth={1.5} />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center mb-8">
            <div className="w-12 h-px bg-[#365885]/40"></div>
            <div className="mx-4 text-[#365885] text-[22px] font-medium tracking-wide">
              Residential Address
            </div>
            <div className="flex-1 h-px bg-[#365885]/40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 pl-6 pr-2 mb-8">
            {/* Address */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                Address
              </span>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-5 pr-12 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] focus:border-[#365885] focus:ring-0 outline-none text-gray-700 text-base transition-colors"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#365885] pointer-events-none">
                  <Home size={20} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                Postal Code
              </span>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-5 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] focus:border-[#365885] focus:ring-0 outline-none text-gray-700 text-base transition-colors"
              />
            </div>

           
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                City
              </span>
              <input
                type="text"
                name="city"
                placeholder="Rouiba"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-5 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] focus:border-[#365885] focus:ring-0 outline-none text-gray-700 text-base text-center transition-colors placeholder:text-gray-400 placeholder:text-sm"
              />
            </div>

            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-sm font-medium text-[#365885] z-10">
                Wilaya
              </span>
              <div className="relative">
                <select
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-[#365885]/50 hover:border-[#365885] focus:border-[#365885] focus:ring-0 outline-none text-gray-700 text-base text-center appearance-none transition-colors"
                >
                  <option value="Algiers">Algiers</option>
                  <option value="Oran">Oran</option>
                  <option value="Constantine">Constantine</option>
                  
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#365885] pointer-events-none">
                  <ChevronDown size={20} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="w-full h-px bg-[#365885]/40 mt-4"></div>
        </div>

        {/* Finalize Registration Button */}
        <div className="flex justify-center -mt-2">
          <button
            onClick={() => onComplete(formData)}
            className="w-full max-w-[320px] bg-[#89AEDB] hover:bg-[#789ACA] text-white py-3.5 rounded-xl text-[17px] font-medium transition-all shadow-sm cursor-pointer"
          >
            Finalize registration
          </button>
        </div>
      </div>
    </div>
  );
}
