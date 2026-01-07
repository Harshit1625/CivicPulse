import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import AdminDashboard from "./pages/AdminDashboard";
import { AdminRoute, UserRoute } from "./routes/ProtectedRoutes";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import CompleteProfile from "./pages/CompleteProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route
            path="/home"
            element={
              <UserRoute>
                <UserHome />
              </UserRoute>
            }
          ></Route>

          <Route path="/complete-profile" element={<CompleteProfile />}></Route>

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard></AdminDashboard>
              </AdminRoute>
            }
          ></Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
