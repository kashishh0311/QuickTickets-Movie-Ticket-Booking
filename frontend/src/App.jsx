import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./UserContext";
import Layout from "./Layout";
import MovieDetails from "./Pages/MovieDetails";
import MovieList from "./Pages/MovieList";
import Home from "./Pages/Home";
import Seat from "./Pages/Seat";
import BookingSuccess from "./Pages/BookingSummary";
import ProfilePage from "./Pages/Profile";
import Signup from "./Pages/Signup";
import Login from "./Pages/LoginPage";
import ForgotPassword from "./Pages/ForgotPassword";
import ErrorPage from "./Pages/Error";
import BookingConfirmation from "./Pages/Booking";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./Pages/resetPassword";
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movieList" element={<MovieList />} />
            <Route path="movie/:id" element={<MovieDetails />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />

            <Route
              path="signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="forgot"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            <Route
              path="seat/:id"
              element={
                // <ProtectedRoute>
                <Seat />
                // {/* </ProtectedRoute> */}
              }
            />

            <Route
              path="booking/:bookingId"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />

            <Route
              path="booking-Success"
              element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/booking-success/:bookingId"
              element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
