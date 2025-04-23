import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Components/Card";

function MovieList() {
  const [movieData, setMovieData] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("/user/getAllMovies")
      .then((response) => {
        const movies = response.data.data;
        setMovieData(movies);

        // Extract unique categories from movie data
        const uniqueCategories = [
          ...new Set(movies.map((movie) => movie.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
        setError("Failed to load movies");
      });
  }, []);

  if (error)
    return (
      <div className="h-full w-full bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-red-500 text-center">
          {error}
        </div>
      </div>
    );

  return (
    <div className="h-full w-full bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold hover:text-teal-500 text-gray-800 mt-10 mb-10 text-center">
          Now Showing
        </h1>

        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                {category || "Uncategorized"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {movieData
                  .filter((movie) => movie.category === category)
                  .map((movie) => (
                    <Card key={movie._id} id={movie._id} {...movie} />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No movies available</p>
        )}
      </div>
    </div>
  );
}

export default MovieList;
