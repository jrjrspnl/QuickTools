import React from "react";
import { UploadImage } from "../components/Upload";
import ConvertFiles from "../assets/convert-files.png";
const FileConverter = () => {
  return (
    <UploadImage
      heading="Upload an image to remove the background"
      image={ConvertFiles}
    />
  );
};

export default FileConverter;
