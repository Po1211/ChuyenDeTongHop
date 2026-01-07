import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import GenreSelection from "./pages/GenreSelection";
import Home from "./pages/Home";
import Genre from "./pages/Genre";
import Profile from "./pages/Profile";
import MyBooks from "./pages/MyBooks";
import BookDetails from "./pages/BookDetails";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/genreSelection" element={<GenreSelection />} />
      <Route path="/home" element={<Home />} />
      <Route path="/genre" element={<Genre />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/mybooks" element={<MyBooks />} />
      <Route path="/bookdetails/:id" element={<BookDetails />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
