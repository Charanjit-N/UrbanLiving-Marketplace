import React, {useState, useEffect} from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const ServerWakeUpScreen = () => (
  <div className="bg-gray-900 text-white font-mono p-4 text-center flex flex-col items-center justify-center min-h-screen">
    <p className="text-yellow-400 text-2xl uppercase animate-pulse">
      Connecting  to the Server....
    </p>
    <p className="text-gray-400 text-xl mt-2">
      Please wait for a minute while the service wakes up.
    </p>
  </div>
);

export default function MainNavigation() {
  const [serverStatus, setServerStatus] = useState("initializing");

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" }); 
        if (res.ok) {
          setServerStatus("ready");
          return true;
        }
      } catch {}
      return false;
    };

    checkServerHealth().then((isReady) => {
      if (!isReady) {
        setServerStatus("pending"); 
        const intervalId = setInterval(async () => {
          const ready = await checkServerHealth();
          if (ready) clearInterval(intervalId);
        }, 5000);
        return () => clearInterval(intervalId);
      }
    });
  }, []);

  if (serverStatus === "initializing") {
    return null;
  }

  if (serverStatus === "pending") {
    return <ServerWakeUpScreen />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

