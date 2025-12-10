import React from "react";
import { Navbar } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";

// IMPORT CONTEXT PROVIDER
import { AuthModalProvider } from "./context/AuthModalContext";

// IMPORT MODAL ITSELF
import LoginSignupModal from "./pages/LoginSignUpModal";
import AllEvents from "./pages/AllEvents";
import AdminDashBoard from "./pages/AdminDashBoard";

// 🔥 IMPORT REACT HOT TOAST
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import MyRegistrations from "./pages/MyRegistation";
import Scanner from "./pages/Scanner";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  return (
    <AuthModalProvider>
      {/* GLOBAL TOASTER */}
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar />

      {/* GLOBAL LOGIN/SIGNUP MODAL */}
      <LoginSignupModal />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path="/events" element={<AllEvents />} />
        <Route path="/registrations" element={<MyRegistrations />} />
        <Route path="/admin" element={<AdminDashBoard />} />
        <Route path="/admin/scanner" element={<Scanner />} />
        <Route path="*" element={<h2 className="p-10 text-center">404 - Page Not Found</h2>} />
      </Routes>

      <Footer />
    </AuthModalProvider>
  );
};

export default App;
