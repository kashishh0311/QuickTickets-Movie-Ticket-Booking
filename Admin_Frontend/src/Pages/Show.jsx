import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./ManageShows.css"; // Update this CSS file

function ManageShows() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [newShow, setNewShow] = useState({
    movieId: "",
    showDate: "",
    showTime: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editShowData, setEditShowData] = useState({
    movieId: "",
    showDate: "",
    showTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToDelete, setShowToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [showsResponse, moviesResponse] = await Promise.all([
        axios.get("/admin/getAllShowTime"),
        axios.get("/admin/getAllMovies"),
      ]);
      setShows(showsResponse.data.data || []);
      setMovies(moviesResponse.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewShow({ ...newShow, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditShowData({ ...editShowData, [e.target.name]: e.target.value });
  };

  const handleAddShow = async () => {
    if (!newShow.movieId || !newShow.showDate || !newShow.showTime) {
      toast.error("Please fill all fields!");
      return;
    }

    const selectedMovie = movies.find((m) => m._id === newShow.movieId);
    if (!selectedMovie) {
      toast.error("Invalid movie selected!");
      return;
    }

    const payload = {
      movieId: newShow.movieId,
      movieTitle: selectedMovie.title,
      showDate: new Date(newShow.showDate).toISOString(),
      showTime: newShow.showTime,
    };

    console.log("Sending payload:", payload);

    try {
      const response = await axios.post("/admin/createShowTime", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Show added successfully!");
      setShows([...shows, response.data.data]);
      setNewShow({ movieId: "", showDate: "", showTime: "" });
      setError(null);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to add show. Please try again."
      );
    }
  };

  const handleRemove = async (id) => {
    setShowToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!showToDelete) return;

    try {
      await axios.delete("/admin/deleteShowTime", {
        data: { _id: showToDelete },
      });
      toast.success("Show deleted successfully!");
      setShows(shows.filter((show) => show._id !== showToDelete));
      setError(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete show");
    } finally {
      setShowDeleteConfirm(false);
      setShowToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setShowToDelete(null);
  };

  const handleEditClick = (show) => {
    setEditingId(show._id);
    setEditShowData({
      movieId: show.movie?._id || "",
      showDate: show.showDate
        ? new Date(show.showDate).toISOString().split("T")[0]
        : "",
      showTime: show.showTime || "",
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put("/admin/updateShowTime", {
        showId: id,
        ...editShowData,
        showDate: new Date(editShowData.showDate).toISOString(),
      });
      toast.success("Show updated successfully!");
      setShows(
        shows.map((show) => (show._id === id ? response.data.data : show))
      );
      setEditingId(null);
      setError(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update show");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🎭 Manage Shows</h1>

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
              Do you really want to delete this show? This action cannot be
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

      {/* Add New Show Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          ➕ Add New Show
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="movieId"
            value={newShow.movieId}
            onChange={handleChange}
            className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
            disabled={loading}
          >
            <option value="">🎬 Select Movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="showDate"
            value={newShow.showDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
            disabled={loading}
          />
          <input
            type="text"
            name="showTime"
            value={newShow.showTime}
            onChange={handleChange}
            placeholder="🕒 Show Time (e.g., 7:00 PM)"
            className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleAddShow}
          disabled={loading}
          className={`mt-5 bg-slate-700 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
          }`}
        >
          🎭 Add Show
        </button>
      </div>

      {/* Shows Grid */}
      {loading ? (
        <div className="text-center">Loading shows...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shows.map((show) => (
            <div key={show._id} className="bg-white shadow-lg rounded-lg p-6">
              {editingId === show._id ? (
                <div>
                  <select
                    name="movieId"
                    value={editShowData.movieId}
                    onChange={handleEditChange}
                    className="p-2 border rounded-lg w-full mb-2"
                  >
                    <option value="">Select Movie</option>
                    {movies.map((movie) => (
                      <option key={movie._id} value={movie._id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    name="showDate"
                    value={editShowData.showDate}
                    onChange={handleEditChange}
                    className="p-2 border rounded-lg w-full mb-2"
                  />
                  <input
                    type="text"
                    name="showTime"
                    value={editShowData.showTime}
                    onChange={handleEditChange}
                    className="p-2 border rounded-lg w-full mb-2"
                  />
                  <div className="flex justify-center space-x-4 mt-2">
                    <button
                      onClick={() => handleSaveEdit(show._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    🎬 {show.movie?.title || "Unknown Movie"}
                  </h2>
                  <p className="text-gray-700 mb-1">
                    📅 {new Date(show.showDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-1">🕒 {show.showTime}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={() => handleEditClick(show)}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
                    >
                      ✏ Edit
                    </button>
                    <button
                      onClick={() => handleRemove(show._id)}
                      className="bg-slate-800 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageShows;
