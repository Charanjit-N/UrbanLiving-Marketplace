import React from "react";
import {
  FaGithub ,
  FaLinkedin ,
  FaInstagram ,
} from "react-icons/fa";

export default function About() {
  return (
    <div className='py-20 px-4 max-w-7xl mx-auto'>
      <h1 className="text-3xl font-bold mb-4 ">
        About Us
      </h1>
      <p className="mb-4 text-gray-600">
        Welcome to Urban Living, your dedicated online platform for
        discovering the perfect home. We specialize in simplifying the search
        for Apartments and PGs, whether you are looking to rent or buy. Our mission
        is to make finding your next home a simple, efficient, and stress-free
        experience.
      </p>

      <p className="mb-4 text-gray-600">
        Our goal is to empower you in your property search by providing a
        comprehensive and user-friendly platform. We connect you with a wide
        range of listings, from rental flats and properties for sale to
        comfortable PGs in various neighborhoods. Whether you're a student
        searching for your first PG, a professional looking for a rental
        apartment, or a family ready to purchase a home, we are here to support
        you at every stage of your journey.
      </p>

      <p className="mb-4 text-gray-600">
        We believe that the search for a new home should be an exciting and
        hopeful time. Our commitment is to provide you with detailed, reliable
        listings and the tools you need to make an informed decision. At Urban Living, we are dedicated to helping you easily and confidently
        find a place you can truly call home.
      </p>

     
      <div className =" flex mt-10 flex-col sm:flex-row">
          <h2 className="text-xl font-bold mb-2">
            <span className="text-black">Charanjit Nandigama &nbsp; : &nbsp; </span>
          </h2>
          <div className="flex items-center space-x-4">
            <a
              target="_blank"
              href="https://www.linkedin.com/in/charanjit-nandigama-a67601324/"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaLinkedin  className="w-6 h-6 mr-1" />
              LinkedIn
            </a>
            <a
              target="_blank"
              href="https://github.com/Charanjit-N"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaGithub  className="w-6 h-6 mr-1" />
              GitHub
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/charanjit.n_11/"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaInstagram  className="w-6 h-6 mr-1" />
              Instagram
            </a>
          </div>
      </div>
    </div>
  );
}
