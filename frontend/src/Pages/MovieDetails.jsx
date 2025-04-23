import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import YouTube from "react-youtube";

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieAndFeedback = async () => {
      try {
        // Fetch movie details
        const movieResponse = await axios.get(`/user/getMovie/${id}`);
        setMovie(movieResponse.data.data);

        // Fetch feedback for this movie
        const feedbackResponse = await axios.get(`/user/getFeedback/${id}`);
        setFeedback(feedbackResponse.data.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load movie details or feedback.");
        setLoading(false);
      }
    };
    fetchMovieAndFeedback();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-xl mt-10 text-gray-700">Loading...</p>
    );
  }

  if (error) {
    return <p className="text-center text-xl mt-10 text-red-500">{error}</p>;
  }

  const opts = {
    width: "100%",
    height: "420",
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Movie Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {movie.title}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {movie.genre} | ⏳ {movie.duration} min
          </p>
        </div>

        {/* Movie Trailer */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Watch the Trailer
          </h2>
          <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl shadow-lg">
            <YouTube videoId={movie.trailer} opts={opts} />
          </div>
        </div>

        {/* Movie Content */}
        <div className="mt-8 flex flex-col lg:flex-row gap-10">
          {/* Movie Poster */}
          <div className="w-full lg:w-1/3">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          {/* Movie Details, Cast & Crew */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-200 p-6 rounded-xl shadow">
              <h2 className="text-2xl font-semibold text-gray-900">
                About the Movie
              </h2>
              <p className="text-gray-700 mt-4">{movie.description}</p>

              <div className="mt-6 text-gray-800 space-y-2">
                <p className="text-lg">
                  🎭 <strong>Genre:</strong> {movie.genre}
                </p>
                <p className="text-lg">
                  ⏳ <strong>Duration:</strong> {movie.duration} min
                </p>
                <p className="text-lg">
                  🌐 <strong>Language:</strong> {movie.language}
                </p>
                <p className="text-lg">
                  📅 <strong>Release Date:</strong>{" "}
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </p>
              </div>

              {/* Book Ticket Button */}
              <div className="text-center mt-6">
                <NavLink to={`/seat/${movie._id}`} state={{ movie }}>
                  <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300">
                    Book Ticket
                  </button>
                </NavLink>
              </div>
            </div>

            {/* Cast & Crew Section */}
            <div className="mt-10 flex flex-col lg:flex-row gap-10">
              {/* Cast Section */}
              <div className="w-full lg:w-1/2 bg-gray-200 p-6 rounded-xl shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
                  🎭 Cast
                </h3>
                <ul className="list-disc pl-5 text-gray-700 mt-3 space-y-2">
                  {movie.cast.map((actor, index) => (
                    <li key={index}>
                      {actor.name} as <strong>{actor.role}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Crew Section */}
              <div className="w-full lg:w-1/2 bg-gray-200 p-6 rounded-xl shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
                  🎬 Crew
                </h3>
                <ul className="list-disc pl-5 text-gray-700 mt-3 space-y-2">
                  {movie.crew.map((member, index) => (
                    <li key={index}>
                      {member.name} - <strong>{member.role}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Feedback from Backend */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                What Our Customers Say...
              </h2>
            </div>
            {feedback.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {feedback.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className="rounded-full bg-gray-200 h-12 w-12 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {review.user?.fullName || "Anonymous"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">{review.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                No reviews yet. Be the first to share your feedback!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
