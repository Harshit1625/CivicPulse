import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { themes } from "../utils/theme";
import Loader from "../components/miniComponents/Loader";
import Navbar from "../components/Navbar";

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  /* ---------- Validation ---------- */

  function validateEmail(value) {
    if (!value) return "REQUIRED";
    if (!value.endsWith("@gmail.com")) return "Email must end with @gmail.com";
    return "";
  }

  function validatePassword(value) {
    if (!value) return "REQUIRED";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  function normalizeError(message) {
    if (message === "REQUIRED") {
      return "Entering all fields is required";
    }
    return message;
  }

  /* ---------- Error display helper ---------- */

  function showError(message) {
    setError(message);

    setTimeout(() => {
      setError("");
    }, 5500);
  }

  /* ---------- Form state ---------- */

  const isFormInvalid =
    !email || !password || fieldErrors.email || fieldErrors.password;

  /* ---------- Submit ---------- */

  async function handleLogin() {
    setLoading(true);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      showError(normalizeError(emailError || passwordError));
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      showError(authError.message);
    } else {
      nav("/home");
    }
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
              <div className="w-full max-w-lg flex flex-col lg:pl-[40px] md:pl-[40px] justify-center items-center gap-1">
                <h1 className="text-4xl font-semibold mb-4">Login</h1>

                {/* Error box */}
                {(err || fieldErrors.email || fieldErrors.password) && (
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
                    {err
                      ? err
                      : fieldErrors.email
                      ? fieldErrors.email
                      : fieldErrors.password}
                  </div>
                )}

                {/* Email */}
                <input
                  value={email}
                  className={themes.authenticationInput.input}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() =>
                    setFieldErrors((prev) => ({
                      ...prev,
                      email: normalizeError(validateEmail(email)),
                    }))
                  }
                />

                {/* Password */}
                <input
                  value={password}
                  type="password"
                  className={themes.authenticationInput.input}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() =>
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: normalizeError(validatePassword(password)),
                    }))
                  }
                />

                <span className="cursor-pointer">
                  New Here?
                  <button onClick={()=> nav("/signup")} className="pl-2 text-teal-600 font-semibold cursor-pointer">Create you account!</button>
                </span>

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
                  onClick={handleLogin}
                  disabled={isFormInvalid}
                >
                  {loading ? (
                    <div className="flex flex-row gap-1">
                      <Loader />
                      Logging In
                    </div>
                  ) : (
                    "Login"
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

export default Login;
