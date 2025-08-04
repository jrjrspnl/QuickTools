import React from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";

const App = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div>
        <NavBar />
        <Hero />
      </div>
    </div>
  );
};

export default App;
