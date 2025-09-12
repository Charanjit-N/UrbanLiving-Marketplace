import React, { useEffect, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <header className="bg-yellow-100 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        <h1
          className="font-bold text-sm sm:text-xl flex flex-wrap cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <span className="text-black-500">Find Your Flat</span>
        </h1>

        <form className="bg-green-200 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          ></input>
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4 ">
          <li
            className="hidden sm:inline text-slate-700 hover:underline cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </li>
          <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
            My Listings
          </li>
          <li
            className="hidden sm:inline text-slate-700 hover:underline cursor-pointer"
            onClick={() => {
              navigate("/about");
            }}
          >
            About
          </li>

          {currentUser ? (
            <button
              type="button"
              onClick={() => navigate("/user-profile")}
              aria-label="View user profile" // Important for screen readers
              className="bg-transparent border-none cursor-pointer" // Resets default button styles
            >
              <FaUserCircle className="w-10 h-10" />
            </button>
          ) : (
            <li
              className=" text-slate-700 hover:underline cursor-pointer"
              onClick={() => {
                navigate("/signIn");
              }}
            >
              Sign In
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
