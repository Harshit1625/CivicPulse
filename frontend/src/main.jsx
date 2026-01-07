import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/apollo.js";
import Navbar from "./components/Navbar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </AuthContextProvider>
  </StrictMode>
);
