import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";

export default function UserProfile() {
  const navigate = useNavigate();
  const { currentUser, loadingAction, error } = useSelector(
    (state) => state.user
  );
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleOnDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/");
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleOnSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/user/logout");
      const data = res.json();
      if (!res.ok) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
      navigate("/");
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto mb-30">
      <h1 className="text-3xl font-semibold text-center my-5">Profile</h1>

      <div className="flex justify-center">
        <FaUserCircle className="w-20 h-20 mb-6" />
      </div>

      <div className=" flex justify-center mb-7 gap-7">
        <Link
          className="bg-blue-500 text-white p-2 rounded-lg  text-center hover:opacity-90"
          to="/new-listing"
        >
          New Listing
        </Link>

        <Link
          className="bg-blue-500 text-white p-2 rounded-lg text-center hover:opacity-90"
          to="/my-listings"
        >
          My Listings
        </Link>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg "
          id="username"
          onChange={handleOnChange}
        ></input>

        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleOnChange}
        ></input>

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleOnChange}
        ></input>

        <button
          disabled={loadingAction !== null} // Disable if any action is loading
          className="bg-slate-700 text-white rounded-lg p-3 cursor-pointer hover:opacity-90 "
        >
          {loadingAction === "update" ? "Updating..." : "Update"}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <button
          className="bg-red-500 cursor-pointer text-white p-2 rounded-lg text-center hover:opacity-90 "
          onClick={handleOnDeleteUser}
          disabled={loadingAction !== null} // Disable if any action is loading
        >
          {loadingAction === "delete" ? "Deleting..." : "Delete account"}
        </button>

        <button
          className="bg-red-500 cursor-pointer  text-white p-2 rounded-lg text-center hover:opacity-90"
          onClick={handleOnSignOut}
        >
          SignOut
        </button>
      </div>
      <div className="flex justify-center">
        <p className="text-red-700 mt-5">{error ? error : " "}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess ? "user updated successfully" : ""}
        </p>
      </div>
    </div>
  );
}
