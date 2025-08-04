import React from "react";

const Hero = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center max-w-4xl">
        <h1 className="mt-20 text-6xl text-center font-medium">
          No ads, no bloat,{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            just image editing that works.
          </span>
        </h1>
        <p className="text-lg text-center max-w-2xl my-5 text-neutral-600">
          Fast, simple, and no BS. Remove backgrounds, convert between formats,
          and compress your images — all without the annoying ads.
        </p>
        <div className="flex gap-5">
          <button className="bg-blue-400 rounded-md text-white py-2 px-5">
            Button
          </button>
          <button className="border-2 border-violet-400 rounded-md text-black py-2 px-5">
            Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
