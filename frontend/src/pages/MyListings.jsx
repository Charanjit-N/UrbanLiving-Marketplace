import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function MyListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/signIn");
      return; 
    }

    const fetchUserListings = async () => {
      try {
        setLoading(true);
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          setLoading(false);
          return;
        }
        setUserListings(data);
        setLoading(false);
      } catch (err) {
        setShowListingsError(true);
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [currentUser, navigate]);

  const handleListingDelete = async (listingId) => {
    setDeletingId(listingId);
    try {
      const listingToDelete = userListings.find(
        (listing) => listing._id === listingId
      );
      if (!listingToDelete) {
        console.error("Could not find the listing to delete.");
        return;
      }

      const res = await fetch(`/api/flat-pg/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      // If DB deletion is successful, delete the images from Cloudinary
      const publicIdsToDelete = listingToDelete.imageInfo.map(
        (img) => img.public_id
      );

      if (publicIdsToDelete.length > 0) {
        await fetch("/api/deleteImageFromCloudinary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_ids: publicIdsToDelete }),
        });
      }

      // Update the UI to remove the listing
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.log(err.message);
    }finally {
    setDeletingId(null);
  }
  };

  return (
    <div className="p-3 mb-70 max-w-lg mx-auto">
      {loading && <p className="text-center my-7">Loading listings...</p>}
      {showListingsError && (
        <p className="text-red-700 text-center my-7">Error showing listings</p>
      )}
      {userListings && userListings.length === 0 && (
        <div className="flex flex-col items-center mt-40 gap-8">
          <h1 className="text-center text-3xl font-semibold">
            You have no listings
          </h1>
          <Link
            className="bg-blue-500 text-white p-2 rounded-lg  text-center hover:opacity-90"
            to="/new-listing"
          >
            Create New One
          </Link>
        </div>
      )}

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="mt-7 flex justify-between items-center">
            <h1 className="text-center text-3xl font-semibold">My Listings</h1>
            <Link
              className="flex items-center justify-center bg-blue-500 text-white rounded-lg h-7 mt-2 px-2 hover:opacity-90"
              to="/new-listing"
            >
              Create Listing
            </Link>
          </div>

          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/apartment-pg/${listing._id}`}>
                <img
                  src={listing.imageInfo[0].url}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/apartment-pg/${listing._id}`}
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 cursor-pointer">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 cursor-pointer"
                  disabled={deletingId === listing._id}
                >
                  {deletingId === listing._id ? "deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
