import React, { useState } from "react";
import { UploadImage } from "../components/Upload";
import ConvertFiles from "../assets/convert-files.png";
import { CircleX, Download, FilePlus } from "lucide-react";

const API_KEY = import.meta.env.VITE_CONVERT_API_KEY;

const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileDrop = (acceptedFiles) => {
    const wrappedFiles = acceptedFiles.map((f) => ({
      file: f,
      targetFormat: "pdf",
    }));
    setSelectedFile(wrappedFiles);
  };

  const addFiles = (e) => {
    const filesArray = Array.from(e.target.files);
    const validFiles = filesArray
      .filter((file) => {
        if (file.size > 50 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max 50MB.`);
          return false;
        }
        return true;
      })
      .map((f) => ({
        file: f,
        targetFormat: "pdf",
      }));

    setSelectedFile((prevFiles) => [...prevFiles, ...validFiles]);
    e.target.value = "";
  };

  const fileToRemove = (fileObj) => {
    setSelectedFile((files) =>
      files.filter((f) => f.file.name !== fileObj.file.name)
    );
  };

  const updateFormat = (index, format) => {
    setSelectedFile((prev) => {
      const newFiles = [...prev];
      newFiles[index].targetFormat = format;
      return newFiles;
    });
  };

  const convertFiles = async () => {
    if (selectedFile.length === 0) return;

    setLoading(true);

    try {
      for (const { file, targetFormat } of selectedFile) {
        const sourceFormat = file.name.split(".").pop().toLowerCase();

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `https://v2.convertapi.com/convert/${sourceFormat}/to/${targetFormat}?Secret=${API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) throw new Error(`Failed to convert ${file.name}`);

        const data = await res.json();
        const fileInfo = data.Files[0];

        const byteCharacters = atob(fileInfo.FileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: getMimeType(targetFormat) });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.split(".")[0]}.${targetFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Conversion error:", err);
      alert("Conversion failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to set MIME type for Blob
  const getMimeType = (format) => {
    switch (format) {
      case "pdf":
        return "application/pdf";
      case "jpg":
        return "image/jpeg";
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      default:
        return "application/octet-stream";
    }
  };

  return (
    <>
      {selectedFile.length === 0 ? (
        <UploadImage
          heading="Upload an image to convert to a different format "
          image={ConvertFiles}
          multiple={true}
          onDropFiles={handleFileDrop}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/webp": [".webp"],
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
          }}
        />
      ) : (
        <div className="mt-10 max-w-xl mx-auto w-full overflow-x-hidden">
          <div className="flex justify-between items-center">
            <input
              type="file"
              id="file"
              hidden
              multiple
              accept=".png, .jpeg, .jpg, .webp, .pdf, .docx"
              onChange={addFiles}
            />

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

          {selectedFile.map((upload, index) => (
            <div
              key={upload.file.name}
              className="text-sm md:text-base flex flex-col sm:flex-row justify-between border border-violet-400 rounded-md bg-white max-w-2xl mx-auto text-neutral-600 p-3 my-2"
            >
              <div className="flex justify-between max-w-5xl">
                <h1>{upload.file.name}</h1>
                <CircleX
                  onClick={() => fileToRemove(upload)}
                  className="text-neutral-500 cursor-pointer block sm:hidden"
                />
              </div>

              <div className="flex  sm:flex-row text-center items-center gap-5">
                <h1 className="text-sm text-left">Output:</h1>

                <select
                  className="border "
                  value={upload.targetFormat}
                  onChange={(e) => updateFormat(index, e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="jpg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="docx">DOCX</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
              <CircleX
                onClick={() => fileToRemove(upload)}
                className="text-neutral-500 cursor-pointer hidden sm:block"
              />
            </div>
          ))}

          <div className="flex justify-end mt-3">
            <button
              disabled={loading}
              onClick={convertFiles}
              className="text-white cursor-pointer bg-violet-400 py-2 px-6 rounded-full hover:bg-violet-500 transition-colors duration-300 flex items-center gap-2"
            >
              <Download size={16} />
              {loading ? "Converting..." : "Convert"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default FileConverter;
