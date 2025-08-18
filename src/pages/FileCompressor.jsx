import React, { useState } from "react";
import { UploadImage } from "../components/Upload";
import CompressFiles from "../assets/compress-files.png";
import { CircleX, Download, FilePlus } from "lucide-react";

const FileCompressor = () => {
  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    let kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    let mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compressedFiles, setCompressedFiles] = useState([]);

  const handleFiles = (acceptedFiles) => {
    const filesWithFormattedSize = acceptedFiles.map((file) => ({
      file, // actual File object
      formattedSize: formatFileSize(file.size),
    }));
    setSelectedFile(filesWithFormattedSize);
  };

  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Only images can be compressed"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Resize by 50%
          const scale = 0.5;
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert back to Blob (JPEG for compression)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Compression failed"));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.7 // quality (0–1)
          );
        };
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCompress = async () => {
    try {
      setLoading(true);
      const results = [];

      for (const upload of selectedFile) {
        const compressed = await compressImage(upload.file);

        // Create download URL
        const downloadUrl = URL.createObjectURL(compressed);

        results.push({
          file: compressed,
          originalSize: upload.formattedSize, // ✅ keep original size
          formattedSize: formatFileSize(compressed.size),
          downloadUrl,
        });
      }

      setCompressedFiles(results);
      setLoading(false);
    } catch (err) {
      console.error("Compression error:", err);
      setLoading(false);
    }
  };

  const handleDownloadAll = () => {
    compressedFiles.forEach((upload) => {
      const link = document.createElement("a");
      link.href = upload.downloadUrl; // ✅ now it exists
      link.download = upload.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div>
      {selectedFile.length === 0 ? (
        <UploadImage
          heading="Upload an image to compress it and reduce its size."
          image={CompressFiles}
          buttonText="Upload image or files"
          cardText="Or drop an image or files here"
          onDropFiles={handleFiles}
        />
      ) : (
        <div className="mt-10 max-w-xl mx-auto w-full overflow-x-hidden">
          <div className="flex justify-between items-center">
            <label htmlFor="file">
              <span className="cursor-pointer text-sm sm:text-base border-2 border-violet-400 py-1 px-5 rounded-lg hover:bg-violet-500 transition-colors duration-300 text-neutral-600 hover:text-white flex items-center gap-2">
                <FilePlus size={16} />
                Add more files
              </span>
            </label>
            <h1 className="text-sm text-neutral-500">
              Added {selectedFile.length} Files
            </h1>
          </div>

          {compressedFiles.length > 0 ? (
            <div className="mt-5">
              <h2 className="font-semibold text-green-600">
                Compressed Files:
              </h2>
              {compressedFiles.map((upload, index) => (
                <div
                  key={index}
                  className="text-sm md:text-base flex flex-col sm:flex-row justify-between border border-violet-400 rounded-md bg-white max-w-2xl mx-auto text-neutral-600 p-3 my-2"
                >
                  <span>{upload.file.name}</span>
                  <div className="flex gap-3">
                    <span className="line-through text-red-500">
                      {upload.originalSize}
                    </span>
                    <span className="text-green-600">
                      {upload.formattedSize}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleDownloadAll}
                  disabled={loading}
                  className={`text-white cursor-pointer py-2 px-6 rounded-full duration-300 flex items-center gap-2 ${
                    loading
                      ? "bg-neutral-400"
                      : "bg-violet-400 hover:bg-violet-500 transition-colors"
                  }`}
                >
                  {loading ? "Downloading..." : "Download"}
                  <Download size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              {selectedFile.map((upload, index) => (
                <div
                  key={index}
                  className="text-sm md:text-base flex flex-col sm:flex-row justify-between border border-violet-400 rounded-md bg-white max-w-2xl mx-auto text-neutral-600 p-3 my-2"
                >
                  <h1>{upload.file.name}</h1>
                  <h1>{upload.formattedSize}</h1>
                </div>
              ))}
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleCompress}
                  disabled={loading}
                  className={`text-white cursor-pointer py-2 px-6 rounded-full duration-300 flex items-center gap-2 ${
                    loading
                      ? "bg-neutral-400"
                      : "bg-violet-400 hover:bg-violet-500 transition-colors"
                  }`}
                >
                  {loading ? "Compressing.." : "Compress"}
                  <Download size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default FileCompressor;
