import React from "react";
import { LuImagePlus } from "react-icons/lu";
const BgRemover = () => {
  return (
    <div className="flex flex-col justify-center mt-10 items-center gap-10 px-5 text-neutral-800">
      <h1 className="text-4xl max-w-2xl font-semibold text-center ">
        Upload an image to remove the background
      </h1>

      <div className="h-64 w-full lg:w-250 bg-neutral-50 rounded-lg shadow-xl">
        <div className="flex flex-col items-center text-center justify-center h-full gap-5">
          <button className="text-white cursor-pointer bg-violet-400 font-base py-2 px-5 flex items-center gap-2 rounded-full shadow-md shadow-violet-500 hover:bg-violet-500 transition-colors duration-300">
            <LuImagePlus size={20} />
            Upload Image
          </button>
          <p className="text-sm font-base">Or drop an image here</p>
        </div>
      </div>
    </div>
  );
};

export default BgRemover;
