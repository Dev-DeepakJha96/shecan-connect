import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaFemale,
} from "react-icons/fa";

import {
  MdEmail,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";

import { navLinks } from "../../data/navLinks";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2c1e1a] text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        <div>
          <div className="flex items-center mb-4">
            <FaFemale className="text-3xl mr-3" />

            <h3 className="text-2xl font-bold">
              She Can Foundation
            </h3>
          </div>

          <p className="text-gray-300 mb-5">
            Empower · Educate · Elevate
          </p>

          <div className="space-y-3 text-gray-300">
            <p className="flex items-center">
              <MdEmail className="mr-2" />
              hello@shecanfoundation.org
            </p>

            <p className="flex items-center">
              <MdPhone className="mr-2" />
              +1 (555) 789-EMPOWER
            </p>

            <p className="flex items-center">
              <MdLocationOn className="mr-2" />
              New York
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-5">
            Quick Links
          </h4>

          <div className="flex flex-col gap-3 text-gray-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
              >
                {link.label}
              </a>
            ))}
             <Link to="/admin/login" >admin</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-5">
            Follow Our Journey
          </h4>

          <div className="flex gap-5 text-2xl">
            <FaInstagram className="cursor-pointer hover:text-pink-400 transition" />

            <FaTwitter className="cursor-pointer hover:text-pink-400 transition" />

            <FaLinkedin className="cursor-pointer hover:text-pink-400 transition" />

            <FaFacebook className="cursor-pointer hover:text-pink-400 transition" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-400">
        © 2025 She Can Foundation — Together We Can Change
      </div>
    </footer>
  );
};

export default Footer;