import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./ManageUsers.css"; // Create this CSS file

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users from backend on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/admin/getAllUsers");
        setUsers(response.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user removal initiation
  const handleRemove = (id) => {
    if (!id) {
      toast.error("Cannot remove user: ID is missing");
      return;
    }
    setUserToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Confirm user deletion
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await axios.delete(`/admin/removeUser/${userToDelete}`);
      toast.success("User removed successfully!");
      setUsers(users.filter((user) => user._id !== userToDelete));
      setError(null);
    } catch (err) {
      console.error("Delete error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to remove user");
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">👥 Manage Users</h2>

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
              Do you really want to remove this user? This action cannot be
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-700">
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <p className="text-center text-xl text-gray-600">Loading users...</p>
      )}

      {/* User List - Side by Side Cards */}
      {!loading && !error && users.length === 0 && (
        <p className="text-center text-gray-600">No users found.</p>
      )}
      {!loading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user._id || user.id} // Fallback to id if _id isn’t present
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
                {user.fullName ? user.fullName.charAt(0) : "?"}
              </div>
              <h3 className="text-xl font-semibold mt-3">
                {user.fullName || "Unknown User"}
              </h3>
              <p className="text-gray-600">{user.email || "No email"}</p>
              <p className="text-gray-600">{user.phone || "No phone"}</p>
              <span
                className={`px-3 py-1 mt-2 text-sm font-semibold rounded-full ${
                  user.active
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {user.active ? "Active" : "Inactive"}
              </span>
              <p className="mt-2 text-gray-700 font-semibold">Role: {"User"}</p>
              <button
                onClick={() => handleRemove(user._id || user.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition-all duration-200"
              >
                Remove User
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
