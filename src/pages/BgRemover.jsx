import React, { useState } from "react";
import alden from "../assets/bg-remove-alden.png";
import { UploadImage } from "../components/Upload";

const BgRemover = () => {
  const [outputImage, setOutputImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const API_KEY = import.meta.env.VITE_REMOVEBG_API_KEY;

  const handleFilesAccepted = async (files) => {
    if (files.length === 0) return;

    const file = files[0];
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf(".");
    const nameWithoutExtension =
      lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
    setOriginalFileName(nameWithoutExtension);

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    try {
      setLoading(true);
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": API_KEY,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP ERROR! status: ${res.status}`);
      }

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setOutputImage(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputImage) return;
    const downloadFileName = originalFileName
      ? `${originalFileName}-quicktools.png`
      : "background-removed-quicktools.png";

    const link = document.createElement("a");
    link.href = outputImage;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center mt-5">
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          <p className="text-lg text-violet-500 font-medium">Processing...</p>
        </div>
      ) : !outputImage ? (
        <UploadImage
          heading="Upload an image to remove the background"
          image={alden}
          showPreview={false}
          onFilesAccepted={handleFilesAccepted}
        />
      ) : (
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-center text-violet-500">
            Background Removed!
          </h2>
          <img
            src={outputImage}
            className="w-96 border-2 border-violet-400 rounded-lg"
            alt="Remove Bg"
          />
          <div className="flex justify-between gap-3">
            <button
              onClick={() => {
                setOutputImage(null);
                setOriginalFileName("");
              }}
              className="cursor-pointer border-2 border-violet-400 py-2 px-5 flex items-center gap-2 rounded-full shadow-md hover:bg-violet-500 transition-colors duration-300 text-neutral-800 hover:text-white"
            >
              Try Again
            </button>
            <button
              onClick={handleDownload}
              className="text-white cursor-pointer bg-violet-400 py-2 px-5 flex items-center gap-2 rounded-full shadow-md hover:bg-violet-500 transition-colors duration-300"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BgRemover;
