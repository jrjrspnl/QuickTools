import React from "react";
import logo from "../assets/QuickToolsLogo.png";
const NavBar = () => {
  return (
    <div className="py-2 bg-white shadow-md">
      <div className="flex justify-center mx-auto">
        <img src={logo} className="w-60" alt="Logo" />
      </div>
    </div>
  );
};

export default NavBar;
