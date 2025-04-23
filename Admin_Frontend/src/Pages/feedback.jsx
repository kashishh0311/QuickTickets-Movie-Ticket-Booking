import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllFeedback = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    minRating: "",
    maxRating: "",
    page: 1,
  });

  useEffect(() => {
    fetchFeedback();
  }, [filters]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/getAllFeedback", {
        params: filters,
      });
      setFeedbackData(response.data.data);
      toast.success("Feedback loaded successfully!", { autoClose: 2000 });
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const FeedbackCard = ({ item }) => {
    return (
      <div className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
        {/* Teal Accent Bar */}
        <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold">
                {item.user.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.user.fullName}
                </h3>
                <p className="text-sm text-teal-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-600 italic bg-teal-50 p-3 rounded-lg mb-4">
            "{item.message}"
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              {item.movieRating && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    Movie Rating:
                  </span>{" "}
                  <span className="text-teal-600">{item.movieRating}/5 ★</span>
                </p>
              )}
              {item.bookingRating && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    Booking Rating:
                  </span>{" "}
                  <span className="text-teal-600">
                    {item.bookingRating}/5 ★
                  </span>
                </p>
              )}
              {item.rating && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    General Rating:
                  </span>{" "}
                  <span className="text-teal-600">{item.rating}/5 ★</span>
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Categories:</span>{" "}
                <span className="capitalize text-teal-600">
                  {item.category.join(", ")}
                </span>
              </p>
              {item.relatedMovie && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Movie:</span>{" "}
                  <span className="text-teal-500">
                    {item.relatedMovie.title}
                  </span>
                </p>
              )}
              {item.booking && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Booking ID:</span>{" "}
                  <span className="text-teal-500">
                    {item.booking.bookingId}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br  min-h-screen">
      <h1 className="text-4xl font-extrabold text-teal-800 mb-8 text-center animate-fade-in">
        📣 Feedback Dashboard
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between animate-slide-up">
          {error}
          <button onClick={() => setError(null)} className="text-red-700">
            ×
          </button>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 animate-slide-up">
        <h2 className="text-xl font-semibold text-teal-700 mb-4">
          🔍 Filter Feedback
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-3 bg-teal-50 border border-teal-300 rounded-lg w-full focus:ring focus:ring-teal-400 text-gray-700 transition-all duration-200"
              disabled={loading}
            >
              <option value="">All Categories</option>
              <option value="movie">Movie</option>
              <option value="booking">Booking</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <input
              type="number"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              placeholder="Min Rating (1-5)"
              min="1"
              max="5"
              className="p-3 bg-teal-50 border border-teal-300 rounded-lg w-full focus:ring focus:ring-teal-400 text-gray-700 transition-all duration-200"
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="number"
              name="maxRating"
              value={filters.maxRating}
              onChange={handleFilterChange}
              placeholder="Max Rating (1-5)"
              min="1"
              max="5"
              className="p-3 bg-teal-50 border border-teal-300 rounded-lg w-full focus:ring focus:ring-teal-400 text-gray-700 transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Feedback Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {feedbackData?.feedback?.length > 0 ? (
            feedbackData.feedback.map((item) => (
              <FeedbackCard key={item._id} item={item} />
            ))
          ) : (
            <div className="col-span-full text-center text-teal-600 py-10 animate-fade-in">
              No feedback available.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {feedbackData?.pagination && feedbackData.pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-6 animate-slide-up">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1 || loading}
            className={`bg-teal-600 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
              filters.page === 1 || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-teal-700"
            }`}
          >
            Previous
          </button>
          <p className="text-teal-700 font-medium bg-teal-50 px-4 py-2 rounded-lg">
            Page {feedbackData.pagination.currentPage} of{" "}
            {feedbackData.pagination.totalPages}
          </p>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={
              filters.page === feedbackData.pagination.totalPages || loading
            }
            className={`bg-teal-600 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
              filters.page === feedbackData.pagination.totalPages || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-teal-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllFeedback;
