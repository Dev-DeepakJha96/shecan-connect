import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

const Volunteer = () => {
  const navigate = useNavigate();

  return (
    <section
      id="volunteer"
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">

        <div>
          <h2 className="text-4xl font-extrabold mb-5">
            Become a{" "}
            <span className="bg-gradient-to-r from-pink-600 to-orange-400 bg-clip-text text-transparent">
              Volunteer
            </span>
          </h2>

          <p className="text-gray-600 text-lg leading-8 mb-8">
            Join our movement of change-makers.
          </p>

          <div className="space-y-4">
            {[
              "Make real impact",
              "Learn new skills",
              "Join global community",
              "Get certified",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center"
              >
                <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />

                <span className="text-gray-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10 lg:p-12">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-3xl text-pink-600" />
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Make a Difference?
            </h3>

            <p className="text-gray-600 leading-8 mb-8">
              Our volunteers help transform lives through
              education, support, and community programs.
              Join us in creating meaningful change and
              becoming part of a passionate community
              dedicated to making an impact.
            </p>

            <Button
              onClick={() => navigate("/volunteer-form")}
              className="w-full rounded-xl py-4 justify-center"
            >
              Apply as Volunteer
              <FaArrowRight className="ml-2" />
            </Button>

            <p className="text-sm text-gray-500 mt-5">
              Application takes less than 5 minutes.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Volunteer;
