import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar>
        <div className="min-h-[80vh] flex items-center justify-center text-black px-6">
          <div className="max-w-xl w-full text-center">
            {/* Big 404 */}
            <h1 className="text-[120px] font-extrabold leading-none text-teal-800">
              404
            </h1>

            {/* Title */}
            <h2 className="text-2xl font-semibold mt-4">Page not found</h2>

            {/* Description */}
            <p className="text-slate-800 mt-3">
              The page you’re looking for doesn’t exist or may have been moved.
            </p>

            {/* Divider */}
            <div className="h-px w-24 bg-teal-800 mx-auto my-6 opacity-70" />

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => navigate("/home")}
                className="px-5 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white transition font-medium"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </Navbar>
    </>
  );
}
