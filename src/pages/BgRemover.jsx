import React, { useState } from "react";
import alden from "../assets/bg-remove-alden.png";
import { UploadImage } from "../components/Upload";
import { Download, RotateCcw } from "lucide-react";

const BgRemover = () => {
  const [outputImage, setOutputImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // for preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_REMOVEBG_API_KEY;

  const handleFilesAccepted = async (files, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError("Please upload a valid image file (PNG, JPEG, JPG, or WEBP)");
      return;
    }
    if (files.length === 0) return;

    const file = files[0];
    setSelectedFile(file); // Save for preview

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const allowedExtensions = [".png", ".jpeg", ".jpg", ".webp"];

    const isValidType = allowedTypes.includes(file.type);
    const isValidExtension = allowedExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isValidType && !isValidExtension) {
      setError("Please upload a valid image file (PNG, JPEG, JPG, or WEBP)");
      return;
    }

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
      setError(null);

      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": API_KEY,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `HTTP Error ${res.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors?.length > 0) {
            errorMessage = errorData.errors[0].title || errorMessage;
          }
        } catch {
          switch (res.status) {
            case 400:
              errorMessage = "Invalid image or request format";
              break;
            case 401:
              errorMessage = "Invalid API key";
              break;
            case 402:
              errorMessage = "Insufficient credits";
              break;
            case 403:
              errorMessage = "Forbidden - check your API key permissions";
              break;
            case 429:
              errorMessage = "Rate limit exceeded";
              break;
            case 500:
              errorMessage = "Server error - please try again later";
              break;
            default:
              errorMessage = `HTTP Error ${res.status} - ${res.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setOutputImage(imageUrl);
    } catch (error) {
      console.error(error);
      setError(error.message);
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

  const handleRetry = () => {
    setOutputImage(null);
    setOriginalFileName("");
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center mt-5">
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          <p className="text-lg text-violet-500 font-medium">Processing...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-5 py-10">
          <div className="bg-red-50 border border-red-300 text-red-700 px-20 py-4 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm text-red-600 mt-1">
              We couldn't complete your request.
            </p>
            <p className="text-xs text-gray-500 mt-2">Error: {error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="cursor-pointer border-2 border-violet-400 py-2 px-5 rounded-full hover:bg-violet-500 transition-colors duration-300 text-neutral-800 hover:text-white"
          >
            Try Again
          </button>
        </div>
      ) : !outputImage ? (
        <>
          <UploadImage
            heading="Upload an image to remove the background"
            image={alden}
            multiple={false}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg", ".jpg"],
              "image/webp": [".webp"],
            }}
            onDropFiles={handleFilesAccepted}
          />

          {/* Preview here instead of inside UploadImage */}
          {selectedFile && (
            <div className="mt-5">
              <h2 className="text-center text-sm text-gray-500">Preview</h2>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-96 object-cover rounded-lg border border-violet-400"
              />
            </div>
          )}
        </>
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
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRetry}
              className="cursor-pointer border-2 border-violet-400 py-2 px-6 rounded-full hover:bg-violet-500 transition-colors duration-300 text-neutral-800 hover:text-white flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Try Another
            </button>
            <button
              onClick={handleDownload}
              className="text-white cursor-pointer bg-violet-400 py-2 px-6 rounded-full hover:bg-violet-500 transition-colors duration-300 flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BgRemover;
