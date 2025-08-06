import React from "react";
import { TbBackground } from "react-icons/tb";
import { CardsContent } from "../constants/CardContents";
import { Link } from "react-router-dom";
const Cards = () => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-10">
        {CardsContent.map((content) => (
          <Link to={content.route}>
            <div
              key={content.id}
              className="h-70 w-80 bg-white border border-blue-400 rounded-lg 
             drop-shadow-lg active:drop-shadow-[0_0_3px_blue] active:scale-102 lg:hover:drop-shadow-[0_0_3px_blue] lg:hover:scale-102
             transition duration-300 ease-in-out"
            >
              <div className="flex flex-col justify-center items-center h-full text-center gap-2 px-4">
                <span className="text-violet-400">{content.icon}</span>
                <h1 className="text-xl font-semibold text-neutral-800">
                  {content.title}
                </h1>
                <p className="text-sm text-neutral-600">
                  {content.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Cards;
