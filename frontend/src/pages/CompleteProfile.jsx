import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { themes } from "../utils/theme";
import Loader from "../components/miniComponents/Loader";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";

const CompleteProfile = () => {
  const { profile, refetch, profileLoading } = useAuth();
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  //keeping profile and nav in dependency because react advises to put it there
  
  useEffect(() => {
    if (profileLoading) return;

    if (profile?.name && profile?.city) {
      console.log(profile?.name);
      nav("/home");
    }
  }, [profileLoading, profile, nav]);

  const isFormInvalid = !city || !fname || !lname;

  function validateCapitalLetter(value) {
    console.log(value);
    const firstChar = value.trim().charAt(0);

    if (firstChar != value[0].toUpperCase()) {
      return "First letter must be in capital in all the fields";
    }

    return "";
  }

  function showError(error) {
    setError(error);

    setTimeout(() => {
      setError("");
    }, 3000);
  }

  async function handleSubmit() {
    setLoading(true);
    if (!fname || !lname || !city) {
      setLoading(false);
      showError("Please fill all the fields!");
      return;
    }
    if (
      validateCapitalLetter(fname) ||
      validateCapitalLetter(lname) ||
      validateCapitalLetter(city)
    ) {
      return "First letter must be in capital in all the fields.";
    }

    const name = `${fname} ${lname}`;
    const { error } = await supabase
      .from("profiles")
      .update({ name, city })
      .eq("id", profile.id);

    if (error) {
      showError(error);
      return;
    }

    await refetch();
  }

  return (
    <>
      <Navbar>
        <div className="flex items-center justify-center min-h-[90vh] px-4">
          {/* Main wrapper */}
          <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-xl rounded-lg overflow-hidden">
            {/* Image section */}
            <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
              <img
                src="/main.jpg"
                alt="preview"
                className="w-full min-w-lg h-auto object-contain"
              />
            </div>

            {/* Form + curved edge section */}
            <div className="w-full md:w-3/4 curved-edge flex justify-center p-4 text-white">
              {/* Inner form container */}
              <div className="w-full max-w-lg flex flex-col lg:pl-10 md:pl-10 justify-center items-center gap-1">
                <h1 className="text-4xl font-semibold mb-4">
                  Complete Your Profile
                </h1>

                {/* Error box */}
                {error && (
                  <div
                    className="
                w-2/3 px-4 py-2 text-sm
                rounded-md
                bg-red-600/40 text-red-100
                border border-red-800 border-dashed
                transition-all duration-300 ease-out
                animate-slideFade
              "
                  >
                    {error}
                  </div>
                )}

                {/* Name */}
                <input
                  value={fname}
                  className={themes.authenticationInput.input}
                  placeholder="Enter your first name"
                  onChange={(e) => setfName(e.target.value)}
                  onBlur={(e) => {
                    const error = validateCapitalLetter(e.target.value);
                    if (error) showError(error);
                  }}
                />

                <input
                  value={lname}
                  className={themes.authenticationInput.input}
                  placeholder="Enter your last name"
                  onChange={(e) => setlName(e.target.value)}
                  onBlur={(e) => {
                    const error = validateCapitalLetter(e.target.value);
                    if (error) showError(error);
                  }}
                />

                {/* City */}
                <input
                  value={city}
                  className={themes.authenticationInput.input}
                  placeholder="Enter your city"
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={(e) => {
                    const error = validateCapitalLetter(e.target.value);
                    if (error) showError(error);
                  }}
                />

                {/* Button */}
                <button
                  className={`
                py-2 w-1/2 rounded font-semibold transition mt-1
                ${
                  isFormInvalid
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:opacity-90 border border-teal-800"
                }
              `}
                  onClick={handleSubmit}
                  disabled={isFormInvalid}
                >
                  {loading ? (
                    <div className="flex flex-row gap-1">
                      <Loader />
                      Submitting
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default CompleteProfile;
