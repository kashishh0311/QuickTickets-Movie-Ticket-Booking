import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Compo/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageMovies() {
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    duration: "",
    genre: "",
    category: "",
    language: "",
    releaseDate: "",
    poster: null,
    trailer: "",
    cast: "",
    crew: "",
  });
  const [errors, setErrors] = useState({});
  const [movieData, setMovieData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const categories = ["Hollywood", "Bollywood", "Gujrati", "Animatation"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    setNewMovie((prev) => ({ ...prev, poster: e.target.files[0] }));
    if (errors.poster) {
      setErrors((prev) => ({ ...prev, poster: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newMovie.title) newErrors.title = "Title is required";
    if (!newMovie.description)
      newErrors.description = "Description is required";
    if (!newMovie.duration || !/^\d+$/.test(newMovie.duration))
      newErrors.duration = "Duration must be a number (minutes)";
    if (!newMovie.genre) newErrors.genre = "Genre is required";
    if (!newMovie.category) newErrors.category = "Category is required";
    if (!newMovie.language) newErrors.language = "Language is required";
    if (!newMovie.releaseDate)
      newErrors.releaseDate = "Release date is required";
    if (!newMovie.poster) newErrors.poster = "Poster image is required";
    if (!newMovie.trailer) newErrors.trailer = "Trailer URL is required";
    if (!newMovie.cast) newErrors.cast = "Cast is required";
    else if (!newMovie.cast.includes(":"))
      newErrors.cast = "Cast must include roles (e.g., 'Tom Hanks:Actor')";
    if (!newMovie.crew) newErrors.crew = "Crew is required";
    else if (!newMovie.crew.includes(":"))
      newErrors.crew = "Crew must include roles (e.g., 'John Doe:Director')";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the form errors!");
    }
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("/admin/getAllMovies")
      .then((response) => {
        setMovieData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
        toast.error("Failed to load movies");
        setLoading(false);
      });
  }, []);

  const handleAddMovie = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(newMovie).forEach(([key, value]) => {
      if (key === "cast" || key === "crew") {
        const items = value.split(",").map((item) => {
          const [name, role] = item.split(":").map((str) => str.trim());
          return { name, role };
        });
        formData.append(key, JSON.stringify(items));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.post("/admin/addMovie", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newMovieData = {
        ...response.data.data,
        poster: response.data.data.posterUrl || response.data.data.poster,
      };
      toast.success("Movie added successfully!");
      setNewMovie({
        title: "",
        description: "",
        duration: "",
        genre: "",
        category: "",
        language: "",
        releaseDate: "",
        poster: null,
        trailer: "",
        cast: "",
        crew: "",
      });
      setErrors({});
      setMovieData([...movieData, newMovieData]);
      setError(null);
    } catch (error) {
      console.error("Error Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add movie");
    }
  };

  const handleRemove = async (id) => {
    setMovieToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;

    try {
      await axios.delete(`/admin/deleteMovie/${movieToDelete}`);
      toast.success("Movie deleted successfully!");
      setMovieData(movieData.filter((movie) => movie._id !== movieToDelete));
      setError(null);
    } catch (error) {
      console.error("Failed to remove movie:", error);
      toast.error("Failed to remove movie");
    } finally {
      setShowDeleteConfirm(false);
      setMovieToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setMovieToDelete(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        🎬 Manage Movies
      </h1>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
      />

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure?
            </h3>
            <p className="text-gray-700 mb-6">
              Do you really want to delete this movie? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-700">
            ×
          </button>
        </div>
      )}

      {/* Add New Movie Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          ➕ Add New Movie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              name="title"
              value={newMovie.title}
              onChange={handleChange}
              placeholder="🎥 Movie Title"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="genre"
              value={newMovie.genre}
              onChange={handleChange}
              placeholder="🎭 Genre"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.genre && (
              <p className="text-red-500 text-sm">{errors.genre}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              name="duration"
              value={newMovie.duration}
              onChange={handleChange}
              placeholder="⏳ Duration (min)"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="language"
              value={newMovie.language}
              onChange={handleChange}
              placeholder="🗣️ Language"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.language && (
              <p className="text-red-500 text-sm">{errors.language}</p>
            )}
          </div>
          <div>
            <input
              type="date"
              name="releaseDate"
              value={newMovie.releaseDate}
              onChange={handleChange}
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.releaseDate && (
              <p className="text-red-500 text-sm">{errors.releaseDate}</p>
            )}
          </div>
          <div>
            <input
              type="file"
              name="poster"
              onChange={handleFileChange}
              accept="image/*"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.poster && (
              <p className="text-red-500 text-sm">{errors.poster}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="trailer"
              value={newMovie.trailer}
              onChange={handleChange}
              placeholder="🎬 Trailer URL"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.trailer && (
              <p className="text-red-500 text-sm">{errors.trailer}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="cast"
              value={newMovie.cast}
              onChange={handleChange}
              placeholder="👥 Cast (Tom Hanks:Actor)"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.cast && (
              <p className="text-red-500 text-sm">{errors.cast}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="crew"
              value={newMovie.crew}
              onChange={handleChange}
              placeholder="🎬 Crew (John Doe:Director)"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            />
            {errors.crew && (
              <p className="text-red-500 text-sm">{errors.crew}</p>
            )}
          </div>
          <div>
            <select
              name="category"
              value={newMovie.category}
              onChange={handleChange}
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              disabled={loading}
            >
              <option value="">🎞️ Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
          <div className="md:col-span-3">
            <textarea
              name="description"
              value={newMovie.description}
              onChange={handleChange}
              placeholder="📝 Description"
              className="p-2 border rounded-lg w-full focus:ring focus:ring-blue-300"
              rows="3"
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleAddMovie}
          disabled={loading}
          className={`mt-5 bg-slate-700 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
          }`}
        >
          🎬 Add Movie
        </button>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center">Loading movies...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movieData.map((movie) => (
            <Card
              key={movie._id}
              id={movie._id}
              title={movie.title}
              genre={movie.genre}
              poster={movie.poster}
              handleRemove={() => handleRemove(movie._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageMovies;
