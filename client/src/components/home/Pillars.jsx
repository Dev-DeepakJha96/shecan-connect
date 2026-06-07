import { motion } from "framer-motion";

import { FaArrowRight } from "react-icons/fa";

import { GiPayMoney, GiSkills } from "react-icons/gi";

import { TbClockFilled } from "react-icons/tb";

import SectionTitle from "../common/SectionTitle";

const pillars = [
  {
    icon: GiPayMoney,
    title: "Money",
    color: "text-green-500",
    desc: "Your donation funds education and healthcare.",
  },

  {
    icon: GiSkills,
    title: "Skill",
    color: "text-blue-500",
    desc: "Teach coding, leadership or financial literacy.",
  },

  {
    icon: TbClockFilled,
    title: "Your Time",
    color: "text-orange-500",
    desc: "Volunteer and mentor women globally.",
  },
];

const Pillars = () => {
  return (
    <section id="impact" className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        <SectionTitle
          title="Your contribution"
          highlight="changes lives"
          subtitle="✨ Help with what you can ✨"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition"
            >
              <pillar.icon
                className={`text-5xl mx-auto mb-5 ${pillar.color}`}
              />

              <h3 className="text-2xl font-bold mb-4">
                {pillar.title}
              </h3>

              <p className="text-gray-600 leading-7 mb-6">
                {pillar.desc}
              </p>

              <button className="text-pink-600 font-semibold inline-flex items-center">
                Learn More
                <FaArrowRight className="ml-2" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;