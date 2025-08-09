import React, { useState } from "react";
import alden from "../assets/bg-remove-alden.png";
import { UploadImage } from "../components/Upload";

const BgRemover = () => {
  const [outputImage, setOutputImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_REMOVEBG_API_KEY;

  const handleFilesAccepted = async (files, errorMessage) => {
    // Handle file type errors from dropzone
    if (errorMessage) {
      setError("Please upload a valid image file (PNG, JPEG, JPG, or WEBP)");
      return;
    }

    if (files.length === 0) return;

    const file = files[0];

    // Additional validation as backup
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
      setError(null); // Clear previous errors

      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": API_KEY,
        },
        body: formData,
      });

      if (!res.ok) {
        // Get error details from response
        const errorText = await res.text();
        let errorMessage = `HTTP Error ${res.status}`;

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0].title || errorMessage;
          }
        } catch {
          // If parsing fails, use the status-based message
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
            className="cursor-pointer border-2 border-violet-400 py-2 px-5 flex items-center gap-2 rounded-full shadow-md hover:bg-violet-500 transition-colors duration-300 text-neutral-800 hover:text-white"
          >
            Try Again
          </button>
        </div>
      ) : !outputImage ? (
        <UploadImage
          heading="Upload an image to remove the background"
          image={alden}
          showPreview={false}
          onFilesAccepted={handleFilesAccepted}
          acceptedFileTypes={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/webp": [".webp"],
          }}
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
              onClick={handleRetry}
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
