import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Search,
  Download,
  Filter,
  Calendar,
  BarChart,
} from "lucide-react";
import {
  BarChart as ReChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("movies");

  // Movies State
  const [movies, setMovies] = useState([]);
  const [movieLoading, setMovieLoading] = useState(true);
  const [movieError, setMovieError] = useState(null);
  const [movieSearchTerm, setMovieSearchTerm] = useState("");
  const [movieSortConfig, setMovieSortConfig] = useState({
    key: "releaseDate",
    direction: "desc",
  });

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("");

  // Revenue State
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueFilters, setRevenueFilters] = useState({
    startDate: "",
    endDate: "",
  });

  // Users State
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userSortConfig, setUserSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Fetch Functions
  const fetchMovies = async () => {
    try {
      setMovieLoading(true);
      const response = await axios.get("/admin/getAllMovies");
      setMovies(response.data.data || []);
      setMovieError(null);
    } catch (err) {
      setMovieError(err.message);
      console.error("Error fetching movies:", err);
    } finally {
      setMovieLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/admin/getAdminAllBookings");
      setBookings(response.data.data);
      setFilteredBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const response = await axios.get("/admin/getRevenueReport", {
        params: revenueFilters,
      });
      setRevenueData(response.data.data);
      setTotalRevenue(
        response.data.data.reduce((sum, item) => sum + item.totalRevenue, 0)
      );
    } catch (error) {
      console.error("Error fetching revenue report:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const response = await axios.get("/admin/getAllUsers");
      setUsers(response.data.data || []);
      setUserError(null);
    } catch (err) {
      setUserError(err.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchBookings();
    fetchRevenue();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [revenueFilters]);

  // Movies Functions
  const handleMovieSort = (key) => {
    let direction = "asc";
    if (movieSortConfig.key === key && movieSortConfig.direction === "asc") {
      direction = "desc";
    }
    setMovieSortConfig({ key, direction });
  };

  const sortedMovies = React.useMemo(() => {
    let sortableMovies = [...movies];
    if (movieSortConfig.key) {
      sortableMovies.sort((a, b) => {
        if (a[movieSortConfig.key] < b[movieSortConfig.key]) {
          return movieSortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[movieSortConfig.key] > b[movieSortConfig.key]) {
          return movieSortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMovies;
  }, [movies, movieSortConfig]);

  const filteredMovies = sortedMovies.filter(
    (movie) =>
      movie.title?.toLowerCase().includes(movieSearchTerm.toLowerCase()) ||
      movie.genre?.toLowerCase().includes(movieSearchTerm.toLowerCase()) ||
      movie.language?.toLowerCase().includes(movieSearchTerm.toLowerCase())
  );

  const exportMoviesCSV = () => {
    const headers = ["Title", "Genre", "Language", "Release Date", "Duration"];
    const rows = filteredMovies.map((movie) => [
      movie.title,
      movie.genre,
      movie.language,
      new Date(movie.releaseDate).toLocaleString(),
      movie.duration,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "movies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bookings Functions
  const filterBookings = (search, price, status) => {
    let filtered = bookings;
    if (search) {
      filtered = filtered.filter((booking) =>
        booking.movie.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (price.min || price.max) {
      filtered = filtered.filter((booking) => {
        return (
          (!price.min || booking.totalPrice >= parseFloat(price.min)) &&
          (!price.max || booking.totalPrice <= parseFloat(price.max))
        );
      });
    }
    if (status) {
      filtered = filtered.filter((booking) => booking.bookingStatus === status);
    }
    setFilteredBookings(filtered);
  };

  const exportBookingsCSV = () => {
    const headers = ["User", "Movie", "Show Time", "Seats", "Price", "Status"];
    const rows = filteredBookings.map((b) => [
      b.user.fullName,
      b.movie.title,
      `${b.show.showDate} - ${b.show.showTime}`,
      b.seats.map((s) => s.seatNumber).join(", "),
      b.totalPrice,
      b.bookingStatus,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Revenue Functions
  const exportRevenueCSV = () => {
    const headers = ["Movie", "Total Revenue", "Total Bookings"];
    const rows = revenueData.map((item) => [
      item.movieTitle,
      item.totalRevenue,
      item.totalBookings,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "revenue.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Users Functions
  const handleUserSort = (key) => {
    let direction = "asc";
    if (userSortConfig.key === key && userSortConfig.direction === "asc") {
      direction = "desc";
    }
    setUserSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (userSortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[userSortConfig.key] < b[userSortConfig.key]) {
          return userSortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[userSortConfig.key] > b[userSortConfig.key]) {
          return userSortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, userSortConfig]);

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.phone?.includes(userSearchTerm)
  );

  const exportUsersCSV = () => {
    const headers = ["Full Name", "Email", "Phone", "Created At", "Updated At"];
    const rows = filteredUsers.map((user) => [
      user.fullName,
      user.email,
      user.phone,
      new Date(user.createdAt).toLocaleString(),
      new Date(user.updatedAt).toLocaleString(),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: "movies", label: "Movies" },
          { id: "bookings", label: "Bookings" },
          { id: "revenue", label: "Revenue" },
          { id: "users", label: "Users" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Movies Tab */}
      {activeTab === "movies" && (
        <div>
          {movieLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : movieError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {movieError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Movie Report</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search movies..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={movieSearchTerm}
                      onChange={(e) => setMovieSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchMovies}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportMoviesCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      <Download className="h-4 w-4" /> Export CSV
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleMovieSort("title")}
                      >
                        Title
                      </th>
                      <th className="p-3 text-left">Genre</th>
                      <th className="p-3 text-left">Language</th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleMovieSort("releaseDate")}
                      >
                        Release Date
                      </th>
                      <th className="p-3 text-left">Duration (min)</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovies.map((movie) => (
                      <tr key={movie._id} className="border-t hover:bg-gray-50">
                        <td className="p-3 flex items-center gap-2">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                          {movie.title}
                        </td>
                        <td className="p-3">{movie.genre}</td>
                        <td className="p-3">{movie.language}</td>
                        <td className="p-3">{formatDate(movie.releaseDate)}</td>
                        <td className="p-3">{movie.duration}</td>
                        <td className="p-3 flex justify-center gap-2">
                          <button className="p-1 text-blue-500">
                            <Eye size={18} />
                          </button>
                          <button className="p-1 text-yellow-500">
                            <Edit size={18} />
                          </button>
                          <button className="p-1 text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Movies: {filteredMovies.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Bookings Report</h2>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              className="border rounded p-2"
              placeholder="Search by movie title..."
              value={bookingSearchQuery}
              onChange={(e) => {
                setBookingSearchQuery(e.target.value);
                filterBookings(e.target.value, priceRange, statusFilter);
              }}
            />
            <input
              className="border rounded p-2"
              type="number"
              name="min"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => {
                setPriceRange({ ...priceRange, min: e.target.value });
                filterBookings(
                  bookingSearchQuery,
                  { ...priceRange, min: e.target.value },
                  statusFilter
                );
              }}
            />
            <input
              className="border rounded p-2"
              type="number"
              name="max"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => {
                setPriceRange({ ...priceRange, max: e.target.value });
                filterBookings(
                  bookingSearchQuery,
                  { ...priceRange, max: e.target.value },
                  statusFilter
                );
              }}
            />
            <select
              className="border rounded p-2"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                filterBookings(bookingSearchQuery, priceRange, e.target.value);
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              className="border rounded p-2 flex items-center bg-green-500 text-white"
              onClick={exportBookingsCSV}
            >
              <Download className="mr-2" size={16} /> Export CSV
            </button>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">User</th>
                <th className="border border-gray-300 p-2">Movie</th>
                <th className="border border-gray-300 p-2">Show Time</th>
                <th className="border border-gray-300 p-2">Seats</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">
                    {booking.user.fullName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {booking.movie.title}
                  </td>
                  <td className="border border-gray-300 p-2">{`${booking.show.showDate} - ${booking.show.showTime}`}</td>
                  <td className="border border-gray-300 p-2">
                    {booking.seats.map((s) => s.seatNumber).join(", ")}
                  </td>
                  <td className="border border-gray-300 p-2">
                    ${booking.totalPrice}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {booking.bookingStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === "revenue" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Revenue Report</h2>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              type="date"
              className="border p-2 rounded"
              value={revenueFilters.startDate}
              onChange={(e) =>
                setRevenueFilters({
                  ...revenueFilters,
                  startDate: e.target.value,
                })
              }
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={revenueFilters.endDate}
              onChange={(e) =>
                setRevenueFilters({
                  ...revenueFilters,
                  endDate: e.target.value,
                })
              }
            />
            <button
              className="border p-2 rounded flex items-center"
              onClick={fetchRevenue}
            >
              <Calendar className="mr-2" size={16} /> Filter
            </button>
            <button
              className="border p-2 rounded flex items-center bg-green-500 text-white"
              onClick={exportRevenueCSV}
            >
              <Download className="mr-2" size={16} /> Export CSV
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">
              Total Revenue: ${totalRevenue}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ReChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="movieTitle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalRevenue" fill="#4CAF50" />
            </ReChart>
          </ResponsiveContainer>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Movie</th>
                <th className="border p-2">Total Revenue</th>
                <th className="border p-2">Total Bookings</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((item) => (
                <tr key={item.movieTitle} className="border">
                  <td className="border p-2">{item.movieTitle}</td>
                  <td className="border p-2">${item.totalRevenue}</td>
                  <td className="border p-2">{item.totalBookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          {userLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : userError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {userError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">User Report</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchUsers}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportUsersCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      <Download className="h-4 w-4" /> Export CSV
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleUserSort("fullName")}
                      >
                        Full Name
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleUserSort("email")}
                      >
                        Email
                      </th>
                      <th className="p-3 text-left">Phone</th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleUserSort("createdAt")}
                      >
                        Created At
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleUserSort("updatedAt")}
                      >
                        Updated At
                      </th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{user.fullName}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.phone}</td>
                        <td className="p-3">{formatDate(user.createdAt)}</td>
                        <td className="p-3">{formatDate(user.updatedAt)}</td>
                        <td className="p-3 flex justify-center gap-2">
                          <button className="p-1 text-blue-500">
                            <Eye size={18} />
                          </button>
                          <button className="p-1 text-yellow-500">
                            <Edit size={18} />
                          </button>
                          <button className="p-1 text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Users: {filteredUsers.length}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
