import React from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import BgRemover from "./pages/BgRemover";
import FileConverter from "./pages/FileConverter";
import FileCompressor from "./pages/FileCompressor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <NavBar />
        <div className="flex flex-col max-w-7xl mx-auto gap-10">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Cards />
                </>
              }
            />

            <Route path="/bg-remover" element={<BgRemover />} />
            <Route path="/file-converter" element={<FileConverter />} />
            <Route path="/file-compressor" element={<FileCompressor />} />
          </Routes>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
