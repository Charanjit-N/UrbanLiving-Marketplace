import React from "react";
import { Link } from "react-router-dom";
import { IoPeople, IoLocationSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
export default function ApartmentItem({ listing }) {
  return (
    <div className="bg-white shadow-md overflow-hidden rounded-lg w-full sm:w-[330px] hover:scale-105 transition-scale duration-200">
      
      <Link to={`/apartment-pg/${listing._id}`}>
        <img
          className="h-[320px] sm:h-[220px] w-full object-cover"
          src={listing.imageInfo[0].url}
          alt="cover image"
        ></img>

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold ">
            {listing.name}
          </p>

          <div className="flex items-center gap-1">
            <IoLocationSharp className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>

          <p className="text-green-700 font-semibold ">
            ₹{" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-IN")
              : listing.regularPrice.toLocaleString("en-IN")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex gap-6">
            <div className="font-semibold">
              {listing.category === "apartment" ? (
                <div className="flex gap-2 items-center">
                  <FaHome className="text-lg" /> {listing.bhk} BHK
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <IoPeople className="text-lg" /> {listing.sharing} sharing
                </div>
              )}
            </div>
            <p className="font-semibold">
              {listing.category === "apartment" ? "Flat : " : "Room : "}{" "}
              <span className="text-gray-500">{listing.apartmentNumber}</span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
