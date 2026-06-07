import { FaQuoteLeft } from "react-icons/fa";

const Mission = () => {
  return (
    <section
      id="mission"
      className="py-20 bg-orange-50"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <FaQuoteLeft className="text-5xl text-pink-600 mx-auto mb-6" />

        <p className="text-lg md:text-xl text-gray-600 leading-9">
          She Can Foundation is dedicated to empowering women and creating a more equitable society. We provide support, resources, and training across the globe
        </p>
      </div>
    </section>
  );
};

export default Mission;