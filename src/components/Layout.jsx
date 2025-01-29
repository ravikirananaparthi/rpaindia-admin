// Layout.jsx
import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar component contains both sidebar and top header */}
      <Navbar />

      {/* Main content wrapper - matches your navbar's lg:pl-28 */}
      <div className="lg:pl-28">
        {/* Add top padding to account for the fixed header height (h-16) */}
        <main className="pt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
