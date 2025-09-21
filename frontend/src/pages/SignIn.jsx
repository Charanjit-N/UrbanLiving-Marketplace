import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure,clearError } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loadingAction, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.error));
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto mb-60">
      <h1 className="text-3xl text-center font semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleOnSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <div className="mb-4 flex">
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg w-full"
            id="password"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loadingAction != null}
          className="bg-yellow-300 cursor-pointer text-black p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loadingAction === 'sigin' ? "Signing in..." : "Sign in"}
        </button>
        
        <OAuth></OAuth>
      
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account ? </p>
        <span
          className="text-blue-700 cursor-pointer"
          onClick={() => {
            navigate("/signUp");
          }}
        >
          Sign up
        </span>
      </div>
      
      {error && <div className ="text-center"><p className='text-red-500 mt-5'>{error}</p> </div>}
    </div>
  );
}
