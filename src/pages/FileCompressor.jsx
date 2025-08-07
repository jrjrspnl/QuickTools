import React from "react";
import { UploadImage } from "../components/Upload";
import CompressFiles from "../assets/compress-files.png";
const FileCompressor = () => {
  return (
    <div>
      {" "}
      <UploadImage
        heading=" Upload an image or file to compress it and reduce its size."
        image={CompressFiles}
      />
    </div>
  );
};

export default FileCompressor;
