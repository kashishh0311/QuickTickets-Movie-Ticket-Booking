// import React from "react";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// function Footer() {
//   return (
//     <div className="bg-gray-900 text-white py-10">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
//           <div className="mb-6 md:mb-0">
//             <a
//               href="/"
//               className="flex items-center text-teal-500 text-3xl font-semibold"
//             >
//               <svg
//                 className="fill-current h-8 w-8 mr-2"
//                 width="54"
//                 height="54"
//                 viewBox="0 0 54 54"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M13.5 22.1c1.2-7.2 6.3-12.1 13.3-12.1 7 0 12.1 4.9 13.3 12.1 1.2 7.2-6.3 12.1-13.3 12.1-7 0-12.1-4.9-13.3-12.1zM24 20.1v-2.1c-1.5-1.3-3.5-2.2-5.7-2.2-2.2 0-4.2.9-5.7 2.2v2.1c-1.1.9-1.8 2.2-1.8 3.7 0 1.5.7 2.8 1.8 3.7v5.1c0 .8.7 1.5 1.5 1.5h10c.8 0 1.5-.7 1.5-1.5v-5.1c1.1-.9 1.8-2.2 1.8-3.7 0-1.5-.7-2.8-1.8-3.7z"
//                   fill="#FFF"
//                 />
//               </svg>
//               QuickTickets
//             </a>
//             <p className="text-gray-400 text-sm mt-2">
//               Book your movie tickets easily online. Watch your favorite movies
//               anytime, anywhere!
//             </p>
//           </div>
//           <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
//             <div>
//               <h3 className="text-lg font-semibold text-teal-500">
//                 Quick Links
//               </h3>
//               <ul className="mt-2 space-y-2">
//                 <li>
//                   <a href="#" className="text-gray-400 hover:text-teal-500">
//                     About Us
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-gray-400 hover:text-teal-500">
//                     Contact
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-gray-400 hover:text-teal-500">
//                     Privacy Policy
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-gray-400 hover:text-teal-500">
//                     Terms & Conditions
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-teal-500">Follow Us</h3>
//               <div className="mt-2 flex space-x-4">
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-teal-500 transition-colors duration-300"
//                 >
//                   <FaFacebook className="h-6 w-6" />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-teal-500 transition-colors duration-300"
//                 >
//                   <FaTwitter className="h-6 w-6" />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-teal-500 transition-colors duration-300"
//                 >
//                   <FaInstagram className="h-6 w-6" />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-teal-500 transition-colors duration-300"
//                 >
//                   <FaLinkedin className="h-6 w-6" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="mt-10 text-center">
//           <p className="text-gray-400 text-sm">
//             © {new Date().getFullYear()} CineBooking. All Rights Reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Footer;
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  // Toastify configuration for custom popups
  const toastOptions = {
    position: "top-center",
    autoClose: false,
    closeOnClick: false,
    draggable: false,
    closeButton: false,
    className:
      "bg-white text-gray-800 p-4 rounded-lg shadow-lg max-w-xl w-full",
  };

  // Function to show toast with cancel button
  const showToast = (title, content) => {
    toast(
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="text-sm">{content}</div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => toast.dismiss()}
            className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 w-36"
          >
            Cancel
          </button>
        </div>
      </div>,
      toastOptions
    );
  };

  const showAboutUs = (e) => {
    e.preventDefault();
    showToast(
      "About Us",
      <div>
        <p>
          QuickTickets was launched in 2025 with a mission to simplify movie
          ticket booking. We aim to bring the cinema experience closer to you
          with a seamless online platform.
        </p>
        <p className="mt-2">
          Our team is dedicated to providing fast, reliable ticket booking
          services, ensuring you never miss your favorite films. From
          blockbusters to indie gems, we’ve got your seats covered.
        </p>
        <p className="mt-2">
          With QuickTickets, enjoy hassle-free booking, real-time seat
          selection, and instant confirmations—all from the comfort of your
          home.
        </p>
      </div>
    );
  };

  const showContact = (e) => {
    e.preventDefault();
    showToast(
      "Contact Us",
      <div>
        <p>Need assistance? Our support team is here for you!</p>
        <h4 className="font-semibold mt-2">Customer Support</h4>
        <p>Email: support@quicktickets.com</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Hours: 9 AM - 9 PM</p>
        <h4 className="font-semibold mt-2">Theater Partnerships</h4>
        <p>Email: partners@quicktickets.com</p>
      </div>
    );
  };

  const showPrivacyPolicy = (e) => {
    e.preventDefault();
    showToast(
      "Privacy Policy",
      <div>
        <p>
          At QuickTickets, your privacy matters. Here’s how we handle your data:
        </p>
        <h4 className="font-semibold mt-2">1. Information We Collect</h4>
        <p>
          We collect details like your name, email, and payment info to process
          bookings. We also track browsing data to enhance your experience.
        </p>
        <h4 className="font-semibold mt-2">2. How We Use It</h4>
        <p>
          Your info helps us confirm tickets, send updates, and improve our
          services. We don’t share it with third parties for marketing.
        </p>
        <h4 className="font-semibold mt-2">3. Security</h4>
        <p>
          We use encryption to protect your data, though no online system is
          100% secure.
        </p>
      </div>
    );
  };

  const showTermsConditions = (e) => {
    e.preventDefault();
    showToast(
      "Terms & Conditions",
      <div>
        <p>By using QuickTickets, you agree to these terms:</p>
        <h4 className="font-semibold mt-2">1. Booking</h4>
        <p>
          Tickets are non-refundable after confirmation unless the show is
          canceled. Provide accurate details for a smooth experience.
        </p>
        <h4 className="font-semibold mt-2">2. Payments</h4>
        <p>
          All payments are final once processed. We reserve the right to cancel
          bookings for suspicious activity.
        </p>
        <h4 className="font-semibold mt-2">3. User Conduct</h4>
        <p>Misuse of the platform may lead to account suspension.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white py-10">
      <ToastContainer />
      <div className="container mx-auto px-4">
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
                  <a
                    href="#"
                    onClick={showAboutUs}
                    className="text-gray-400 hover:text-teal-500 cursor-pointer"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={showContact}
                    className="text-gray-400 hover:text-teal-500 cursor-pointer"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={showPrivacyPolicy}
                    className="text-gray-400 hover:text-teal-500 cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={showTermsConditions}
                    className="text-gray-400 hover:text-teal-500 cursor-pointer"
                  >
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-teal-500">Follow Us</h3>
              <div className="mt-2 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/pvrcinemas_official/?hl=en"
                  className="text-gray-400 hover:text-blue-500"
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} QuickTickets. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
