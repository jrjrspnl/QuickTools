import React from "react";
import alden from "../assets/bg-remove-alden.png";
import { UploadImage } from "../components/Upload";
const BgRemover = () => {
  return (
    <UploadImage
      heading="Upload an image to remove the background"
      image={alden}
    />
  );
};

export default BgRemover;
