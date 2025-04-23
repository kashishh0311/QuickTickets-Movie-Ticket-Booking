import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import ManageMovies from "./Pages/Movies";
import AdminBookings from "./Pages/Bookings";
import Login from "../src/Pages/Login";
import AdminDashboard from "./Pages/Report";
import ManageShows from "./Pages/Show";
import SeatManagement from "./Pages/Seat";
import AllFeedback from "./Pages/feedback";
import ProtectedRoute from "./Compo/ProtectedRoutes";
import { AdminProvider } from "./AdminContext";
function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="/movie" element={<ManageMovies />} />
              <Route path="/booking" element={<AdminBookings />} />
              <Route path="/user" element={<Users />} />
              <Route path="/showTime" element={<ManageShows />} />
              <Route path="/seat" element={<SeatManagement />} />
              <Route path="/feedback" element={<AllFeedback />} />
              <Route path="/report" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}
export default App;
