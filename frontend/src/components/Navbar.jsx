import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";
import {
  Menu,
  X,
  Calendar,
  Ticket,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Home,
} from "lucide-react";
import gsap from "gsap";
import { useAuthModal } from "../context/AuthModalContext";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const navRef = useRef(null);
   const {user,logout} = useAuth();

  const location = useLocation();
  const { openLogin, openSignup } = useAuthModal();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    gsap.to(mobileMenuRef.current, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: 0.3,
      ease: "power3.out",
    });
  }, [open]);


  useEffect(() => {
    // Run this only on HOME PAGE
    if (location.pathname !== "/") {
      // Set default navbar style for other pages
      gsap.to(navRef.current, {
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        duration: 0.1,
      });
      return; // STOP here → don't add scroll listener
    }

    // Home page scroll effect
    const handleScroll = () => {
      if (window.scrollY > 0) {
        gsap.to(navRef.current, {
          backgroundColor: "white",
          color: "black",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          duration: 0.3,
        });
      } else {
        gsap.to(navRef.current, {
          backgroundColor: "transparent",
          color: "white",
          boxShadow: "none",
          duration: 0.3,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);


  return (
    <nav ref={navRef} className="fixed top-0 w-full z-50">

      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="text-3xl font-extrabold tracking-tight">
         <img src={logo} alt="Logo" className="w-16 h-16 rounded-full inline-block mr-2"/>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 items-center font-medium">

          {!isAdmin ? (
            <>

              <Link to="/" className="hover:text-red-500 flex items-center gap-1">
                <Home size={18} /> Home
              </Link>


              <Link to="/events" className="hover:text-red-500 flex items-center gap-1">
                <Calendar size={18} /> Events
              </Link>

              <Link to="/registrations" className="hover:text-red-500 flex items-center gap-1">
                <Ticket size={18} /> My Registrations
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin" className="hover:text-red-500 flex items-center gap-1">
                <Calendar size={18} /> Admin Panel
              </Link>
            </>
          )}

          {/* AUTH BUTTONS */}
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-1 hover:text-red-500">
                <User size={18} /> Profile
              </Link>

              <button onClick={logout} className="flex items-center gap-1 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="flex items-center gap-1 px-4 py-1 rounded-full border border-white/50 backdrop-blur-sm hover:bg-white hover:text-black transition"
              >
                <LogIn size={18} /> Login
              </button>

              <button
                onClick={openSignup}
                className="flex items-center gap-1 px-4 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
              >
                <UserPlus size={18} /> Register
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ============================
          MOBILE DROPDOWN MENU
      ============================ */}
      <div
        ref={mobileMenuRef}
        className="md:hidden overflow-hidden bg-white text-black px-4 shadow-lg space-y-3 h-0 opacity-0"
      >
        {!isAdmin ? (
          <>
            <button
              onClick={() => setOpen(false)}
              className="py-2 flex items-center gap-2"
            >
              <Calendar size={18} /> Events
            </button>

            <button
              onClick={() => setOpen(false)}
              className=" py-2 flex items-center gap-2"
            >
              <Ticket size={18} /> My Registrations
            </button>
          </>
        ) : (
          <button className=" py-2 flex items-center gap-2">
            <Calendar size={18} /> Admin Panel
          </button>
        )}

        {/* AUTH MOBILE */}
        {user ? (
          <>
            <button className=" py-2 flex items-center gap-2">
              <User size={18} /> Profile
            </button>

            <button className=" py-2 flex items-center gap-2 text-red-600">
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                openLogin();
                setOpen(false);
              }}
              className=" py-2 flex items-center gap-2"
            >
              <LogIn size={18} /> Login
            </button>

            <button
              onClick={() => {
                openSignup();
                setOpen(false);
              }}
              className=" py-2 flex items-center gap-2"
            >
              <UserPlus size={18} /> Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
