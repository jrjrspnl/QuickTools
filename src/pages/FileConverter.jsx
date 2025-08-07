import React from "react";
import { UploadImage } from "../components/Upload";
import ConvertFiles from "../assets/convert-files.png";
const FileConverter = () => {
  return (
    <UploadImage
      heading="Upload an image to convert to a different format"
      image={ConvertFiles}
    />
  );
};

export default FileConverter;
