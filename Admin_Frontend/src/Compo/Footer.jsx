// import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <div className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          {/* Left side - Logo and Description */}
          <div className="mb-6 md:mb-0">
            <a
              href="#"
              className="flex items-center text-teal-500 text-3xl font-semibold"
            >
              <svg
                className="fill-current h-8 w-8 mr-2"
                width="54"
                height="54"
                viewBox="0 0 54 54"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5 22.1c1.2-7.2 6.3-12.1 13.3-12.1 7 0 12.1 4.9 13.3 12.1 1.2 7.2-6.3 12.1-13.3 12.1-7 0-12.1-4.9-13.3-12.1zM24 20.1v-2.1c-1.5-1.3-3.5-2.2-5.7-2.2-2.2 0-4.2.9-5.7 2.2v2.1c-1.1.9-1.8 2.2-1.8 3.7 0 1.5.7 2.8 1.8 3.7v5.1c0 .8.7 1.5 1.5 1.5h10c.8 0 1.5-.7 1.5-1.5v-5.1c1.1-.9 1.8-2.2 1.8-3.7 0-1.5-.7-2.8-1.8-3.7z"
                  fill="#FFF"
                />
              </svg>
              QuickTickets
            </a>
            <p className="text-gray-400 text-sm mt-2">
              Book your movie tickets easily online. Watch your favorite movies
              anytime, anywhere!
            </p>
          </div>

          {/* Center - Links Section */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="text-lg font-semibold text-teal-500">
                Quick Links
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-teal-500">Follow Us</h3>
              <div className="mt-2 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                >
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CineBooking. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
