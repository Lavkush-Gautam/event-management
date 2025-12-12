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
  const { user, logout } = useAuth();

  const location = useLocation();
  const { openLogin, openSignup } = useAuthModal();

  const isAdmin = user?.role === "admin";

  // Animate mobile menu with GSAP
  useEffect(() => {
    // Use autoAlpha (combined opacity + visibility) and height animation.
    // gsap can animate height: "auto" fine, but to avoid jump we use fromTo on open/close.
    const el = mobileMenuRef.current;
    if (!el) return;

    if (open) {
      // ensure it's visible first so height auto can be calculated
      gsap.killTweensOf(el);
      gsap.set(el, { height: "auto", visibility: "visible" });
      const fullHeight = el.clientHeight; // computed height
      gsap.set(el, { height: 0, opacity: 0, overflow: "hidden" });
      gsap.to(el, { height: fullHeight, opacity: 1, duration: 0.28, ease: "power3.out" });
      // after animation, set to auto so it adapts to content changes
      const timeout = setTimeout(() => gsap.set(el, { height: "auto" }), 300);
      return () => clearTimeout(timeout);
    } else {
      gsap.killTweensOf(el);
      gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: "power3.in", onComplete: () => gsap.set(el, { visibility: "hidden" }) });
    }
  }, [open]);

  // Navbar style and scroll handling (existing logic, preserved)
  useEffect(() => {
    if (location.pathname !== "/") {
      gsap.to(navRef.current, {
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        duration: 0.1,
      });
      return;
    }

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Close mobile menu on route change (in case user navigates via Link)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on Escape key for accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // helper to close menu after action
  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    // keep original logout behavior; ensure menu closes
    try {
      await logout();
    } catch (err) {
      // optional: handle error
      console.error("Logout failed", err);
    } finally {
      closeMenu();
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full z-50"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-3xl font-extrabold tracking-tight flex items-center" onClick={closeMenu}>
          <img src={logo} alt="Logo" className="w-16 h-16 rounded-full inline-block mr-2" />
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
        <button
          className="md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ============================
          MOBILE DROPDOWN MENU
      ============================ */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className="md:hidden overflow-hidden bg-white text-black px-4 shadow-lg space-y-3 opacity-0 visibility-hidden"
        // inline style fallback in case gsap hasn't run yet
        style={{ height: 0 }}
      >
        {!isAdmin ? (
          <>
            <Link
              to="/events"
              onClick={closeMenu}
              className=" py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <Calendar size={18} /> Events
            </Link>

            <Link
              to="/registrations"
              onClick={closeMenu}
              className=" py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <Ticket size={18} /> My Registrations
            </Link>
          </>
        ) : (
          <Link
            to="/admin"
            onClick={closeMenu}
            className="py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <Calendar size={18} /> Admin Panel
          </Link>
        )}

        {/* AUTH MOBILE */}
        {user ? (
          <>
            <Link
              to="/profile"
              onClick={closeMenu}
              className="py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <User size={18} /> Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left py-2 flex items-center gap-2 text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                openLogin();
                closeMenu();
              }}
              className="w-full text-left py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <LogIn size={18} /> Login
            </button>

            <button
              onClick={() => {
                openSignup();
                closeMenu();
              }}
              className="w-full text-left py-2 flex items-center gap-2"
            >
              <UserPlus size={18} /> Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
