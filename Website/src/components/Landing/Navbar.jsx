import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "IA Médicale", href: "ai-feats" },
  { label: "Médecins", href: "doctors" },
  { label: "Rendez-vous", href: "booking" },
  { label: "Ordonnances", href: "ordonnances" },
  { label: "Fonctionnalités", href: "features" },
];

export default function Navbar({ onLogin, onRegister }) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => setStuck(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[60px] bg-white transition-all duration-200
        ${stuck ? "border-b border-[#E4EAF5] shadow-[0_2px_20px_rgba(57,88,134,0.07)]" : "border-b border-transparent"}`}
    >
      {/* Logo */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        className="flex items-center gap-2.5 font-bold text-[1.2rem] text-[#395886] no-underline"
      >
        <div className="w-8 h-8 bg-[#395886] rounded-[9px] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 0h2v14H6V0zM0 6h14v2H0V6z" fill="white" />
          </svg>
        </div>
        MedSmart
      </a>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="px-4 py-2 rounded-lg text-[.86rem] font-medium text-[#5A6E8A] hover:bg-[#EEF3FB] hover:text-[#395886] transition-all duration-200 cursor-pointer border-none bg-transparent"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onLogin}
          className="px-4 py-2 text-[.86rem] font-semibold text-[#395886] hover:bg-[#EEF3FB] rounded-lg transition-all duration-200 cursor-pointer border-none bg-transparent"
        >
          Connexion
        </button>
        <button
          onClick={onRegister}
          className="hidden sm:block px-4 py-2 text-[.86rem] font-semibold text-[#395886] border border-[#395886]/30 hover:bg-[#EEF3FB] rounded-lg transition-all duration-200 cursor-pointer bg-transparent"
        >
          Espace Pro
        </button>
        <button
          onClick={onRegister}
          className="px-5 py-2 text-[.86rem] font-semibold text-white bg-[#395886] hover:bg-[#2d4570] rounded-lg transition-all duration-200 cursor-pointer shadow-[0_2px_10px_rgba(57,88,134,0.3)] border-none"
        >
          Commencer
        </button>
      </div>
    </nav>
  );
}