import React, { useState } from "react";
import { UploadImage } from "../components/Upload";
import ConvertFiles from "../assets/convert-files.png";
import { CircleX, Download, FilePlus } from "lucide-react";

const API_KEY = import.meta.env.VITE_CONVERT_API_KEY;

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_FORMATS = [
  { label: "PDF", value: "pdf", mime: "application/pdf" },
  { label: "JPEG", value: "jpg", mime: "image/jpeg" },
  { label: "PNG", value: "png", mime: "image/png" },
  { label: "WebP", value: "webp", mime: "image/webp" },
];

const ACCEPTED_FILE_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg", ".jpg"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

const getMimeType = (format) =>
  ALLOWED_FORMATS.find((f) => f.value === format)?.mime ||
  "application/octet-stream";

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimeType });
};

const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
    }
    return null;
  };

  const handleFileDrop = (acceptedFiles) => {
    const validFiles = [];
    const newErrors = [];

    acceptedFiles.forEach((f) => {
      const error = validateFile(f);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push({ file: f, targetFormat: "pdf" });
      }
    });

    setSelectedFile(validFiles);
    if (newErrors.length) setErrors(newErrors);
  };

  const addFiles = (e) => {
    const filesArray = Array.from(e.target.files);
    const validFiles = [];
    const newErrors = [];

    filesArray.forEach((f) => {
      const error = validateFile(f);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push({ file: f, targetFormat: "pdf" });
      }
    });

    setSelectedFile((prev) => [...prev, ...validFiles]);
    if (newErrors.length) setErrors((prev) => [...prev, ...newErrors]);
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
    if (!selectedFile.length) return;

    setLoading(true);
    setErrors([]);

    try {
      await Promise.all(
        selectedFile.map(async ({ file, targetFormat }) => {
          const sourceFormat = file.name.split(".").pop().toLowerCase();

          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch(
            `https://v2.convertapi.com/convert/${sourceFormat}/to/${targetFormat}?Secret=${API_KEY}`,
            { method: "POST", body: formData }
          );

          if (!res.ok) {
            throw new Error(`Failed to convert ${file.name}`);
          }

          const data = await res.json();
          const fileInfo = data.Files[0];

          const blob = base64ToBlob(
            fileInfo.FileData,
            getMimeType(targetFormat)
          );

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${file.name.split(".")[0]}.${targetFormat}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        })
      );
    } catch (err) {
      console.error("Conversion error:", err);
      setErrors((prev) => [...prev, "Conversion failed. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {selectedFile.length === 0 ? (
        <UploadImage
          heading="Easily convert your image or file to another format"
          image={ConvertFiles}
          buttonText="Upload image or files"
          cardText="Or drop an image or files here"
          multiple
          onDropFiles={handleFileDrop}
          accept={ACCEPTED_FILE_TYPES}
        />
      ) : (
        <div className="mt-10 max-w-xl mx-auto w-full overflow-x-hidden">
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-3">
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <input
              type="file"
              id="file"
              hidden
              multiple
              accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(", ")}
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
                  title="Remove file"
                  className="text-neutral-500 cursor-pointer block sm:hidden"
                />
              </div>

              <div className="flex sm:flex-row text-center items-center gap-5">
                <h1 className="text-sm text-left">Output:</h1>
                <select
                  className="border"
                  value={upload.targetFormat}
                  onChange={(e) => updateFormat(index, e.target.value)}
                >
                  {ALLOWED_FORMATS.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </select>
              </div>

              <CircleX
                onClick={() => fileToRemove(upload)}
                title="Remove file"
                className="text-neutral-500 cursor-pointer hidden sm:block"
              />
            </div>
          ))}

          <div className="flex justify-end mt-3">
            <button
              disabled={loading}
              onClick={convertFiles}
              className={`text-white cursor-pointer py-2 px-6 rounded-full duration-300 flex items-center gap-2 ${
                loading
                  ? "bg-neutral-400"
                  : "bg-violet-400 hover:bg-violet-500 transition-colors"
              }`}
            >
              {loading ? "Converting..." : "Convert"}
              <Download size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FileConverter;
