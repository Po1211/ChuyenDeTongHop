import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import GenreSelection from "./pages/GenreSelection";
import Home from "./pages/Home";
import GenreFantasy from "./pages/GenreFantasy";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/genreSelection" element={<GenreSelection />} />
      <Route path="/home" element={<Home />} />
      <Route path="/genrefantasy" element={<GenreFantasy />} />
    </Routes>
  );
}
