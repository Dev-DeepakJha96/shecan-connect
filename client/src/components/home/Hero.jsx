import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaDonate,
  FaHandsHelping,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import Button from "../common/Button";
import hero from "../../assets/hero1.jpg"
import DonationModal from "./DonationModal.jsx";

const Hero = () => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="pt-28 min-h-screen flex items-center bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-semibold mb-6">
            <FaHeart className="mr-2" />
            SHE CAN. WE TOGETHER.
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#2c1e1a] mb-6">
            Together We Can{" "}
            <span className="bg-gradient-to-r from-pink-600 to-orange-400 bg-clip-text text-transparent">
              Change
            </span>
            <br />
            the World for Her
          </h1>

          <p className="text-lg text-gray-600 leading-8 mb-8">
            We don't ask for much, just help us with what you can —
            <strong> Be it Money, Skill or Your Time</strong>.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Button onClick={() => setIsDonationModalOpen(true)}>
              <FaDonate className="mr-2" />
              Donate Now
            </Button>
            
            <Button variant="secondary" onClick={() => navigate('/volunteer-form')}>
              <FaHandsHelping className="mr-2" />
              Volunteer
            </Button>

            <Button 
              variant="secondary" 
              onClick={() => navigate('/track-status')}
              className="inline-flex items-center gap-2 border-dashed border-2 border-orange-300 hover:border-orange-400"
            >
              Track Application <FaArrowRight className="text-sm" />
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4 italic">
            *Already applied? Click "Track Application" to check your status using your Tracking ID.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] lg:h-[600px]">
            <img
              src={hero}
              alt="Women"
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-5 left-5 right-5">
              <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center">
                <FaCheckCircle className="text-pink-600 mr-3" />
                <span>
                  12,000+ lives transformed
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <DonationModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
