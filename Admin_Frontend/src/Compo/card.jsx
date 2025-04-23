// import React from "react";
// import { Link } from "react-router-dom";

// function Card({ id, title, genre, poster, handleRemove }) {
//   return (
//     <div className="bg-gray-200 w-auto h-6/7 min-h-96 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-500 hover:scale-105 hover:shadow-xl">
//       <Link to={`/movie/${id}`}>
//         {/* Movie Poster */}
//         {poster ? (
//           <img
//             src={poster}
//             alt={`${title} poster`}
//             className="h-4/5 w-full object-cover rounded-t-xl"
//           />
//         ) : (
//           <div className="h-4/5 w-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
//             No Poster
//           </div>
//         )}
//         {/* Movie Info */}
//         <div className="p-4">
//           <h2 className="text-xl font-semibold text-gray-700 mb-2 hover:text-teal-400 transition-colors duration-300">
//             {title}
//           </h2>
//           {genre && <p className="text-sm text-gray-600">{genre}</p>}{" "}
//           {/* ✅ Show Genre if Available */}
//         </div>
//       </Link>

//       {/* Remove Movie Button */}
//       <button
//         onClick={() => handleRemove(id)}
//         className="w-full bg-red-500 text-white py-2 text-sm font-semibold rounded-b-xl hover:bg-red-600 transition-colors duration-300"
//       >
//         Remove Movie
//       </button>
//     </div>
//   );
// }

// export default Card;
import React from "react";
import { Link } from "react-router-dom";

function Card({ id, title, genre, poster, handleRemove }) {
  return (
    <div className="bg-gray-200 w-auto h-6/7 min-h-96 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-500 hover:scale-105 hover:shadow-xl">
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
        {genre && <p className="text-sm text-gray-600">{genre}</p>}
      </div>

      {/* Remove Movie Button */}
      <button
        onClick={handleRemove}
        className="w-full bg-slate-800 text-white py-2 text-sm font-semibold rounded-b-xl hover:bg-teal-700 transition-all duration-200"
      >
        🗑 Delete
      </button>
    </div>
  );
}

export default Card;
