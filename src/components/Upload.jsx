import React, { useCallback, useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { useDropzone } from "react-dropzone";

export const UploadImage = ({
  heading,
  image,
  onFilesAccepted,
  showPreview = true,
}) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(acceptedFiles);
      if (onFilesAccepted) onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className={
        files.length === 0
          ? "flex justify-center lg:justify-around mt-10 lg:my-20 gap-10 px-5 text-neutral-800 items-center "
          : "flex justify-center lg:justify-around mt-10 lg:my-10 gap-10 px-5 text-neutral-800 items-center "
      }
    >
      {image && files.length === 0 && (
        <img
          src={image}
          className="w-96 rounded-4xl -rotate-5 translate-y-10 hidden lg:flex shadow-lg transition hover:scale-105 duration-300"
          alt=""
        />
      )}

      <div className="flex flex-col gap-5">
        <h1 className="text-3xl md:text-4xl max-w-2xl font-semibold text-center ">
          {heading}
        </h1>

        {files.length === 0 ? (
          <div
            {...getRootProps()}
            className={`h-64 w-full bg-neutral-50 rounded-xl shadow-xl border-2 border-dashed ${
              isDragActive
                ? "border-violet-400 shadow-violet-300"
                : "border-neutral-300 shadow-blue-300/60"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full gap-5">
              <input {...getInputProps()} />
              <button className="text-white cursor-pointer bg-violet-400 py-2 px-5 flex items-center gap-2 rounded-full shadow-md hover:bg-violet-500 transition-colors duration-300">
                <LuImagePlus size={20} />
                Upload Image
              </button>
              <p className="text-sm font-base">
                {isDragActive
                  ? "Drop the files here ..."
                  : "Or drop an image here"}
              </p>
            </div>
          </div>
        ) : (
          showPreview && (
            <div className={`flex py-5 max-w-lg mx-auto`}>
              {files.map((file) => (
                <img
                  key={file.name}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-96 object-cover rounded-lg border border-violet-400"
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
