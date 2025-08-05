import React from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Cards from "./components/Cards";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <NavBar />
      <div className="flex flex-col max-w-7xl mx-auto gap-10">
        <Hero />
        <Cards />
        <Footer />
      </div>
    </div>
  );
};

export default App;
