import React, { useEffect, useState } from "react";
import { FaSearch, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { BsBuildingsFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // closes the mobile menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      //  breakpoint "lg" is 1024px in tailwond
      if (window.innerWidth > 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-black shadow-[0_2px_8px_rgba(255,255,0,0.7)]">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-2">
        {/* Logo */}
        <div
          className="font-bold text-xl sm:text-2xl flex flex-wrap gap-2 items-center cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <BsBuildingsFill className="text-yellow-300 text-lg sm:text-xl" />
          <span className="text-yellow-300 text-lg sm:text-3xl">
            Urban Living
          </span>
        </div>

        {/* Search */}
        <form
          onSubmit={handleOnSubmit}
          className="bg-gray-50 p-2 m-1 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search...."
            className="bg-transparent focus:outline-none w-18 sm:w-70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
          <button>
            <FaSearch className="text-slate-600 cursor-pointer" />
          </button>
        </form>

        {/* Desktop Menu */}
        <ul className="font-bold flex items-center text-white gap-8 ">
          <li
            className="hidden lg:inline  hover:text-yellow-300  cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </li>
          <li
            className="hidden lg:inline  hover:text-yellow-300 cursor-pointer"
            onClick={() => {
              navigate("/my-listings");
            }}
          >
            My Listings
          </li>
          <li
            className="hidden lg:inline  hover:text-yellow-300  cursor-pointer"
            onClick={() => {
              navigate("/about");
            }}
          >
            About
          </li>

          {currentUser ? (
            <li>
              <button
                type="button"
                onClick={() => navigate("/user-profile")}
                className=" hidden lg:inline bg-transparent border-none cursor-pointer"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-yellow-300">
                  <span className="text-2xl font-semibold text-black">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
            </li>
          ) : (
            <li
              className="hidden lg:inline hover:text-yellow-300  cursor-pointer"
              onClick={() => {
                navigate("/signIn");
              }}
            >
              Sign In
            </li>
          )}
        </ul>
        {/* Mobile Menu button */}
        <button
          className="lg:hidden text-yellow-300 text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-14 right-2 bg-white text-black font-bold rounded-lg shadow-lg p-4 flex flex-col gap-3 w-40 z-50 items-center">
            <button
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
            >
              Home
            </button>
            <button
              className="cursor-pointer"
              onClick={() => {
                navigate("/my-listings");
                setMenuOpen(false);
              }}
            >
              My Listings
            </button>
            <button
              className="cursor-pointer"
              onClick={() => {
                navigate("/about");
                setMenuOpen(false);
              }}
            >
              About
            </button>
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  navigate("/user-profile");
                  setMenuOpen(false);
                }}
                className="flex gap-2 items-center cursor-pointer"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black">
                  <span className="text-xl font-semibold text-white">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p> profile</p>
              </button>
            ) : (
              <button
                className="cursor-pointer"
                onClick={() => {
                  navigate("/signIn");
                  setMenuOpen(false);
                }}
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
