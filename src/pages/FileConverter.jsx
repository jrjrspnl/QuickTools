import React, { useState } from "react";
import { UploadImage } from "../components/Upload";
import ConvertFiles from "../assets/convert-files.png";
import { ImGift } from "react-icons/im";
import { CircleX } from "lucide-react";
const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState([]); // for preview

  const handleFileDrop = (acceptedFiles, fileRejections) => {
    console.log("Accepted files:", acceptedFiles);
    // Process your files here
    acceptedFiles.forEach((file) => {
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("File type:", file.type);
    });
    setSelectedFile(acceptedFiles);
  };

  return (
    <>
      {selectedFile.length === 0 ? (
        <UploadImage
          heading="Upload an image to convert to a different format"
          image={ConvertFiles}
          multiple={true}
          onDropFiles={handleFileDrop}
        />
      ) : (
        <div className="mt-10">
          {selectedFile.map((upload) => (
            <div className="text-sm md:text-base flex justify-between border border-violet-400 rounded-md  bg-white max-w-2xl mx-auto  text-neutral-600 p-3 my-2">
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
                <CircleX className="text-neutral-500 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FileConverter;
