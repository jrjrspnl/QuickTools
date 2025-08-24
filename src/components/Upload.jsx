import React, { useCallback, useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { useDropzone } from "react-dropzone";
import { Button } from "./Buttons";
export const UploadImage = ({
  heading,
  image,
  buttonText,
  multiple = false,
  accept,
  onDropFiles,
}) => {
  const [files, setFiles] = useState([]); // to store the files

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      // acceptedFiles: Array of files that passed validation
      // fileRejections: Array of files that were rejected (wrong format, too big, etc.)
      setFiles(acceptedFiles);
      if (onDropFiles) {
        onDropFiles(acceptedFiles, fileRejections); // Pass both to parent
      }
    },
    [onDropFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
  });

  return (
    <div
      className={
        files.length === 0
          ? "flex justify-center lg:justify-around mt-10 lg:my-20 gap-10 px-5 text-neutral-800 items-center "
          : "flex justify-center lg:justify-around mt-10 lg:my-10 gap-10 px-5 text-neutral-800 items-center "
      }
    >
      <img
        src={image}
        className="w-96 mr-10 rounded-4xl -rotate-5 translate-y-10 hidden lg:flex shadow-lg transition hover:scale-105 duration-300"
        alt=""
      />

      <div className="flex flex-col gap-5">
        <h1 className="text-3xl md:text-4xl max-w-2xl font-semibold text-center ">
          {heading}
        </h1>

        {files.length === 0 && (
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
              <Button text={buttonText} icon={LuImagePlus} />
              <p className="text-sm font-base">Or drop a file here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
