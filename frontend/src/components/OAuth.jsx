import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/user/google", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
        }),
      });
      const data = await res.json();
       console.log('Data received from OAuth backend:', data);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log("could not sign in with google", err);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-white flex p-2 rounded-lg justify-center items-center gap-3 cursor-pointer border border-gray-200"
    >
      <FcGoogle />
      Continue with google
    </button>
  );
}
