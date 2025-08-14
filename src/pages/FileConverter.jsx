import React, { useState, useRef } from "react";
import { UploadImage } from "../components/Upload";
import ConvertFiles from "../assets/convert-files.png";
import { ImGift } from "react-icons/im";
import { CircleX, Download, FilePlus } from "lucide-react";
const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState([]); // for preview

  const handleFileDrop = (acceptedFiles, fileRejections) => {
    setSelectedFile(acceptedFiles);
  };

  const fileToRemove = (fileName) => {
    setSelectedFile((files) =>
      files.filter((file) => file.name !== fileName.name)
    );
  };

  const inputRef = useRef < HTMLInputElement > null;

  const addFiles = (e) => {
    const filesArray = Array.from(e.target.files);
    setSelectedFile((prevFiles) => [...prevFiles, ...filesArray]);
    e.target.value = ""; // reset so you can reselect the same file
  };

  return (
    <>
      {selectedFile.length === 0 ? (
        <UploadImage
          heading="Upload an image to convert to a different format"
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
        <div className="mt-10 max-w-xl mx-auto w-full">
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
              <span className="cursor-pointer border-2 border-violet-400 py-1 px-5 rounded-lg hover:bg-violet-500 transition-colors duration-300 text-neutral-600 hover:text-white flex items-center gap-2">
                <FilePlus size={16} />
                Add more files
              </span>
            </label>

            <h1 className="text-sm text-neutral-500">
              Added {selectedFile.length} Files
            </h1>
          </div>

          {selectedFile.map((upload) => (
            <div
              key={upload.name}
              className="text-sm md:text-base flex justify-between border border-violet-400 rounded-md  bg-white max-w-2xl mx-auto  text-neutral-600 p-3 my-2"
            >
              <div className="flex flex-col max-w-5xl ">
                <h1>{upload.name}</h1>
              </div>
              <div className="flex text-center items-center gap-5">
                <h1>Output:</h1>
                <select>
                  <option>JPEG</option>
                  <option>PNG</option>
                  <option>DOCX</option>
                  <option>PDF</option>
                  <option>WebP</option>
                </select>
                <CircleX
                  onClick={() => fileToRemove(upload)}
                  className="text-neutral-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end  mt-3">
            <button className="text-white cursor-pointer bg-violet-400 py-2 px-6 rounded-full hover:bg-violet-500 transition-colors duration-300 flex items-center gap-2">
              <Download size={16} />
              Convert
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FileConverter;
