import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("login"); // login | signup

  const openLogin = () => {
    setTab("login");
    setIsOpen(true);
  };

  const openSignup = () => {
    setTab("signup");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{ isOpen, tab, openLogin, openSignup, closeModal, setTab }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
