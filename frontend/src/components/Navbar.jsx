import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import toast, { Toaster } from "react-hot-toast";

const Navbar = ({ children }) => {
  const { session , profile } = useAuth();
  const nav = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed !");
    } else {
      toast.success("Logout done!");
    }
    nav("/login");
  }

  return (
    <>
      {/* Navbar */}
      <div className="flex flex-col h-screen justify-between ">
        <div className="flex p-5 bg-teal-900 justify-between items-center">
          <div className=" h-10 w-25">
            <img className="object-contain" src="./logo.png" />
          </div>
          {session && (
            <button
              onClick={handleLogout}
              className="text-[1.5rem] bg-red-600 px-3 py-1 text-white font-semibold rounded"
            >
              Logout
            </button>
          )}
        </div>
        {/* Content */}
        <div>{children}</div>;{/* Footer */}
        <div className="flex p-14 items-center justify-center bg-teal-900 text-white">
          <h4 className="font-semibold">
            CivivPulse 2026. All rights reserved
          </h4>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Navbar;
