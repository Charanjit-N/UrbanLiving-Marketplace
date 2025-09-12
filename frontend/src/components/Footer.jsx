import React from "react";
import { FaLinkedin } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-yellow-200 shadow-md">
      <div className="w-full max-w-7xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/">
            <h1 className="font-bold text-sm sm:text-xl flex-wrap">
              <span className="text-slate-500">Find Your Flat</span>
            </h1>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-slate-500 sm:mb-0">
            <li>
              <a className="hover:text-slate-900 me-4 md:me-6" href="/">
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900 me-4 md:me-6" href="/my-listings">
                My Listings
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900 me-4 md:me-6" href="/about">
                About
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900 me-4 md:me-6" href="/signIn">
                Sign In
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900" href="/signUp">
                Sign Up
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-slate-400 sm:mx-auto lg:my-8"></hr>

        <div  className ="flex justify-center my-4r">
          <a
            target="_blank"
            href="https://www.linkedin.com/in/charanjit-nandigama-a67601324/"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <FaLinkedin className="w-6 h-6 mr-1" />
            Charanjit Nandigama
          </a>
        </div>
      </div>
    </footer>
  );
}
