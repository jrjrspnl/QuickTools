import React, { useState, useEffect } from "react";
import alden from "../assets/bg-remove-alden.png";
import { UploadImage } from "../components/Upload";

const BgRemover = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading....</h1>
      ) : (
        <UploadImage
          heading="Upload an image to remove the background"
          image={alden}
        />
      )}
    </div>
  );
};

export default BgRemover;
