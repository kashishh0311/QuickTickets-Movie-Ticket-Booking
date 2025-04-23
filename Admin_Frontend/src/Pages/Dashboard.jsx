import React, { useState, useEffect } from "react";
import {
  MdPeople,
  MdPersonAdd,
  MdConfirmationNumber,
  MdAccessTime,
  MdEventNote,
} from "react-icons/md";
import { BiCameraMovie } from "react-icons/bi";
import { FaChartLine, FaChartBar } from "react-icons/fa";
import axios from "axios";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tickets without authentication
        const ticketsResponse = await axios.get("/admin/getAdminAllBookings");
        setTickets(ticketsResponse.data.data.slice(0, 7) || []);

        // Fetch dashboard stats without authentication
        const statsResponse = await axios.get("/admin/getDashboardStats");
        setStats(statsResponse.data.data);
      } catch (err) {
        // Enhanced error handling
        if (err.response?.status === 500) {
          setError("Server error occurred. Please try again later.");
        } else {
          setError("Failed to load data: " + err.message);
        }
        setTickets([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statItems = [
    {
      icon: <MdPeople className="text-blue-400 text-3xl" />,
      title: "Total Users",
      value: stats?.totalUsers || "Loading...",
      color: "bg-blue-50",
    },
    {
      icon: <MdPersonAdd className="text-orange-400 text-3xl" />,
      title: "New Users",
      value: stats?.newUsers || "Loading...",
      color: "bg-orange-50",
    },
    {
      icon: <MdConfirmationNumber className="text-green-400 text-3xl" />,
      title: "Tickets Sold",
      value: stats?.ticketsSold || "Loading...",
      color: "bg-green-50",
    },
    {
      icon: <BiCameraMovie className="text-yellow-400 text-3xl" />,
      title: "Movies Showing",
      value: stats?.moviesShowing || "Loading...",
      color: "bg-yellow-50",
    },
    {
      icon: <MdAccessTime className="text-red-400 text-3xl" />,
      title: "Pending Tickets",
      value: stats?.pendingTickets || "0",
      color: "bg-red-50",
    },
    {
      icon: <FaChartLine className="text-teal-400 text-3xl" />,
      title: "Revenue",
      value: stats?.revenue
        ? `₹${stats.revenue.toLocaleString()}`
        : "₹1,00,000",
      color: "bg-teal-50",
    },
    {
      icon: <FaChartBar className="text-purple-400 text-3xl" />,
      title: "Expenses",
      value: stats?.expenses
        ? `₹${stats.expenses.toLocaleString()}`
        : "Loading...",
      color: "bg-purple-50",
    },
    {
      icon: <MdEventNote className="text-pink-400 text-3xl" />,
      title: "Other Activities",
      value: stats?.otherActivities || "Loading...",
      color: "bg-pink-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-light text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview as of {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-6 rounded-lg border border-gray-200 flex items-center`}
          >
            {stat.icon}
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                {stat.title}
              </h2>
              <p className="text-xl font-semibold text-gray-800">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-light text-gray-800 mb-6">
          Recent Tickets
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center border border-red-200">
            {error}
          </div>
        ) : tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket) => {
              const showtime = `${ticket.show.time}, ${new Date(
                ticket.show.date
              ).toDateString()}`;
              const selectedSeats = ticket.seats
                .map((seat) => seat.seatNumber)
                .join(", ");
              return (
                <div
                  key={ticket._id}
                  className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col sm:flex-row"
                >
                  <div className="sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {ticket.movie.title}
                    </h3>
                    <p className="text-xs text-gray-500">Movie Ticket</p>
                  </div>
                  <div className="sm:w-2/3 p-4 text-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Showtime</p>
                        <p className="text-sm font-medium">{showtime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Seats</p>
                        <p className="text-sm font-medium">{selectedSeats}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Paid</p>
                        <p className="text-sm font-medium">
                          ₹{ticket.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ticket ID</p>
                        <p className="text-sm font-medium">{ticket._id}</p>
                      </div>
                    </div>
                    <p
                      className={`text-xs mt-4 text-center sm:text-left ${
                        ticket.bookingStatus === "confirmed" // Change from ticket.status
                          ? "text-green-600"
                          : ticket.bookingStatus === "pending" // Change from ticket.status
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      Status: {ticket.bookingStatus || "confirmed"}{" "}
                      {/* Change from ticket.status */}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-600 border border-gray-200">
            <p className="text-lg font-light">No recent tickets available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
