import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes.jsx";
import { seedLocalhubData } from "./utils/storage.js";

export default function App() {
  useEffect(() => {
    seedLocalhubData();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
