import { useState } from "react";

import { FaFemale, FaHeart } from "react-icons/fa";

import Button from "../common/Button";
import { navLinks } from "../../data/navLinks";
import DonationModal from "../home/DonationModal.jsx";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">

          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <FaFemale className="text-3xl text-pink-600" />

            <div>
              <h1 className="text-xl md:text-2xl font-extrabold">
                She Can
                <span className="text-pink-600"> Foundation</span>
              </h1>

              <p className="text-[11px] tracking-widest text-gray-500">
                EMPOWER · RISE · LEAD
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
  key={link.href}
  to={link.href}
  onClick={(e) => {
    if (link.href.startsWith("#")) {
      e.preventDefault();

      const el = document.querySelector(link.href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }

      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  }}
>
  {link.label}
</Link>
            ))}

            <Button onClick={() => setIsDonationModalOpen(true)}>
              Donate <FaHeart className="ml-2" />
            </Button>
          </div>

          <div
            className="md:hidden flex flex-col gap-1 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
          </div>

          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center gap-6 py-6 md:hidden">

              {navLinks.map((link) => (
                <Link
  key={link.href}
  to={link.href}
  onClick={(e) => {
    if (link.href.startsWith("#")) {
      e.preventDefault();

      const el = document.querySelector(link.href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }

      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  }}
>
  {link.label}
</Link>
              ))}

              <Button onClick={() => setIsDonationModalOpen(true)}>
                Donate <FaHeart className="ml-2" />
              </Button>

            </div>
          )}

        </div>
      </nav>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  );
};

export default Navbar;
