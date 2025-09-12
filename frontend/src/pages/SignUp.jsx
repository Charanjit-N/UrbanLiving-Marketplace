import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
   const [error,setError] = useState(null);
   const [loading,setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


  const handleOnSubmit= async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch("/api/user/signup",{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(formData),
      })
      const data = await res.json();
      
      if(!res.ok){ 
        setLoading(false)
        setError(data.error); 
      }else{
        setLoading(false)
        setError(null)
        navigate('/signIn');
      }
    }catch(err){
      setLoading(false)
      setError(err.message)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto mb-45">
      <h1 className="text-3xl text-center font semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}

        />
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

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "LOADING..." : "SIGN UP"}</button>
      
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account ?</p>
        <span
          className="text-blue-700 cursor-pointer"
          onClick={() => {
            navigate("/signIn");
          }}
        >
          Sign in
        </span>
      </div>
      {error && <div className ="text-center"><p className='text-red-500 mt-5'>{error}</p> </div>}
    </div>
  );
}
