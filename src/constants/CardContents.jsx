import { TbBackground } from "react-icons/tb";
import { SiConvertio } from "react-icons/si";
import { CgCompressRight } from "react-icons/cg";
export const CardsContent = [
  {
    id: 1,
    icon: <TbBackground size={80} />,
    title: "Remove Background",
    description:
      "Easily remove the background from any image in seconds with just one click.",
    route: "/bg-remover",
  },
  {
    id: 2,
    icon: <SiConvertio size={80} />,
    title: "Convert Files",
    description:
      "Convert image formats such as PNG, JPG, WebP, and more in one click.",
    route: "/file-converter",
  },
  {
    id: 3,
    icon: <CgCompressRight size={80} />,
    title: "Image Compressor",
    description:
      "Shrink your image file size by reducing quality — perfect for faster uploads and saving storage.",
    route: "/file-compressor",
  },
];
