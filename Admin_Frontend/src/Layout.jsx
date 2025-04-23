// import React from "react";
// import { Outlet } from "react-router-dom";
// import Header from "./Components/Header";
// import Footer from "./Components/Footer";

// function Layout() {
//   return (
//     <>
//       <Header />
//       <Outlet />
//       <Footer />
//     </>
//   );
// }

// export default Layout;
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Compo/Header";
import Footer from "./Compo/Footer";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
