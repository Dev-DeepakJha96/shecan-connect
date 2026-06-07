import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import Mission from "../components/home/Mission";
import Pillars from "../components/home/Pillars";
import Stats from "../components/home/Stats";
import Volunteer from "../components/home/Volunteer";
import Gallery from "../components/home/Gallery";

const Home = () => {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden">
        <Hero />
        <Mission />
        <Pillars />
        <Stats />
        <Volunteer />
        <Gallery />
      </main>

      <Footer />
    </>
  );
};

export default Home;