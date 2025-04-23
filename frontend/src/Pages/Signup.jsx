import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...error };

    if (!value) {
      newErrors[name] = `Please enter your ${name}`;
    } else {
      delete newErrors[name];
    }

    if (name === "email" && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (name === "phone" && value) {
      if (!/^\d{10}$/.test(value)) {
        newErrors.phone = "Phone number must be 10 digits";
      }
    }

    if (name === "password" && value) {
      if (value.length < 6) {
        setPasswordStrength("Weak");
        newErrors.password = "Password must be at least 6 characters";
      } else if (value.length < 10) {
        setPasswordStrength("Moderate");
        delete newErrors.password;
      } else {
        setPasswordStrength("Strong");
        delete newErrors.password;
      }
    }

    if (name === "confirmPassword" && value !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setError(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `Please enter your ${field}`;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    validateField("email", formData.email);
    validateField("phone", formData.phone);
    validateField("password", formData.password);
    validateField("confirmPassword", formData.confirmPassword);

    setError({ ...error, ...newErrors });
    if (Object.keys({ ...error, ...newErrors }).length > 0) return;

    try {
      const response = await axios.post(
        "/user/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Equivalent to credentials: "include" in fetch
        }
      );

      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      setError({ api: errorMessage });
    }
  };

  const isFormInvalid =
    Object.keys(error).length > 0 ||
    Object.values(formData).some((value) => value === "");

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-8 py-8 shadow-lg w-1/3 rounded-lg bg-white">
        <h2 className="text-4xl font-bold text-gray-700 text-center mb-4">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2">
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                  type={
                    field.includes("password")
                      ? field === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : showConfirmPassword
                        ? "text"
                        : "password"
                      : field === "phone"
                      ? "tel"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  value={formData[field]}
                  name={field}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${field
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()}`}
                />
                {field === "password" && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
                {field === "confirmPassword" && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
              </div>

              {field === "password" && formData.password && (
                <p
                  className={`text-sm mt-1 ${
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Moderate"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}

              {error[field] && (
                <p className="text-red-500 text-sm">{error[field]}</p>
              )}
            </div>
          ))}

          {error.api && (
            <p className="text-red-500 text-sm text-center">{error.api}</p>
          )}

          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={isFormInvalid}
              className={`bg-teal-600 text-white px-4 py-2 rounded-md ${
                isFormInvalid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-teal-700 focus:ring-2 focus:ring-teal-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="flex mt-5 justify-between">
            <NavLink
              to="/login"
              className="font-semibold text-teal-600 hover:underline text-sm"
            >
              Already have an account? Login
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
