import React from "react";
import { Link } from "react-router-dom";

function Card({ id, title, genre, poster }) {
  return (
    <div className="bg-gray-200 w-auto h-6/7 min-h-80 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-500 hover:scale-105 hover:shadow-xl">
      <Link to={`/movie/${id}`}>
        {/* Movie Poster */}
        {poster ? (
          <img
            src={poster}
            alt={`${title} poster`}
            className="h-4/5 w-full object-cover rounded-t-xl"
          />
        ) : (
          <div className="h-4/5 w-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
            No Poster
          </div>
        )}
        {/* Movie Info */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 hover:text-teal-400 transition-colors duration-300">
            {title}
          </h2>
          {genre && <p className="text-sm text-gray-600">{genre}</p>}{" "}
          {/* ✅ Show Genre if Available */}
        </div>
      </Link>
    </div>
  );
}

export default Card;
