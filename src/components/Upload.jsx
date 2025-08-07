import { LuImagePlus } from "react-icons/lu";
export const UploadImage = ({ heading, image }) => {
  return (
    <div className="flex justify-center lg:justify-around mt-10 lg:my-20 gap-10 px-5 text-neutral-800 items-center ">
      <img
        src={image}
        className="w-96 rounded-4xl -rotate-5 translate-y-10 hidden lg:flex shadow-lg transition hover:scale-105 duration-300"
        alt=""
      />
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl md:text-4xl max-w-2xl font-semibold text-center">
          {heading}
        </h1>
        <div className="h-64 w-full  bg-neutral-50 rounded-xl shadow-xl shadow-blue-300/60 border-2 border-neutral-300 border-dashed">
          <div className="flex flex-col items-center text-center justify-center h-full gap-5">
            <button className="text-white cursor-pointer bg-violet-400 font-base py-2 px-5 flex items-center gap-2 rounded-full shadow-md shadow-violet-500 hover:bg-violet-500 transition-colors duration-300">
              <LuImagePlus size={20} />
              Upload Image
            </button>
            <p className="text-sm font-base">Or drop an image here</p>
          </div>
        </div>
      </div>
    </div>
  );
};
