import React, { useState } from "react"; // 1. Import useState
import { NavLink, Outlet } from "react-router"; // Note: Usually imported from 'react-router-dom'

import logo from "/icons/logo.svg";
import dash from "/icons/dash.svg";
import cart from "/icons/cart.svg";


function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const linkClasses =
    "py-3 px-4 hover:bg-[#7DD08D]/30 flex items-center transition-colors";

  const activeLinkClasses = "bg-[#7DD08D]/40";

  return (
    <section className="flex h-screen bg-gray-100 relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDENAV */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } 
          md:relative md:translate-x-0 
          w-60 h-full bg-[#2F9E44] text-white 
          transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex items-center h-20 mt-7 p-2 w-full gap-3 overflow-hidden">
          <img src={logo} alt="Cylinder Track Logo" className="w-14" />
          <p className="text-2xl font-semibold">Cylinder Track</p>
        </div>
        <hr className="ml-2 mr-2 border-green-200/50 mt-8" />

        {/* Side nav items */}
        <nav className="flex flex-col mt-4">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <img src={dash} alt="" className="w-7" />
            <p className="ml-2 text-xl">Dashboard</p>
          </NavLink>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <div className="w-12 -ml-3 flex justify-center">
              <img src={cart} alt="" className="w-full" />
            </div>
            <p className="-ml-1 text-xl">Orders</p>
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto p-8">
        {/* Hamburger Menu */}
        <button
          className="md:hidden p-2 rounded-md text-gray-800"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-4 6h4"
            />
          </svg>
        </button>

        {/*main content*/}
        <section>
          <Outlet />
        </section>
      </main>
    </section>
  );
}

export default Layout;
